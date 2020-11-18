import view from './view.js';

// Obtain a reference to the platformClient object
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// API instances
const responseManagementApi = new platformClient.ResponseManagementApi();

function getLibraries(){
    let body = [{
        'pageNumber': 1,
        'pageSize': 25
    }];
    
    return responseManagementApi.getResponsemanagementLibraries(body)
    .then((libraries) => {
        libraries.entities.foreach((library) => {
            view.displayLibraries(library.id, library.name);
            getResponses(library.id);
        });
    });
}

function getResponses(libraryId){
    let body = [{
        'libraryId': libraryId,
        'pageNumber': 1,
        'pageSize': 25
    }];

    return responseManagementApi.getResponsemanagementResponses(body)
    .then((responses) => {
        responses.entities.foreach((response) => {
            view.displayResonses(response);
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