import view from './view.js';

const platformClient = require('platformClient');
const responseManagementApi = new platformClient.ResponseManagementApi();

function getResponses(libraryId, libraryName){
    return responseManagementApi.getResponsemanagementResponses(libraryId)
    .then((responses) => {
        view.displayLibraries(libraryId, libraryName);

        responses.entities.forEach((response) => {
            view.displayResponses(response);
        });
    });
}

export default {
    getLibraries(){    
        return responseManagementApi.getResponsemanagementLibraries()
        .then((libraries) => {
            libraries.entities.forEach((library) => {
                getResponses(library.id, library.name);
            });
        });
    }
}