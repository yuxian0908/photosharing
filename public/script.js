// Create the 'admin' module
angular.module('admin',[]);;// Create the 'admin' module
angular.module('chat',[]);;// Create the 'users' module
angular.module('users', ['ngFileUpload']);;// Create the 'Authentication' service
angular.module('admin').factory('Authentication', [
	function() {
		// Use the rendered user object
		this.user = window.user;

		// Return the authenticated user data
		return {
			user: this.user
		};
	}
]);;// Create the 'Authentication' service
angular.module('chat').factory('Authentication', [
	function() {
		// Use the rendered user object
		this.user = window.user;

		// Return the authenticated user data
		return {
			user: this.user
		};
	}
]);;// Create the 'articles' service
angular.module('chat').factory('Chats', ['$resource',
 function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/chat/room/:Id', {
        Id: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);;angular.module('chat').factory('mySocket',function (socketFactory) {  
    return socketFactory();
});;// Create the 'Authentication' service
angular.module('users').factory('Authentication', [
	function() {
		// Use the rendered user object
		this.user = window.user;

		// Return the authenticated user data
		return {
			user: this.user
		};
	}
]);;// Create the 'articles' service
angular.module('users').factory('Photos', ['$resource',
 function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/photos/:photoId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);;angular.module('users').directive("ngFileSelect", ['fileReader','$timeout',
    function(fileReader, $timeout) {
        return {
            scope: {
                ngModel: '='
            },
            link: function($scope, el) {
                function getFile(file) {
                fileReader.readAsDataUrl(file, $scope)
                    .then(function(result) {
                    $timeout(function() {
                        $scope.ngModel = result;
                    });
                    });
                }

                el.bind("change", function(e) {
                var file = (e.srcElement || e.target).files[0];
                getFile(file);
                });
            }
        };
    }
]);

angular.module('users').factory("fileReader", ['$q','$log',
    function($q, $log) {
        var onLoad = function(reader, deferred, scope) {
            return function() {
            scope.$apply(function() {
                deferred.resolve(reader.result);
            });
            };
        };

        var onError = function(reader, deferred, scope) {
            return function() {
            scope.$apply(function() {
                deferred.reject(reader.result);
            });
            };
        };

        var onProgress = function(reader, scope) {
            return function(event) {
            scope.$broadcast("fileProgress", {
                total: event.total,
                loaded: event.loaded
            });
            };
        };

        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };

        var readAsDataURL = function(file, scope) {
            var deferred = $q.defer();

            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file);

            return deferred.promise;
        };

        return {
            readAsDataUrl: readAsDataURL
        };
    }
]);;// Create the 'articles' service
angular.module('users').factory('Users', ['$resource',
 function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/user/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);;// Configure the 'admin' module routes
angular.module('admin').config(['$routeProvider','$locationProvider',
	function($routeProvider,$locationProvider) {
		$routeProvider.
		when('/_admin', {
			templateUrl: 'admin/views/admin.client.view.html'
		});
		$locationProvider.html5Mode(true);
	}
]); ;// Configure the 'admin' module routes
angular.module('chat').config(['$routeProvider','$locationProvider',
	function($routeProvider,$locationProvider) {
		$routeProvider.
		when('/chat', {
			templateUrl: 'chat/views/chat.client.view.html'
		});
		$locationProvider.html5Mode(true);
	}
]); ;// Configure the 'users' module routes
angular.module('users').config(['$routeProvider','$locationProvider',
	function($routeProvider,$locationProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'users/views/users.client.view.html'
		}).
		when('/signin',{
			templateUrl: 'users/views/usersSignin.client.view.html'
		}).
		when('/user/:userId',{
			templateUrl: 'users/views/otherusers.client.view.html'
		}).
		when('/searchuser',{
			templateUrl: 'users/views/searchuser.client.view.html'
		}).
		when('/signup',{
			templateUrl: 'users/views/usersSignup.client.view.html'
		}).
		when('/signout',{
			templateUrl: 'users/views/usersSignout.client.view.html'
		}).
		when('/cart',{
			templateUrl: 'users/views/cart.client.view.html'
		}).
		when('/album',{
			templateUrl: 'users/views/album.client.view.html'
		});
		// otherwise({
		// 	redirectTo: '/'
		// });

		$locationProvider.html5Mode(true);
	}
	
]); ;// Create the 'admin' controller
angular.module('admin').controller('adminController', 
	['$scope', 'Authentication', '$location','$routeParams',
	'$http',
	function($scope, Authentication, $location, $routeParams, $http) {
		// Expose the authentication service
		$scope.authentication = Authentication;

		$scope.giveAdmin = {
			add : function(){
				var adduser = {
					id : $scope.giveAdmin.id
				};
				$http.post('api/_admin/giveAdmin',adduser).then(function (success){
					console.log('suc');
				},function (error){
					console.log('fail');
					$scope.error = errorResponse.data.message;
				});
			},
			erase: function(){
				var eraseAdmin = {
					id : $scope.giveAdmin.id
				};
				$http.post('api/_admin/eraseAdmin',eraseAdmin).then(function (success){
					console.log('suc');
					alert($scope.giveAdmin.id+" admin added");
					$scope.giveAdmin.id = "";
				},function (error){
					console.log('fail');
					$scope.error = errorResponse.data.message;
				});
			},
			id : ""
		};

		$scope.showusers = {
			init: function(){
				$scope.showusers.users = [];
				$http.post('api/_admin/getusers').then(function (res){
					console.log('users get');
					console.log(res.data);
					$scope.showusers.users = res.data;
				},function (error){
					$scope.error = errorResponse.data.message;
				});
			}
		};

		$scope.initFunctions = {
			showusers : function(){
				$scope.showusers.init();
			}
		};
	}
]);;// Create the 'admin' controller
angular.module('chat').controller('chatController', 
	['$scope', 'Authentication', '$location','$routeParams',
	'$http',
	function($scope, Authentication, $location, $routeParams, $http) {
		// Expose the authentication service
		$scope.authentication = Authentication;

	}
]);;// Create the 'users' controller
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

		$scope.cart = {
			init: function(){
				$http.get('api/addToCart').then(function (res){
					$scope.cart.items = res.data.items;
				},function (error){
					$scope.error = errorResponse.data.message;
				});
			},
			addToCart : function(id){
				var photoid = {
					photoid : id
				};
				$http.post('api/addToCart',photoid).then(function (res){
					$scope.cart.items = res.data.items;
				},function (error){
					$scope.error = errorResponse.data.message;
				});
			},
			deleteFromCart : function(id){
				var photoid = {
					photoid : id
				};
				$http.post('api/deleteFromCart',photoid).then(function (res){
					$scope.cart.items = res.data.items;
				},function (error){
					$scope.error = errorResponse.data.message;
				});
			},
			submitCart : function(){
				var album = {
					albumname : $scope.cart.albumname
				};
				$http.post('api/submitCart',album).then(function (res){
					console.log("submit success");
					$scope.cart.init();
					alert("submit success");
					$location.path('/');
                    window.location.reload("/");
				},function (error){
					$scope.error = errorResponse.data.message;
				});
			}
		};
		
		$scope.albumpage = {
			init : function(){
				$http.get('api/getAlbum').then(function (res){
					$scope.albumpage.albums = res.data;
					console.log(res.data);
				},function (error){
					$scope.error = errorResponse.data.message;
				});
			},
			showphotos : function(nth){
				$scope.albumpage.imgs = $scope.albumpage.albums[nth].img;
			},
			deleteAlbum : function(nth){
				var deleteAlbum = {
					id : $scope.albumpage.albums[nth]._id
				};
				console.log($scope.albumpage.albums[nth]);
				$http.post('api/deleteAlbum',deleteAlbum).then(function (res){
					console.log(res.data);
					alert("delete"+$scope.albumpage.albums[[nth]].name);
					$scope.albumpage.albums.splice(nth,1);
				},function (error){
					$scope.error = errorResponse.data.message;
				});
			}
		};

		$scope.chat = {
			otherUrlDirect : function(){
				var usingUser = $scope.authentication.user;
				var pageUser;
				// get chat partner
				var chatPartner = {
					id : $scope.otheruser
				};
				$http.post('/api/chat/getChatPatner', chatPartner)
					.then(function (res){
						pageUser = res.data[0];
						// decide chatroom name
						if(usingUser.created > pageUser.created){
							$scope.chat.roomId = usingUser._id + "-" + pageUser._id;
						}else{
							$scope.chat.roomId = pageUser._id + "-" + usingUser._id;
						}
						// enter chatroom
						$http.get('/api/chat/' + $scope.chat.roomId).then(function (res){
							$location.path('/chat/' + $scope.chat.roomId);
							window.location.reload('/chat/' + $scope.chat.roomId);
						},function (error){
							$scope.error = errorResponse.data.message;
						});
					},function (error){
						$scope.error = errorResponse.data.message;
					});

			},
			urlDirect : function(){
				$http.get('/api/chat/').then(function (res){
					$location.path('/chat/');
					window.location.reload('/chat/');
				},function (error){
					$scope.error = errorResponse.data.message;
				});
			}
		};

		// init all init functions
		$scope.initFunctions = {
			userpage : function(){
				$scope.showphotos.show();
				$scope.cart.addToCart();
			},
			otheruser : function(){
				$scope.cart.init();
				$scope.otheruser.init();
				$scope.otheruser.showphotos.show();
			},
			searchuser: function(){
				$scope.searchuser.init();
			},
			cart: function(){
				$scope.cart.init();
			},
			albumpage:function(){
				$scope.albumpage.init();
			}
		};
		// /init all init functions
	}
]);