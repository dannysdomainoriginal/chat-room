type Message = {
  username: string;
  text: string;
  time: string;
};

// Output message
const outputMessage = ({ username, text, time}: Message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${username} <span>${time}</span></p>
    <p class="text">
      ${text}
    </p>
  `;

  document.querySelector(".chat-messages")!.appendChild(div);
};

export default outputMessage;
