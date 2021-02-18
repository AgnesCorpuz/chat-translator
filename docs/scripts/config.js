export default {
    clientID: '5f3e661d-61be-4a13-b536-3f54f24e26c9',

    testUri: 'https://localhost/',
    prodUri:  'https://genesysappfoundry.github.io/chat-translator/',

    genesysCloud: {
        // Genesys Cloud region
        // eg. 'mypurecloud.ie', 'euw2.pure.cloud', etc...
        region: 'mypurecloud.com'
    },

    awsEndpoints: {
        getKey: 'https://i0k1088d5m.execute-api.us-east-1.amazonaws.com/chat-assistant-getkey',
        translateText: 'https://i0k1088d5m.execute-api.us-east-1.amazonaws.com/chat-assistant-translate?key='
    }
}