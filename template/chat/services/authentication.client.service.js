// Create the 'Authentication' service
angular.module('chat').factory('Authentication', [
	function() {
		// Use the rendered user object
		this.user = window.user;

		// Return the authenticated user data
		return {
			user: this.user
		};
	}
]);