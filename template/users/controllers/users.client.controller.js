// Create the 'users' controller
angular.module('users').controller('UsersController', 
	['$scope', 'Authentication', '$location','$routeParams',
	'$http','fileReader','Upload','$window',
	function($scope, Authentication, $location, $routeParams, $http, 
			fileReader,Upload,$window) {
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
				console.log('asdf');
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
				password: this.password,
				imgAry:[]
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

		
		// photos upload
		$scope.uploadphotos = {
			submit : function(){ //function to call on form submit
				if ($scope.upload_form.file.$valid && $scope.uploadphotos.file) { //check if from is valid
					$scope.uploadphotos.upload($scope.uploadphotos.file); //call upload function
				}
			},
			upload : function (file) {
				// $http.post('api/_admin/upload',$scope.authentication.user).then(function (success){
				// 	console.log('suc');
				// },function (error){
				// 	$scope.error = errorResponse.data.message;
				// });

				Upload.upload({
					url: '/api/_admin/upload', //webAPI exposed to upload the file
					data:{file:file,username: $scope.authentication.user}, //pass file as data, should be user ng-model
				}).then(function (resp) { //upload function returns a promise
					if(resp.data.error_code === 0){ //validate success
						$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
					} else {
						$window.alert('an error occured');
					}
				}, function (resp) { //catch error
					console.log('Error status: ' + resp.status);
					$window.alert('Error status: ' + resp.status);
				}, function (evt) { 
					console.log(evt);
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
					$scope.uploadphotos.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
				});
			}
		};
		// /photos upload
	}
]);