const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function askAI() {
  const question = input.value.trim();
  if (!question) return;

  addMessage(question, "user");
  input.value = "";

  addMessage("Thinking...", "ai");

  try {
    const response = await fetch("/.netlify/functions/ask-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    const lastMessage = chatBox.querySelector(".ai:last-child");
    if (lastMessage) lastMessage.remove();

    addMessage(data.answer, "ai");

  } catch (err) {
    const lastMessage = chatBox.querySelector(".ai:last-child");
    if (lastMessage) lastMessage.remove();
    addMessage("Error connecting to AI.", "ai");
    console.error(err);
  }
}