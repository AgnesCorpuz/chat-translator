/**
 * This script is focused on the HTML / displaying of data to the page
 */
function updateScroll() {
    window.scrollTo({ top: 1000000, behavior: 'smooth' });
}

export default {
    /**
     * Add a new chat message to the page.
     * @param {String} sender sender name to be displayed
     * @param {String} message chat message to be displayed
     */
    addChatMessage(sender, message, purpose){        
        var chatMsg = document.createElement("p");
        chatMsg.textContent = sender + ": " + message;

        var container = document.createElement("div");
        container.appendChild(chatMsg);
        container.className = "chat-message " + purpose;
        document.getElementById("agent-assist").appendChild(container);

        updateScroll();
    }
}