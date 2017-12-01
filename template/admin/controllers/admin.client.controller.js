// Create the 'admin' controller
angular.module('admin').controller('adminController', 
	['$scope', 'Authentication', '$location','$routeParams',
	'$http',
	function($scope, Authentication, $location, $routeParams, $http) {
		// Expose the authentication service
		$scope.authentication = Authentication;
	
	}
]);