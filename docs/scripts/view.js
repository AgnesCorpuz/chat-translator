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
        libContainer.addEventListener('click', function(event) {
            // Show or hide responses
            var x = document.querySelectorAll('#library-' + libraryId);
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }
        });

        document.getElementById('libraries-container').appendChild(libContainer);
    },

    displayResponses(response){
        var responsesContainer = document.createElement('div');
        responsesContainer.textContent = response.name;
        responsesContainer.id = 'response-' + response.id;
        responsesContainer.addEventListener('click', function() {
            // Show or hide text content
            var x = document.querySelectorAll('#response-' + response.id);
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }
        });

        var contentContainer = document.createElement('div');
        contentContainer.innerHTML = response.texts[0].content;
        contentContainer.id = 'response-content-' + response.id;
        contentContainer.addEventListener('click', function() {
            // Add response in textarea
            document.getElementById('message-textarea').innerHTML = response.texts[0].content;
            window.location = 'index.html';
        });

        document.getElementById('library-' + response.libraries[0].id).appendChild(responsesContainer);
        document.getElementById('response-' + response.id).appendChild(contentContainer);
    }
}