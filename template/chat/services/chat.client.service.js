// Create the 'articles' service
angular.module('chat').factory('Chats', ['$resource',
 function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/chat/room/:Id', {
        Id: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);