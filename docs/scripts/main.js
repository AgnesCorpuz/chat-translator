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
                // translate.translateToEng(message), function(translatedMsg) {
                //     view.addChatMessage(name, translatedMsg, purpose);
                // }
                translateToEng(message, function(translatedMsg) {
                    view.addChatMessage(name, translatedMsg, purpose);
                });
            } else if (purpose == 'agent') {
                view.addChatMessage(name, message, purpose);
            }

            break;
    }
};

function translateToEng(text, translated){
    // Sample body ng kailangan itranslate
    let data = {
        raw_text: text,
        source_language: 'auto',
        target_language: 'en'
    }

    fetch('https://i0k1088d5m.execute-api.us-east-1.amazonaws.com/chat-assistant-translate',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    )
    .then(response => response.json())
    .then(translationData => {
        // Response nung translation
        let translated_text = translationData.translated_text;
        console.log(translated_text);

        translated(translated_text);
    })
    .catch(e => console.error(e));
}

/**
 * Translate then send message to the customer
 */
function sendMessage(){
    let message = document.getElementById("message-textarea").value;
    let translatedMsg = translate.translateToEng(message);

    view.addChatMessage(userName, translatedMsg, "agent");
};

/**
 * Show the chat messages for a conversation
 * @param {String} conversationId 
 * @returns {Promise} 
 */
function showChatTranscript(conversationId){
    let conversation = activeConversations.find(c => c.id == conversationId);

    return conversationsApi.getConversationsChatMessages(conversationId)
    .then((data) => {
        // Show each message
        data.entities.forEach((msg) => {
            if(msg.hasOwnProperty("body")) {
                let message = msg.body;
                let translatedMsg = null;

                // Determine the name by cross referencing sender id 
                // with the participant.chats.id from the conversation parameter
                let senderId = msg.sender.id;
                let name = conversation
                            .participants.find(p => p.chats[0].id == senderId)
                            .name;
                let purpose = conversation
                            .participants.find(p => p.chats[0].id == senderId)
                            .purpose;
                
                translatedMsg = translate.translateToEng(message);
                view.addChatMessage(name, translatedMsg, purpose);
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
    .addEventListener("submit", () => sendMessage());

document.getElementById('btn-send-message')
    .addEventListener('click', () => sendMessage());

document.getElementById("message-textarea")
    .addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            $('#chat-form').submit();
        }
    })

/** --------------------------------------------------------------
 *                       INITIAL SETUP
 * -------------------------------------------------------------- */
const urlParams = new URLSearchParams(window.location.search);
currentConversationId = urlParams.get('conversationid');

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
