// Create the 'admin' controller
angular.module('chat').controller('chatController', 
	['$scope', 'Authentication', '$location','$routeParams',
	'$http',
	function($scope, Authentication, $location, $routeParams, $http) {
		// Expose the authentication service
		$scope.authentication = Authentication;

		$scope.chatList = {
			getList : function(){
				var data = {
					username : $scope.authentication.user.username
				};
				$http.post('api/chat/chatList',data).then(function (res){
					$scope.chatList.list = res.data;
				},function (error){
					$scope.error = errorResponse.data.message;
				});
			},
			redirect : function(roomId){
				$http.get('/api/chat/' + roomId).then(function (res){
					$location.path('/chat/' + roomId);
					window.location.reload('/chat/' + roomId);
				},function (error){
					$scope.error = errorResponse.data.message;
				});
			}
		};

		$scope.initFunctions = {
			chatList : function(){
				$scope.chatList.getList();
			}
		};
	}
]);