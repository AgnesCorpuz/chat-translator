import controller from './notifications-controller.js';

// Obtain a reference to the platformClient object
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// API instances
const usersApi = new platformClient.UsersApi();
const conversationsApi = new platformClient.ConversationsApi();

let userId = '';
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
            let convId = eventBody.conversation.id;
            let senderId = eventBody.sender.id;

            // Conversation values for cross reference
            let participant = conversation.participants.find(p => p.chats[0].id == senderId);
            let name = participant.name;
            let purpose = participant.purpose;

            addChatMessage(name, message, convId, purpose);

            break;
    }
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
        // view.displayTranscript(data.entities, conversation);
        let conversationId = conversation.id;

        // Show each message
        data.entities.forEach((msg) => {
            if(msg.hasOwnProperty("body")) {
                let message = msg.body;

                // Determine the name by cross referencing sender id 
                // with the participant.chats.id from the conversation parameter
                let senderId = msg.sender.id;
                let name = conversation
                            .participants.find(p => p.chats[0].id == senderId)
                            .name;
                let purpose = conversation
                            .participants.find(p => p.chats[0].id == senderId)
                            .purpose;
                
                addChatMessage(name, message, conversationId, purpose);
            }
        });
    });
}

/**
 * Add a new chat message to the page.
 * @param {String} sender sender name to be displayed
 * @param {String} message chat message to be displayed
 * @param {String} conversationId PureCLoud conversationid
 */
function addChatMessage(sender, message, conversationId, purpose){        
    var chatMsg = document.createElement("p");
    chatMsg.textContent = sender + ": " + message;

    var container = document.createElement("div");
    container.appendChild(chatMsg);
    container.className = "chat-message " + purpose;
    document.getElementById("agent-assist").appendChild(container);

    window.scrollTo({ top: 1000000, behavior: 'smooth' });
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
