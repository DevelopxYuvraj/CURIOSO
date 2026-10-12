/* =================================
   CURIOSO AI CHATBOT - STEP 3
================================= */

document.addEventListener("DOMContentLoaded", function () {

    const chatbot = document.getElementById("chatbotContainer");
    const toggleButton = document.getElementById("chatbotToggle");
    const closeButton = document.getElementById("chatbotClose");
    const input = document.getElementById("chatbotInput");
    const sendButton = document.getElementById("chatbotSend");
    const messages = document.getElementById("chatbotMessages");

    /* --------------------------------
       OPEN CHATBOT
    -------------------------------- */

    if (toggleButton) {
        toggleButton.addEventListener("click", function () {
            chatbot.style.display = "flex";
            input.focus();
        });
    }

    /* --------------------------------
       CLOSE CHATBOT
    -------------------------------- */

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            chatbot.style.display = "none";
        });
    }

    /* --------------------------------
       ADD MESSAGE
    -------------------------------- */

    function addMessage(text, sender) {

        const message = document.createElement("div");

        message.classList.add(
            "chat-message",
            sender === "user"
                ? "user-message"
                : "bot-message"
        );

        message.textContent = text;

        messages.appendChild(message);

        messages.scrollTop = messages.scrollHeight;
    }

    /* --------------------------------
       SEND MESSAGE
    -------------------------------- */

    

        async function sendMessage() {

    const userText = input.value.trim();

    if (userText === "") {
        return;
    }

    // Show user's message
    addMessage(userText, "user");

    // Clear input
    input.value = "";

    // Show temporary loading message
    addMessage("Thinking...", "bot");

    try {

        const response = await fetch("http://localhost:3000/api/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: userText
            })
        });

        const data = await response.json();

        // Remove "Thinking..." message
        const allMessages = messages.querySelectorAll(".chat-message");
        const lastMessage = allMessages[allMessages.length - 1];

        if (lastMessage && lastMessage.textContent === "Thinking...") {
            lastMessage.remove();
        }

        if (!response.ok) {
            throw new Error(data.error || "Server error");
        }

        // Show AI response
        addMessage(data.reply, "bot");

    } catch (error) {

        console.error("Chatbot Error:", error);

        // Remove "Thinking..." message
        const allMessages = messages.querySelectorAll(".chat-message");
        const lastMessage = allMessages[allMessages.length - 1];

        if (lastMessage && lastMessage.textContent === "Thinking...") {
            lastMessage.remove();
        }

        addMessage(
            "Sorry, I couldn't connect to the AI. Please try again.",
            "bot"
        );
    }
}

    /* --------------------------------
       SEND BUTTON
    -------------------------------- */

    if (sendButton) {
        sendButton.addEventListener("click", sendMessage);
    }

    /* --------------------------------
       ENTER KEY
    -------------------------------- */

    if (input) {
        input.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
            }

        });
    }

    /* --------------------------------
       SUGGESTION BUTTON
    -------------------------------- */

    window.askSuggestion = function (question) {

        input.value = question;

        sendMessage();
    };

});