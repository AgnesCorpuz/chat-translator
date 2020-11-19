/**
 * This script is focused on the HTML / displaying of data to the page
 */
function updateScroll(){
    let div = document.getElementById('agent-assist');
    div.scrollTop = div.scrollHeight;
}

/**
 * Clear DIV of previous search results
 */
function clearSearchResults(){
    let searchContainer = document.getElementById("search-result-container");

    while (searchContainer.childNodes.length > 1) {  
        searchContainer.removeChild(searchContainer.lastChild);
    }
}

export default {
    /**
     * Add a new chat message to the page.
     * @param {String} sender sender name to be displayed
     * @param {String} message chat message to be displayed
     */
    addChatMessage(sender, message, purpose){        
        let chatMsg = document.createElement('p');
        chatMsg.textContent = sender + ': ' + message;

        let container = document.createElement('div');
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
        let libContainer = document.createElement('button');
        libContainer.textContent = libraryName;
        libContainer.id = 'library-' + libraryId;
        libContainer.className = 'collapsible';
        libContainer.addEventListener('click', function() {
            this.classList.toggle('active');
            let content = this.nextElementSibling;	
            if (content.style.display === 'block') {	
                content.style.display = 'none';	
            } else {	
                content.style.display = 'block';	
            }	
        });
        document.getElementById('libraries-container').appendChild(libContainer);

        let responsesContainer = document.createElement('div');
        responsesContainer.id = 'responses-container-' + libraryId;
        responsesContainer.className = 'content';
        document.getElementById('libraries-container').appendChild(responsesContainer);
    },

    /**
     * Display responses and group by libraries
     * @param {Object} response 
     */
    displayResponses(response){
        // Collapsible response name
        let responseButton = document.createElement('button');
        responseButton.textContent = response.name;
        responseButton.id = 'response-' + response.id;
        responseButton.className = 'collapsible';
        responseButton.addEventListener('click', function() {
            this.classList.toggle('active');
            let content = this.nextElementSibling;	
            if (content.style.display === 'block') {	
                content.style.display = 'none';	
            } else {	
                content.style.display = 'block';	
            }	
        });
        document.getElementById('responses-container-' + response.libraries[0].id).appendChild(responseButton);

        // Response text content
        let responseText = document.createElement('p');
        responseText.innerHTML = response.texts[0].content;
        responseText.id = 'response-content-' + response.id;
        responseText.className = 'content';
        responseText.addEventListener('click', function() {
            document.getElementById('message-textarea').value = response.texts[0].content;
        });
        document.getElementById('responses-container-' + response.libraries[0].id).appendChild(responseText);
    },

    /**
     * Displays all search results in a DIV
     * @param {object} results 
     */
    displaySearchResults(results){
        // Collapsible response name
        let responseButton = document.createElement('button');
        responseButton.textContent = results.name;
        responseButton.id = 'response-' + results.id;
        responseButton.className = 'collapsible';
        responseButton.addEventListener('click', function() {
            this.classList.toggle('active');
            let content = this.nextElementSibling;	
            if (content.style.display === 'block') {	
                content.style.display = 'none';	
            } else {	
                content.style.display = 'block';	
            }	
        });
        document.getElementById('search-result-container').appendChild(responseButton);

        // Response text content
        let responseText = document.createElement('p');
        responseText.innerHTML = results.texts[0].content;
        responseText.id = 'response-content-' + results.id;
        responseText.className = 'content';
        responseText.addEventListener('click', function() {
            document.getElementById('message-textarea').value = response.texts[0].content;
        });
        document.getElementById('search-result-container').appendChild(responseText);
    },

    /**
     * This toggles between showing Canned Responses or Search Results
     */
    toggleDIVs(){
        let cannedDIV = document.getElementById('libraries-container');
        let searchDIV = document.getElementById('search-result-container');

        if(cannedDIV.style.display === 'block'){
            cannedDIV.style.display = 'none';
            searchDIV.style.display = 'block';
        } else {
            cannedDIV.style.display = 'block';
            searchDIV.style.display = 'none';
        }

        // Clear DIV of previous search results
        let searchContainer = document.getElementById("search-result-container");
        if(searchContainer.childNodes.length > 1) clearSearchResults();
    }
}