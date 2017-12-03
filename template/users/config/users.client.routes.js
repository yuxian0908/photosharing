// Configure the 'users' module routes
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
		}).
		otherwise({
			redirectTo: '/'
		});

		$locationProvider.html5Mode(true);
	}
	
]); 