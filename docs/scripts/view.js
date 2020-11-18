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
        var libContainer = document.createElement('button');
        libContainer.textContent = libraryName;
        libContainer.id = 'library-' + libraryId;
        libContainer.className = 'collapsible';
        libContainer.addEventListener('click', function() {
            this.classList.toggle('active');
            var content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });

        document.getElementById('libraries-container').appendChild(libContainer);
    },

    displayResponses(response){
        var responsesContainer = document.createElement('div');
        responsesContainer.id = 'responses-container-' + response.id;
        responsesContainer.className = 'content';
        document.getElementById('libraries-container').appendChild(responsesContainer);

        var responseButton = document.createElement('button');
        responseButton.textContent = response.name;
        responseButton.id = 'response-' + response.id;
        responseButton.className = 'collapsible';
        responseButton.addEventListener('click', function() {
            this.classList.toggle('active');
            var content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
        document.getElementById('responses-container').appendChild(responseButton);

        var responseText = document.createElement('p');
        responseText.textContent = response.texts[0].content;;
        responseText.id = 'response-content-' + response.id;
        responseText.className = 'content';
        responseText.addEventListener('click', function() {
            // Add response in textarea
            document.getElementById('message-textarea').innerHTML = response.texts[0].content;
            window.location = 'index.html';
        });
        document.getElementById('responses-container').appendChild(responseText);
    }
}