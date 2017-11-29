// Create the 'articles' service
angular.module('users').factory('Photos', ['$resource',
 function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/_admin/photos/:photoId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);