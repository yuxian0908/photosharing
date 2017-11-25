// Create the 'users' controller
angular.module('users').controller('UsersController', 
	['$scope', 'Authentication', '$location','$routeParams','Users','$http',
	function($scope, Authentication, $location, $routeParams, Users, $http) {
		// Expose the authentication service
		$scope.authentication = Authentication;
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
		$scope.signout = function(){
            var users = {
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                username: this.username,
                password: this.password
            };
            $http.post('api/_admin/signout',users).then(function (success){
				window.location.reload("/_admin");
				$location.path('/_admin');
			},function (error){
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.signup = function(){
            var users = {
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                username: this.username,
                password: this.password
            };
            $http.post('api/_admin/signup',users).then(function (success){
				window.location.reload("/_admin");
				$location.path('/_admin');
			},function (error){
				$scope.error = errorResponse.data.message;
			});
		};
		
	}
]);