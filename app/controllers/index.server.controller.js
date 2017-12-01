// Load the module dependencies
var mongoose = require('mongoose'),
User = require('mongoose').model('User'),
Photo = require('mongoose').model('Photo'),
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

        // Create a new article object
        var photo = new Photo(img);
        
        // Set the article's 'creator' property
        photo.creator = req.user;
    
        // Try saving the article
        photo.save(function(err) {
            if (err) {
                // If an error occurs send the error message
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } 
        });

            res.json({error_code:0,err_desc:null});
    });
};

exports.showphotos = function(req,res){
    Photo.find()
        .sort('-created')
        .populate('creator')
        .exec(function(err,img){
        if (err) {
            console.log('err happened');
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            var imgs = [];
            for(var i=0;i<img.length;i++){
                if(req.body.id===img[i].creator.id){
                    imgs.push(img[i]);
                }
            }
            
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
    Photo.findById(req.body.photoid)
         .exec(function (err, photo) {
                if (err) {
                    // If an error occurs send the error message
                    console.log('err happened');
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else {
                   var delImgPath = photo.path;
                   Photo.remove({ _id: photo._id }, function (err) {
                        if (err) return handleError(err);
                        console.log('removed');
                        // removed!
                   });

                   fs.unlink('./public/'+ delImgPath, function(error) {
                        if (error) {
                            throw error;
                        }
                    });
                   res.jsonp(photo);
                }
            });
};

exports.searchuser = function(req,res){
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
            res.jsonp(user);
        }
    });
};