// Create the 'admin' controller
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
]);