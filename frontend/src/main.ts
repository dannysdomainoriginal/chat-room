import { io, Socket } from "socket.io-client";
import Qs from "qs";

// -----------------------------
// Socket
// -----------------------------
const socket: Socket = io(
  import.meta.env.DEV ? import.meta.env.VITE_SOCKET : undefined
);

const chatForm = document.getElementById("chat-form") as HTMLFormElement;
const chatMessages = document.querySelector(".chat-messages") as HTMLDivElement;
const msgInput = document.getElementById("msg") as HTMLInputElement;

// -----------------------------
// Query params
// -----------------------------
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
}) as { username: string; room: string };

if (!username || !room) {
  alert("Username and room are required to access this page");
  location.href = "/";
}

// Join room
socket.emit("joinRoom", { username, room });

// -----------------------------
// Sidebar (mobile drawer)
// -----------------------------
const sidebar = document.getElementById("sidebar") as HTMLElement;
const header = document.querySelector("header") as HTMLElement;

function setupSidebar() {
  if (!sidebar || !header) return;

  // Backdrop
  const backdrop = document.createElement("div");
  backdrop.className = "fixed inset-0 bg-black/40 z-30 hidden md:hidden";
  document.body.appendChild(backdrop);

  // Hamburger button
  const toggleBtn = document.createElement("button");
  toggleBtn.className =
    "md:hidden inline-flex items-center justify-center rounded-lg border border-white/20 p-2 hover:bg-white/20 transition";
  toggleBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
      viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
  `;
  header.prepend(toggleBtn);

  // Mobile header inside sidebar
  const mobileHeader = document.createElement("div");
  mobileHeader.className = "md:hidden flex items-center justify-between mb-4";

  mobileHeader.innerHTML = `
    <span class="font-semibold">Room Info</span>
    <button id="close-sidebar" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
      ✕
    </button>
  `;
  sidebar.prepend(mobileHeader);

  const closeBtn = mobileHeader.querySelector(
    "#close-sidebar"
  ) as HTMLButtonElement;

  function openSidebar() {
    sidebar.classList.remove("-translate-x-full");
    backdrop.classList.remove("hidden");
  }

  function closeSidebar() {
    sidebar.classList.add("-translate-x-full");
    backdrop.classList.add("hidden");
  }

  toggleBtn.addEventListener("click", openSidebar);
  closeBtn.addEventListener("click", closeSidebar);
  backdrop.addEventListener("click", closeSidebar);
}

setupSidebar();

// -----------------------------
// Smart scroll
// -----------------------------
function shouldAutoScroll() {
  const threshold = 120;
  return (
    chatMessages.scrollHeight -
      chatMessages.scrollTop -
      chatMessages.clientHeight <
    threshold
  );
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// -----------------------------
// Messages (chat bubbles)
// -----------------------------
type Message = {
  username: string;
  text: string;
  time: string;
};

function outputMessage({ username: from, text, time }: Message) {
  const isSelf = from === username;
  const isSystem = from.toLowerCase().includes("bot");

  const wrapper = document.createElement("div");
  wrapper.className = `flex ${
    isSystem ? "justify-center" : isSelf ? "justify-end" : "justify-start"
  }`;

  const bubble = document.createElement("div");

  if (isSystem) {
    bubble.className =
      "text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full";
    bubble.textContent = text;
  } else {
    bubble.className = `
      max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow
      ${
        isSelf
          ? "bg-indigo-600 text-white rounded-br-sm"
          : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm"
      }
    `;
    bubble.innerHTML = `
      <div class="text-xs opacity-70 mb-0.5">
        ${isSelf ? "You" : from} · ${time}
      </div>
      <div>${text}</div>
    `;
  }

  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);
}

// -----------------------------
// Room users
// -----------------------------
socket.on("roomUsers", ({ room, users }) => {
  document.getElementById("room-name")!.textContent = room;
  document.getElementById("users")!.innerHTML = users
    .map(
      (u: any) =>
        `<li>${u.username}${u.username === username ? " (you)" : ""}</li>`
    )
    .join("");
});

// -----------------------------
// Incoming messages
// -----------------------------
socket.on("message", (message: Message) => {
  const autoScroll = shouldAutoScroll();
  outputMessage(message);
  if (autoScroll) scrollToBottom();
});

// -----------------------------
// Form submit
// -----------------------------
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!msgInput.value.trim()) return;

  socket.emit("chatMessage", msgInput.value);
  msgInput.value = "";
  msgInput.focus();
});
