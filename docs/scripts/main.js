import view from './view.js';
import controller from './notifications-controller.js';
import translate from './translate-service.js'

// Obtain a reference to the platformClient object
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// API instances
const usersApi = new platformClient.UsersApi();
const conversationsApi = new platformClient.ConversationsApi();

let userId = '';
let userName = '';
let currentConversation = null;
let currentConversationId = '';
let communicationId;
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

            // Call translate service if message from customer
            if(purpose == 'customer') {
                // Wait for translate to finish before calling addChatMessage
                translate.translateText(message, genesysCloudLanguage, function(translatedData) {
                    view.addChatMessage(name, translatedData.translated_text, purpose);
                    translationData = translatedData;
                });
            } else if (purpose == 'agent') {
                // Wait for translate to finish before calling addChatMessage
                translate.translateText(message, genesysCloudLanguage, function(translatedData) {
                    view.addChatMessage(name, translatedData.translated_text, purpose);
                    translationData = translatedData;
                });
                
                let agent = currentConversation.participants.find(p => p.purpose == 'agent');
                communicationId = agent.chats[0].id;
            }

            break;
    }
};

/**
 * Translate then send message to the customer
 */
function sendChat(){
    let message = document.getElementById("message-textarea").value;
    let agent = currentConversation.participants.find(p => p.purpose == 'agent');
    communicationId = agent.chats[0].id;

    // Translate text to customer's local language
    translate.translateText(message, translationData.source_language, function(translatedData) {
        // Wait for translate to finish before calling sendMessage
        sendMessage(translatedData.translated_text, currentConversationId, communicationId);
    });

    document.getElementById("message-textarea").value = '';
};

/**
 * TSend message to the customer
 */
function sendMessage(message, conversationId, communicationId){
    conversationsApi.postConversationsChatCommunicationMessages(
        conversationId, communicationId,
        {
            "body": message,
            "bodyType": "standard"
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
            if(msg.hasOwnProperty("body")) {
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
                translate.translateToEng(message, genesysCloudLanguage, function(translatedData) {
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

/** --------------------------------------------------------------
 *                       EVENT HANDLERS
 * -------------------------------------------------------------- */
document.getElementById("chat-form")
    .addEventListener("submit", () => sendChat());

document.getElementById('btn-send-message')
    .addEventListener('click', () => sendChat());

document.getElementById("message-textarea")
    .addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendChat();
            if(e.preventDefault) e.preventDefault(); // prevent new line
            return false; // Just a workaround for old browsers
        }
    })

/** --------------------------------------------------------------
 *                       INITIAL SETUP
 * -------------------------------------------------------------- */
const urlParams = new URLSearchParams(window.location.search);
currentConversationId = urlParams.get('conversationid');
genesysCloudLanguage = urlParams.get('language');

client.loginImplicitGrant(
    '5f3e661d-61be-4a13-b536-3f54f24e26c9',
    'https://agnescorpuz.github.io/chat-translator/',
    { state: currentConversationId })
.then(data => {
    console.log(data);

    // Assign conversation id
    currentConversationId = data.state;
    
    // Get Details of current User
    return usersApi.getUsersMe();
}).then(userMe => {
    userId = userMe.id;
    userName = userMe.name;

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
