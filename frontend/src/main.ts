import { io, Socket } from "socket.io-client";
import outputMessage from "./output-message";
import Qs from "qs";

// Connect to backend
const socket: Socket = io(import.meta.env.VITE_SOCKET);
const chatForm = document.getElementById("chat-form") as HTMLFormElement;
const chatMessages = document.querySelector(".chat-messages") as HTMLDivElement

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

// Join chatroom
socket.emit("joinRoom", { username, room })

interface roomUsers {
  room: string
  users: Record<any, any>[]
}

// Get room and users
socket.on("roomUsers", ({ room, users }: roomUsers) => {
  document.getElementById("room-name")!.innerText = room
  document.getElementById("users")!.innerHTML = users.map((user) => `<li>${user.username}</li>`).join("\n")
})

socket.on("connect", () => {
  console.log(
    `Connected to server: ${socket.id} through ${import.meta.env.VITE_SOCKET}`
  );
});

socket.on("message", (message: any) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
});

chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const msg = this.elements.namedItem("msg") as HTMLInputElement; // get by its id

  socket.emit("chatMessage", msg.value); // Emit message to server
  msg.value = ""; // Clear input
});
