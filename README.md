# ChatCord – Realtime Chat Room App

A realtime chat room application built with **Node.js**, **Express**, **Socket.io**, and **MongoDB**. Users can join rooms, send messages, and see live updates of other users in the room. Messages are persisted in MongoDB and previous messages are loaded when a user joins a room.  
URL = [https://dannysdomain-chatroom.onrender.com](https://dannysdomain-chatroom.onrender.com)  

26th December 2025 - Successfully upgraded UI using AI

**Please contribute to the project 💪**

## Features

* Join specific chat rooms by username.
* Realtime messaging using **Socket.io**.
* Persistent chat messages stored in **MongoDB**.
* Tracks users in each room and broadcasts join/leave notifications.
* Loads previous messages automatically when a user joins a room.
* Friendly **bot messages** for welcome, join, and leave notifications.
* Simple, responsive UI built with HTML, CSS, and **Font Awesome** icons.

## Tech Stack

* **Node.js** – Backend runtime
* **Express** – HTTP server and routing
* **Socket.io** – Realtime WebSocket communication
* **MongoDB / Mongoose** – Database and schema modeling
* **dotenv** – Environment variable management

## Folder Structure

```
chatcord/
├─ public/                
│  ├─ index.html          # Landing page / join chat form
│  ├─ chat.html           # Chat room interface
│  ├─ css/                # Stylesheets
│  └─ fontawesome/        # Icons
├─ src/
│  ├─ models/
│  │  ├─ users.js         # User schema
│  │  ├─ messages.js      # Message schema
│  │  └─ rooms.js         # Room schema
│  └─ utils/
│     ├─ db.js            # MongoDB connection helper
│     └─ format-message.js# Message formatting utility
├─ server.js              # Main server file
├─ package.json
└─ .env                   # Environment variables (MONGO_URI, PORT)
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/dannysdomainoriginal/chat-room.git
cd chat-room
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root:

```
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

4. Start the server:

```bash
npm start
```

5. Open your browser and go to:

```
http://localhost:3000
```

## Usage

1. Open the app in multiple browser tabs or devices.
2. On the landing page (`index.html`), enter:

   * **Username**
   * **Unique room name** (share with friends to join the same room)
3. Click **Join Chat** to enter the room (`chat.html`).
4. Send messages in realtime.
5. See previous messages and live updates when users join or leave.

## Key Code Highlights

### 1. Socket.io Events

* `joinRoom` – Adds a user to a room, creates the room if needed, and sends previous messages.
* `chatMessage` – Handles sending a new message to the room and storing it in MongoDB.
* `disconnect` – Removes the user from the database and broadcasts leave notifications.

### 2. MongoDB Schemas

* **User**: `_id` (socket ID), `username`, `room`
* **Message**: `username`, `text`, `room`, `time`
* **Room**: `name`

### 3. Utilities

* `formatMessage(username, text, room)` – Standardizes message format.
* `connectDB(uri)` – Connects to MongoDB using Mongoose.

## UI Notes

* The **landing page** uses `index.html` with a responsive form:

  * Users input their username and a **unique room name**.
  * Room names follow a freeform pattern (e.g., `room:h-1ewq:random`) and must be shared with friends.
* Uses **Font Awesome** for icons (`fas fa-smile` on header).
* Styles are in `css/style.css` and applied to the join page and chat interface.

## 404 Page

Any route that doesn’t match a file will serve a custom `404.html` page from the `public` folder.

## Notes

* All messages are persisted in MongoDB and fetched when a user joins a room.
* Socket IDs are used as unique user identifiers.
* Messages are formatted with timestamps before broadcasting.

## Future Improvements

* Add user authentication.
* Enable private messaging between users.
* Improve UI/UX with React or another frontend framework.
* Be creative