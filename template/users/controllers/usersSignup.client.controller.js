// Create the 'users' controller
angular.module('users').controller('UserssignupController', ['$scope', '$location','$routeParams','Usersup',
	function($scope, $location, $routeParams, Usersup) {
        $scope.signup = function(){
			var user = new Usersup({
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                username: this.username,
                password: this.password
            });
			user.$save(function(response) {
                window.location.reload("/_admin");
                $location.path('/_admin');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
		};
	}
]);