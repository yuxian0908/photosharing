// Configure the 'users' module routes
angular.module('users').config(['$routeProvider','$locationProvider',
	function($routeProvider,$locationProvider) {
		$routeProvider.
		when('/_admin', {
			templateUrl: 'users/views/users.client.view.html'
		}).
		when('/_admin/signin',{
			templateUrl: 'users/views/usersSignin.client.view.html'
		}).
		when('/_admin/user/:userId',{
			templateUrl: 'users/views//otherusers.client.view.html'
		}).
		when('/_admin/signup',{
			templateUrl: 'users/views/usersSignup.client.view.html'
		}).
		when('/_admin/signout',{
			templateUrl: 'users/views/usersSignout.client.view.html'
		}).
		otherwise({
			redirectTo: '/_admin'
		});

		$locationProvider.html5Mode(true);
	}
	
]); 