// Create the 'articles' service
angular.module('users').factory('Usersup', ['$resource',
 function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/_admin/signup/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);