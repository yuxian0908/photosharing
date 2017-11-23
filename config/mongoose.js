// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var	config = require('./config'),
	mongoose = require('mongoose');

// Define the Mongoose configuration method
module.exports = function() {
	// Use Mongoose to connect to MongoDB
	mongoose.Promise = global.Promise;
	var db = mongoose.connect(config.db, { useMongoClient: true });

	// Load the application models 
	// require('../app/models/user.server.model');
	// require('../app/models/article.server.model');
	// require('../app/models/reser.server.model')

	// Return the Mongoose connection instance
	return db;
};