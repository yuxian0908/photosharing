// Create the 'users' controller
angular.module('users').controller('UsersController', 
	['$scope', 'Authentication', '$location','$routeParams',
	'$http','fileReader','Upload','$window','Users','Photos',
	function($scope, Authentication, $location, $routeParams, $http, 
			fileReader, Upload, $window, Users, Photos) {
		// Expose the authentication service
		$scope.authentication = Authentication;
		
		$scope.signin = function(){
			var users ={
                username: this.username,
                password: this.password
			};

			$http.post('api/getuser',users).then(function (res){
				console.log(res);
				$scope.signin.userid = res.data[0].id;
				$http.post('api/signin',users).then(function (res){
					// window.location.reload('/');
					// $location.path('/');
					$location.path('/');
					window.location.reload('/');
					console.log(res);
				},function (error){
					console.log('wrong');
					$scope.error = errorResponse.data.message;
				});
			},function (error){
				console.log("error happened");
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
            $http.post('api/signout',users).then(function (success){
				window.location.reload("/");
				$location.path('/');
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
				role:["user"]
            };
            $http.post('api/signup',users).then(function (success){
				window.location.reload("/");
				$location.path('/');
			},function (error){
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.otheruser = {
			init: function(){
				$scope.otheruser._id = $routeParams.userId;
				var otheruser = {
					_id : $scope.otheruser._id
				};
				$http.post('api/getOtheruser',otheruser).then(function (res){
					$scope.otheruser.username = res.data[0].username;
					// window.location.reload('/');
					// $location.path('/');
				},function (error){
					console.log("error happened");
					$scope.error = errorResponse.data.message;
				});
			},
			showphotos : {
				temp: [],
				show : function(){
					$scope.uploadphotos.file = "";
					var user = {
						id : $scope.otheruser._id
					};
					$http.post('api/showphotos',user).then(function (res){
						console.log(res.data);
						$scope.showphotos.temp = res.data;
					},function (error){
						$scope.error = errorResponse.data.message;
					});
				}
			}
		};

		$scope.searchuser = {
			init : function(){
				$scope.searchuser.searchname="";
				$scope.searchuser.searchresult=[];
			},
			search : function(){
				var query = {
					searchname : $scope.searchuser.searchname
				};
				$scope.searchuser.searchresult=[];
				$http.post('api/searchuser',query).then(function (res){
					$scope.searchuser.searchresult = res.data;
				},function (error){
					console.log("error happened");
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
					url: '/api/upload', //webAPI exposed to upload the file
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
		
		$scope.showphotos = {
			temp: [],
			show : function(){
				$scope.uploadphotos.file = "";
				var user = {
					id : $scope.authentication.user._id
				};
				$http.post('api/showphotos',user).then(function (res){
					console.log(res.data);
					$scope.showphotos.temp = res.data;
				},function (error){
					$scope.error = errorResponse.data.message;
				});
			}
		};

		$scope.photohandler = {
			delete: function(photo){
				var photoquery = {
					photoid : photo
				};
				$http.post('api/photos/'+ photo,photoquery).then(function (res){
					console.log(res.data);
					console.log($scope.showphotos.temp);
					for(var i=0;i<$scope.showphotos.temp.length;i++){
						if ($scope.showphotos.temp[i]._id===res.data._id) {
							$scope.showphotos.temp.splice(i,1);
						}
						console.log(i);

					}
					// window.location.reload('/');
					// $location.path('/');
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
				$scope.otheruser.showphotos.show();
			},
			searchuser: function(){
				$scope.searchuser.init();
			}
		};
		// /init all init functions
	}
]);