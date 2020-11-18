import view from './view.js';

// Obtain a reference to the platformClient object
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// API instances
const responseManagementApi = new platformClient.ResponseManagementApi();

function getLibraries(){    
    return responseManagementApi.getResponsemanagementLibraries()
    .then((libraries) => {
        libraries.entities.forEach((library) => {
            view.displayLibraries(library.id, library.name);
            getResponses(library.id);
        });
    });
}

function getResponses(libraryId){
    return responseManagementApi.getResponsemanagementResponses(libraryId)
    .then((responses) => {
        responses.entities.forEach((response) => {
            view.displayResponses(response);
            view.addEventListeners();
        });
    });
}

/** --------------------------------------------------------------
 *                       INITIAL SETUP
 * -------------------------------------------------------------- */
client.loginImplicitGrant(
    '5f3e661d-61be-4a13-b536-3f54f24e26c9',
    'https://genesysappfoundry.github.io/chat-translator/canned-response.html'
).then(data => {
    return getLibraries();
})