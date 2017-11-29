// Create the 'users' controller
angular.module('users').controller('UsersController', 
	['$scope', 'Authentication', '$location','$routeParams',
	'$http','fileReader','Upload','$window','Users',
	function($scope, Authentication, $location, $routeParams, $http, 
			fileReader,Upload,$window,Users) {
		// Expose the authentication service
		$scope.authentication = Authentication;
		$scope.signin = function(){
			var users ={
                username: this.username,
                password: this.password
			};

			$http.post('api/_admin/getuser',users).then(function (res){
				$scope.signin.userid = res.data[0].id;
				// window.location.reload('/_admin/');
				// $location.path('/_admin/');
			},function (error){
				console.log("error happened");
				$scope.error = errorResponse.data.message;
			});

            $http.post('api/_admin/signin',users).then(function (res){
				// window.location.reload('/_admin/');
				// $location.path('/_admin/');
				$location.path('/_admin/user/'+$scope.signin.userid);
				window.location.reload('/_admin/user/'+$scope.signin.userid);
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

		$scope.showphotos = {
			temp: [],
			show : function(){
				$scope.uploadphotos.file = "";
				var user = {
					id : $scope.authentication.user._id
				};
				$http.post('api/_admin/showphotos',user).then(function (res){
					$scope.showphotos.temp = res.data[0].imgAry;
				},function (error){
					$scope.error = errorResponse.data.message;
				});
			}
		};
		
		// photos upload
		$scope.uploadphotos = {
			submit : function(){ //function to call on form submit
				if ($scope.upload_form.file.$valid && $scope.uploadphotos.file) { //check if from is valid
					$scope.uploadphotos.upload($scope.uploadphotos.file); //call upload function
				}
			},
			upload : function (file) {
				Upload.upload({
					url: '/api/_admin/upload', //webAPI exposed to upload the file
					data:{file:file,username: $scope.authentication.user}, //pass file as data, should be user ng-model
				}).then(function (resp) { //upload function returns a promise
					$scope.showphotos.show();
					if(resp.data.error_code === 0){ //validate success
						console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
					} else {
						console.log('an error occured');
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

		$scope.otheruser = {
			init: function(){
				$scope.initFunctions.otheruserid = $routeParams.userId;
				var otheruser = {
					_id : $scope.initFunctions.otheruserid
				};
				$http.post('api/_admin/getOtheruser',otheruser).then(function (res){
					$scope.otheruser.username = res.data[0].username;
					// window.location.reload('/_admin/');
					// $location.path('/_admin/');
				},function (error){
					console.log("error happened");
					$scope.error = errorResponse.data.message;
				});
			}
		};


		// init all init functions
		$scope.initFunctions = {
			userpage : function(){
				$scope.showphotos.show();
			},
			otheruser : function(){
				$scope.otheruser.init();
				$scope.showphotos.show();
			}
		};
		// /init all init functions
	}
]);