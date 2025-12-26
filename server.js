import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs"
import http, { createServer } from "http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import formatMessage from "./src/utils/format-message.js";
import connectDB from "./src/utils/db.js";
import User from "./src/models/users.js";
import Message from "./src/models/messages.js";
import Room from "./src/models/rooms.js";

await connectDB(process.env.ATLAS_URI);
await User.deleteMany({});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const app = express();
const server = createServer(app);

// Initialize socket
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Dynamic HTML file serving middleware
app.use((req, res, next) => {
  const requestedFile = req.path === "/" ? "index.html" : `${req.path.slice(1)}.html`;
  const filePath = path.join(__dirname, "public", requestedFile);
  return fs.existsSync(filePath) ? res.sendFile(filePath) : next()
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

const botName = "ChatCord Bot";

// Run on connection
io.on("connection", (socket) => {
  // Broadcasts to ALL clients
  io.emit("everyone", "This emits to everyone");

  // Listen for chat message
  socket.on("chatMessage", async (msg) => {
    const user = await User.findById(socket.id);

    if (user) {
      const message = formatMessage(user.username, msg, user.room);

      await Message.create(message);
      io.to(user.room).emit("message", message);
    } else {
      socket.emit(
        "message",
        formatMessage(
          botName,
          "Your profile was not found. Try leaving and re-entering the room"
        )
      );
    }
  });

  // * TODO: Make a nicer frontend using CHATGPT
  // send all your code to it for better understanding

  // Listen for join room
  socket.on("joinRoom", async ({ username, room }) => {
    const user = await User.create({
      _id: socket.id,
      username,
      room,
    });

    let roomDoc = await Room.findOne({ name: room });
    if (!roomDoc) {
      roomDoc = await Room.create({ name: room });
    }

    socket.join(user.room);

    // Welcome new user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Send previous messages
    const messages = await Message.find({ room })
      .select("-_id username text time")
      .lean({ versionKey: false });

    console.log(messages);
    messages.forEach((message) => socket.emit("message", message));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: await User.find({ room: user.room }).lean({ versionKey: false }),
    });
  });

  // Runs when client disconnects
  socket.on("disconnect", async () => {
    const user = await User.findById(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      await User.deleteOne({ _id: socket.id });

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: await User.find({ room: user.room }).lean({ versionKey: false }),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Socket listening on PORT ${PORT}`);
});
