/**
 * This script is focused on the HTML / displaying of data to the page
 */
function updateScroll(){
    var div = document.getElementById('agent-assist');
    div.scrollTop = div.scrollHeight;
}

/**
 * Add response in textarea
 * @param {String} text 
 */
function addResponseText(text){
    document.getElementById('message-textarea').innerHTML = text;
    window.location = 'index.html';
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

    /**
     * Display list of libraries
     * @param {String} libraryId 
     * @param {String} libraryName 
     */
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

    /**
     * Display responses and group by libraries
     * @param {Object} response 
     */
    displayResponses(response){
        // DIV that will contain response name and text
        var responsesContainer = document.createElement('div');
        responsesContainer.id = 'responses-container-' + response.id;
        responsesContainer.className = 'content';
        document.getElementById('libraries-container').appendChild(responsesContainer);

        // Collapsible response name
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
        document.getElementById('responses-container-' + response.id).appendChild(responseButton);

        // Response text content
        var responseText = document.createElement('p');
        responseText.textContent = response.texts[0].content;;
        responseText.id = 'response-content-' + response.id;
        responseText.className = 'content';
        responseText.addEventListener('click', () => addResponseText(response.texts[0].content));
        document.getElementById('responses-container-' + response.id).appendChild(responseText);
    }
}