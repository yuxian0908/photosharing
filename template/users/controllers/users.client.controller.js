// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'users' controller
angular.module('users').controller('UsersController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// Expose the authentication service
		$scope.authentication = Authentication;
	}
]);