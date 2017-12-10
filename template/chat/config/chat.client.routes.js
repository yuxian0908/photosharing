// Configure the 'admin' module routes
angular.module('chat').config(['$routeProvider','$locationProvider',
	function($routeProvider,$locationProvider) {
		$routeProvider.
		when('/chat', {
			templateUrl: 'chat/views/chat.client.view.html'
		}).
		when('/chat/chatList', {
			templateUrl: 'chat/views/chatList.client.view.html'
		});
		$locationProvider.html5Mode(true);
	}
]); 