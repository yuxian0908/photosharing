// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'users' controller
angular.module('users').controller('UserssignoutController', ['$scope', '$location','$routeParams','Usersout',
	function($scope, $location, $routeParams, Usersout) {
		$scope.signout = function(){
            console.log('111');
			var users = new Usersout({
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
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