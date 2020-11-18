/**
 * This script is focused on the HTML / displaying of data to the page
 */
function updateScroll() {
    var div = document.getElementById('agent-assist');
    div.scrollTop = div.scrollHeight;
}

export default {
    /**
     * Add a new chat message to the page.
     * @param {String} sender sender name to be displayed
     * @param {String} message chat message to be displayed
     */
    addChatMessage(sender, message, purpose){        
        var chatMsg = document.createElement('p');
        chatMsg.textContent = sender + ': ' + message;

        var container = document.createElement('div');
        container.appendChild(chatMsg);
        container.className = 'chat-message ' + purpose;
        document.getElementById('agent-assist').appendChild(container);

        updateScroll();
    },

    displayLibraries(libraryId, libraryName){
        var libContainer = document.createElement('div');
        libContainer.textContent = libraryName;
        libContainer.id = 'library-' + libraryId;
        libContainer.className = 'library';
        libContainer.addEventListener('click', function(event) {
            // Show or hide responses
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });

        document.getElementById('libraries-container').appendChild(libContainer);
    },

    displayResponses(response){
        var responsesContainer = document.createElement('div');
        responsesContainer.textContent = response.name;
        responsesContainer.id = 'response-' + response.id;
        responsesContainer.className = 'responses content';
        responsesContainer.style.display = 'none';
        responsesContainer.addEventListener('click', function() {
            // Show or hide text content
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });

        var contentContainer = document.createElement('div');
        contentContainer.innerHTML = response.texts[0].content;
        contentContainer.id = 'response-content-' + response.id;
        contentContainer.className = 'content';
        contentContainer.style.display = 'none';
        contentContainer.addEventListener('click', function() {
            // Add response in textarea
            document.getElementById('message-textarea').innerHTML = response.texts[0].content;
            window.location = 'index.html';
        });

        document.getElementById('library-' + response.libraries[0].id).appendChild(responsesContainer);
        document.getElementById('response-' + response.id).appendChild(contentContainer);
    }
}