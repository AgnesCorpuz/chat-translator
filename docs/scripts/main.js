import view from './view.js';
import controller from './notifications-controller.js';
import translate from './translate-service.js';
// import cannedResponse from './canned-response.js';

// Obtain a reference to the platformClient object
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// API instances
const usersApi = new platformClient.UsersApi();
const conversationsApi = new platformClient.ConversationsApi();
const responseManagementApi = new platformClient.ResponseManagementApi();

let userId = '';
let currentConversation = null;
let currentConversationId = '';
let translationData = null;
let genesysCloudLanguage = 'en-us';

/**
 * Callback function for 'message' and 'typing-indicator' events.
 * For this sample, it will merely display the chat message into the page.
 * 
 * @param {Object} data the event data  
 */
let onMessage = (data) => {
    switch(data.metadata.type){
        case 'typing-indicator':
            break;
        case 'message':
            // Values from the event
            let eventBody = data.eventBody;
            let message = eventBody.body;
            let senderId = eventBody.sender.id;

            // Conversation values for cross reference
            let participant = currentConversation.participants.find(p => p.chats[0].id == senderId);
            let name = participant.name;
            let purpose = participant.purpose;

            // Wait for translate to finish before calling addChatMessage
            translate.translateText(message, genesysCloudLanguage, function(translatedData) {
                view.addChatMessage(name, translatedData.translated_text, purpose);
                translationData = translatedData;
            });

            break;
    }
};

/**
 *  Translate then send message to the customer
 */
function sendChat(){
    let message = document.getElementById('message-textarea').value;
    let agent = currentConversation.participants.find(p => p.purpose == 'agent');
    let communicationId = agent.chats[0].id;

    // Translate text to customer's local language
    translate.translateText(message, translationData.source_language, function(translatedData) {
        // Wait for translate to finish before calling sendMessage
        sendMessage(translatedData.translated_text, currentConversationId, communicationId);
    });

    document.getElementById('message-textarea').value = '';
};

/**
 *  Send message to the customer
 */
function sendMessage(message, conversationId, communicationId){
    conversationsApi.postConversationsChatCommunicationMessages(
        conversationId, communicationId,
        {
            'body': message,
            'bodyType': 'standard'
        }
    )
}

/**
 * Show the chat messages for a conversation
 * @param {String} conversationId 
 * @returns {Promise} 
 */
function showChatTranscript(conversationId){
    return conversationsApi.getConversationsChatMessages(conversationId)
    .then((data) => {
        // Show each message
        data.entities.forEach((msg) => {
            if(msg.hasOwnProperty('body')) {
                let message = msg.body;

                // Determine the name by cross referencing sender id 
                // with the participant.chats.id from the conversation parameter
                let senderId = msg.sender.id;
                let name = currentConversation
                            .participants.find(p => p.chats[0].id == senderId)
                            .name;
                let purpose = currentConversation
                            .participants.find(p => p.chats[0].id == senderId)
                            .purpose;

                // Wait for translate to finish before calling addChatMessage
                translate.translateText(message, genesysCloudLanguage, function(translatedData) {
                    view.addChatMessage(name, translatedData.translated_text, purpose);
                    translationData = translatedData;
                });
            }
        });
    });
}

/**
 * Set-up the channel for chat conversations
 */
function setupChatChannel(){
    return controller.createChannel()
    .then(data => {
        // Subscribe to incoming chat conversations
        return controller.addSubscription(
            `v2.users.${userId}.conversations.chats`,
            subscribeChatConversation(currentConversationId));
    });
}

/**
 * Subscribes the conversation to the notifications channel
 * @param {String} conversationId 
 * @returns {Promise}
 */
function subscribeChatConversation(conversationId){
    return controller.addSubscription(
            `v2.conversations.chats.${conversationId}.messages`,
            onMessage);
}

/**	
 * This toggles between translator and canned response iframe	
 */	
function toggleIframe(){	
    let label = document.getElementById('toggle-iframe').textContent;	

    if(label === 'Open Chat Translator'){	
        document.getElementById('toggle-iframe').textContent = 'Back to Chat Translator';
        document.getElementById('agent-assist').style.display = 'block';
        document.getElementById('canned-response-container').style.display = 'none';
    } else {	
        document.getElementById('toggle-iframe').textContent = 'Open Chat Translator';
        document.getElementById('agent-assist').style.display = 'none';
        document.getElementById('canned-response-container').style.display = 'block';
        
        // Only call getLibraries function if element does not have a child
        if(document.getElementById('libraries-container').childNodes.length == 0) getLibraries();
    }	
}

/** --------------------------
 *  CANNED RESPONSE FUNCTIONS
 * ------------------------ */
function getLibraries(){    
    return responseManagementApi.getResponsemanagementLibraries()
    .then((libraries) => {
        libraries.entities.forEach((library) => {
            getResponses(library.id, library.name);
        });
    });
}

function getResponses(libraryId, libraryName){
    return responseManagementApi.getResponsemanagementResponses(libraryId)
    .then((responses) => {
        view.displayLibraries(libraryId, libraryName);

        responses.entities.forEach((response) => {
            view.displayResponses(response);
        });
    });
}

function searchResponse(query){
    return responseManagementApi.postResponsemanagementResponsesQuery({'queryPhrase': query})
    .then((responses) => {
        responses.entities.forEach((response) => {
            view.displayResponses(response);
        });
    });
}

/** --------------------------------------------------------------
 *                       EVENT HANDLERS
 * -------------------------------------------------------------- */
document.getElementById('toggle-iframe')	
    .addEventListener('click', () => toggleIframe());

document.getElementById('chat-form')
    .addEventListener('submit', () => sendChat());

document.getElementById('btn-send-message')
    .addEventListener('click', () => sendChat());

document.getElementById('message-textarea')
    .addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendChat();
            if(e.preventDefault) e.preventDefault(); // prevent new line
            return false; // Just a workaround for old browsers
        }
    });

document.getElementById('find-response-btn')
    .addEventListener('click', function(){
        let query = document.getElementById('find-response').textContent;
        searchResponse(query);
    });
document.getElementById('find-response-btn')
    .addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            let query = document.getElementById('find-response').textContent;
            searchResponse(query);
        }
    });

// document.getElementById('find-response')
//     .addEventListener('change', function(){
//         let query = document.getElementById('find-response').textContent;
//         searchResponse(query);
//     });

/** --------------------------------------------------------------
 *                       INITIAL SETUP
 * -------------------------------------------------------------- */
const urlParams = new URLSearchParams(window.location.search);
currentConversationId = urlParams.get('conversationid');
genesysCloudLanguage = urlParams.get('language');

client.setPersistSettings(true, 'chat-translator');
client.loginImplicitGrant(
    '5f3e661d-61be-4a13-b536-3f54f24e26c9',
    'https://genesysappfoundry.github.io/chat-translator/',
    { state: JSON.stringify({
        conversationId: currentConversationId,
        language: genesysCloudLanguage
    }) })
.then(data => {
    console.log(data);

    // Assign conversation id
    let stateData = JSON.parse(data.state);
    currentConversationId = stateData.conversationId;
    genesysCloudLanguage = stateData.language;
    
    // Get Details of current User
    return usersApi.getUsersMe();
}).then(userMe => {
    userId = userMe.id;

    // Get current conversation
    return conversationsApi.getConversation(currentConversationId);
}).then((conv) => { 
    currentConversation = conv;

    return setupChatChannel();
}).then(data => { 
    // Get current chat conversations
    return showChatTranscript(currentConversationId);
}).then(data => {
    console.log('Finished Setup');

// Error Handling
}).catch(e => console.log(e));
