// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'users' module
angular.module('users', []);;// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'Authentication' service
angular.module('users').factory('Authentication', [
	function() {
		// Use the rendered user object
		this.user = window.user;

		// Return the authenticated user data
		return {
			user: this.user
		};
	}
]);;// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'articles' service
angular.module('users').factory('Users', ['$resource',
 function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('/api/_admin/signin/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);;// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'articles' service
angular.module('users').factory('Usersout', ['$resource',
 function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/_admin/signout/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);;// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'articles' service
angular.module('users').factory('Usersup', ['$resource',
 function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('api/_admin/signup/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);;// Invoke 'strict' JavaScript mode
'use strict';

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
		when('/_admin/signup',{
			templateUrl: 'users/views/usersSignup.client.view.html'
		}).
		when('/_admin/signout',{
			templateUrl: 'users/views/usersSignout.client.view.html'
		}).
		otherwise({
			redirectTo: '/'
		});

		$locationProvider.html5Mode(true);
	}
	
]); ;// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'users' controller
angular.module('users').controller('UsersController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// Expose the authentication service
		$scope.authentication = Authentication;
	}
]);;// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'users' controller
angular.module('users').controller('UserssigninController', ['$scope', '$location','$routeParams','Users',
	function($scope, $location, $routeParams, Users) {
		$scope.signin = function(){
			var users = new Users({
                username: this.username,
                password: this.password
            });
			users.$save(function(response) {
                window.location.reload("/_admin");
                $location.path('/_admin');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
		};
		
	}
]);;// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'users' controller
angular.module('users').controller('UserssignoutController', ['$scope', '$location','$routeParams','Usersout',
	function($scope, $location, $routeParams, Usersout) {
		$scope.signout = function(){
            console.log('111');
			var users = new Usersout({
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                username: this.username,
                password: this.password
            });
			users.$save(function(response) {
                window.location.reload("/_admin");
                $location.path('/_admin');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
	}
]);;// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'users' controller
angular.module('users').controller('UserssignupController', ['$scope', '$location','$routeParams','Usersup',
	function($scope, $location, $routeParams, Usersup) {
        $scope.signup = function(){
            console.log('adsf');
			var user = new Usersup({
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                username: this.username,
                password: this.password
            });
			user.$save(function(response) {
                console.log('123');
                window.location.reload("/_admin");
                $location.path('/_admin');
            }, function(errorResponse) {
                console.log('321');
                $scope.error = errorResponse.data.message;
            });
		};
	}
]);