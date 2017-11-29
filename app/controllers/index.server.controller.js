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

exports.renderindex = function(req,res){
    res.render('index', { 	user: JSON.stringify(req.user)||"null" });
};

// Create a new controller method that creates new 'regular' users
exports.signup = function(req, res, next) {
    // If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
    if (!req.user) {
        // Create a new 'User' model instance
        var user = new User(req.body);
        var message = null;

        // Set the user provider property
        user.provider = 'local';

        // Try saving the new user document
        user.save(function(err) {
            // If an error occurs, use flash messages to report the error
            if (err) {
                // Use the error handling method to get the error message
                var message = getErrorMessage(err);

                // Set the flash messages
                req.flash('error', message);

                // Redirect the user back to the signup page
                return res.redirect('/signup');
            }

            // If the user was created successfully use the Passport 'login' method to login
            req.login(user, function(err) {
                // If a login error occurs move to the next middleware
                if (err) return next(err);

                // Redirect the user back to the main application page
                return res.redirect('/');
            });
        });
    } else {
        return res.redirect('/');
    }
};

// Create a new controller method that creates new 'OAuth' users
exports.saveOAuthUserProfile = function(req, profile, done) {
    // Try finding a user document that was registered using the current OAuth provider
    User.findOne({
        provider: profile.provider,
        providerId: profile.providerId
    }, function(err, user) {
        // If an error occurs continue to the next middleware
        if (err) {
            return done(err);
        } else {
            // If a user could not be found, create a new user, otherwise, continue to the next middleware
            if (!user) {
                // Set a possible base username
                var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');

                // Find a unique available username
                User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                    // Set the available user name 
                    profile.username = availableUsername;
                    
                    // Create the user
                    user = new User(profile);

                    // Try saving the new user document
                    user.save(function(err) {
                        // Continue to the next middleware
                        return done(err, user);
                    });
                });
            } else {
                // Continue to the next middleware
                return done(err, user);
            }
        }
    });
};

// Create a new controller method for signing out
exports.signout = function(req, res) {
    req.session.destroy(function() {
        res.clearCookie('connect.sid');
        // Redirect the user back to the main application page
        res.redirect('/');
    });
};

// Create a new controller middleware that is used to authorize authenticated operations 
exports.requiresLogin = function(req, res, next) {
    // If a user is not authenticated send the appropriate error message
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }

    // Call the next middleware
    next();
};

exports.uploadphotos = function(req,res){

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            var dir = './public/uploads/'+ req.user._id ;
            fs.mkdir(dir, function(err){
                cb(null, dir);
            });
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, req.user._id + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });
    
    var upload = multer({ //multer settings
                        storage: storage
                    }).single('file');

    upload(req,res,function(err){
        if(err){
                res.json({error_code:1,err_desc:err});
                return;
        }
        var filePath = req.file.path.replace(/\\/g, "/");
        filePath = filePath.substring(filePath.indexOf("/") + 1);
        var img = {
            originalname: req.file.originalname,
            path:filePath
        };

        User.findById(req.body.username, function (err, user) {
            if (err){
                var message = getErrorMessage(err);
                req.flash('error', message);
            } 
            user.imgAry.unshift(img);
            user.save(function (err) {
                if (err){
                    var message = getErrorMessage(err);
                    req.flash('error', message);
                } 
            });
        });

            res.json({error_code:0,err_desc:null});
    });
};

exports.showphotos = function(req,res){
    User.find({'_id':req.body.id}).select('imgAry').exec(function(err,imgs){
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the article 
            res.jsonp(imgs);
        }
    });
};

exports.getuser = function(req,res){
    User.find({'username':req.body.username}).select('_id').exec(function(err,userid){
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the article 
            res.jsonp(userid);
        }
    });
};

exports.getOtheruser = function(req,res){
    User.find({'_id':req.body._id}).select('username').exec(function(err,user){
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the article 
            res.jsonp(user);
        }
    });
};

exports.deletephoto = function(req,res){
    User.findById(req.body.userid, function (err, user) {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            var delImgPath;
            for(var i = 0; i<user.imgAry.length; i++){
                if(user.imgAry[i]._id == req.body.photoid){
                    delImgPath = user.imgAry[i].path;
                    user.imgAry.splice(i, 1);
                    break;
                }
            }
            user.save(function (err) {
                if (err){
                    var message = getErrorMessage(err);
                    req.flash('error', message);
                } 
            });
            fs.unlink('./public/'+ delImgPath, function(error) {
                if (error) {
                    throw error;
                }
                console.log('Deleted '+req.body.photoid);
            });
            
            res.jsonp(user.imgAry);
        }
    });
};

exports.searchuser = function(req,res){
    console.log(req.body.searchname);
    var query = req.body.searchname;
    User.find({'username':{ $regex: '.*' + query + '.*' }})
        .select('username')
        .exec(function(err,user){
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the article 
            console.log(user);
            res.jsonp(user);
        }
    });
};