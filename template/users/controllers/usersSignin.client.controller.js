// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'users' controller
angular.module('users').controller('UserssigninController', ['$scope', '$location','$routeParams','Users',
	function($scope, $location, $routeParams, Users) {
		$scope.signin = function(){
			var users = new Users({
                username: this.username,
                password: this.password
            });
			users.$save(function(response) {
                window.location.reload("/_admin");
                $location.path('/_admin');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
		};
		
	}
]);