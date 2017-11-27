// Create the 'users' controller
angular.module('users').controller('UsersController', 
	['$scope', 'Authentication', '$location','$routeParams','$http','fileReader',
	function($scope, Authentication, $location, $routeParams, $http, fileReader) {
		// Expose the authentication service
		$scope.authentication = Authentication;
		$scope.signin = function(){
			var users ={
                username: this.username,
                password: this.password
            };
            $http.post('api/_admin/signin',users).then(function (success){
				window.location.reload("/_admin");
				$location.path('/_admin');
			},function (error){
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
		// $scope.photos = [];
		// $scope.photos.push({
		// 	name:'apple',
		// 	path:'/users/views/img/apple.png'
		// },
		// {
		// 	name:'abstract',
		// 	path:'/users/views/img/abstract.jpg'
		// },
		// {
		// 	name:'adidas',
		// 	path:'/users/views/img/Adidas_Logo.png'
		// });
		// $scope.creatphotos = function(){
		// 	console.log($scope.photos);

		// };


		// uploadphotos
		$scope.uploadptos = {
			init: function(){
				$scope.uploadptos.imageSrc = "";
				$scope.uploadptos.showupload = true;
				console.log($scope.uploadptos.showupload);
			},
		};
		$scope.$on("fileProgress", function(e, progress) {
			console.log($scope.imageSrc);
		 	 $scope.progress = progress.loaded / progress.total;
		});
		// /uploadphotos

	}
]);