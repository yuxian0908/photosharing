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
};

exports.adminUser = function(req,res,next){
	console.log(req.user.role);
	var role = req.user.role;
	var isAdmin = false;
	for(var i=0;i<role.length;i++){
		if(role[i]==="admin"){
			isAdmin = true;
		}
	}
	if(isAdmin){
		next();
	}else{
		return res.status(401).send({
			message: 'User has no admin role'
		});
	}
};

exports.giveAdmin = function(req,res){
	User.findById(req.body.id,function(err,user){
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
			user.role = ["user","admin"];
			user.save(function (err) {
			  if (err){
				return res.status(400).send({
					message: getErrorMessage(err)
				  });
			  } 
			});
            res.jsonp(user);
        }
    });
};

exports.eraseAdmin = function(req,res){
	User.findById(req.body.id,function(err,user){
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
			user.role = ["user"];
			user.save(function (err) {
			  if (err){
				return res.status(400).send({
					message: getErrorMessage(err)
				  });
			  } 
			});
            res.jsonp(user);
        }
    });
};

exports.getusers = function(req,res){
	User.find({}, function(err,users){
			if(err){
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			}
			res.jsonp(users);
		});
};