// Create the 'users' controller
angular.module('users').controller('UserssignupController', ['$scope', '$location','$routeParams','Usersup',
	function($scope, $location, $routeParams, Usersup) {
        $scope.signup = function(){
            console.log('adsf');
			var user = new Usersup({
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                username: this.username,
                password: this.password
            });
			user.$save(function(response) {
                console.log('123');
                window.location.reload("/_admin");
                $location.path('/_admin');
            }, function(errorResponse) {
                console.log('321');
                $scope.error = errorResponse.data.message;
            });
		};
	}
]);