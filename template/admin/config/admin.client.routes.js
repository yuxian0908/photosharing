// Configure the 'admin' module routes
angular.module('admin').config(['$routeProvider','$locationProvider',
	function($routeProvider,$locationProvider) {
		$routeProvider.
		when('/_admin', {
			templateUrl: 'admin/views/admin.client.view.html'
		});
		$locationProvider.html5Mode(true);
	}
]); 