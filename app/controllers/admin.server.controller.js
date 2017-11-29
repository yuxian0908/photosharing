// Load the module dependencies
var mongoose = require('mongoose'),
	User = require('mongoose').model('User'),
	passport = require('passport'),
	fs = require('fs'),
	multer = require('multer');

// Create a new error handling controller method
var getErrorMessage = function(err) {
	// Define the error message variable
	var message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Something went wrong';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Return the message error
	return message;
};

exports.renderadmin = function(req,res){
    res.render('admin',{
		user: JSON.stringify(req.user)||"null"
	});
    // res.render('index', { title: 'Express' });
};