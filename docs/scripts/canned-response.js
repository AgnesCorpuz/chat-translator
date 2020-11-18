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
    
    let libraries = responseManagementApi.getResponsemanagementLibraries(body);

    libraries.entities.foreach((library) => {
        // Display all libraries
        view.displayLibraries(library.id, library.name);

        // Call function to get and manage response
        getResponses(library.id);
    });
}

function getResponses(libraryId){
    let body = [{
        'libraryId': libraryId,
        'pageNumber': 1,
        'pageSize': 25
    }];

    let responses = responseManagementApi.getResponsemanagementResponses(body);

    responses.entities.foreach((response) => {
        // Display all responses
        view.displayResonses(response);
    });
}

/** --------------------------------------------------------------
 *                       ON PAGE LOAD
 * -------------------------------------------------------------- */
getLibraries();