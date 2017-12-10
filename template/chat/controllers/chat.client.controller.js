// Create the 'admin' controller
angular.module('chat').controller('chatController', 
	['$scope', 'Authentication', '$location','$routeParams',
	'$http',
	function($scope, Authentication, $location, $routeParams, $http) {
		// Expose the authentication service
		$scope.authentication = Authentication;

		$scope.chatList = {
			getList : function(){
				
			}
		};

		$scope.initFunctions = {
			chatList : function(){
				$scope.chatList.getList();
			}
		};
	}
]);