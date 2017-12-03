// Load the module dependencies
var mongoose = require('mongoose'),
User = require('mongoose').model('User'),
passport = require('passport'),
Photo = require('mongoose').model('Photo'),
Album = require('mongoose').model('Album');

function findAndaddPhoto(pho,req,res,next){
    var cart = req.session.cart || (req.session.cart = { items: [] });
    Photo.find({'_id':pho})
        .exec(function(err,photo){
            if (err) {
                // If an error occurs send the error message
                console.log("some error happened");
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                console.log(photo[0]);
                cart.items.push(photo[0]);
                next();
            }
        });
}

exports.addToCart = function(req,res,next){
    findAndaddPhoto(req.body.photoid, req, res, next);
};

function findAnddeletePhoto(pho,req,res,next){
    var cart = req.session.cart ;
    for(var i=0;i<cart.items.length;i++){
        if(pho===cart.items[i]._id){
            cart.items.splice(i,1);
            req.session.cart = cart;
            next();
        }
    }
    
}

exports.deleteFromCart = function(req,res,next){
    findAnddeletePhoto(req.body.photoid, req, res, next);
};

exports.returnCart = function(req,res){
    var cart = req.session.cart;
    res.jsonp(cart);
};

exports.submitCart = function(req,res){
    var cart = req.session.cart.items;
    var album = new Album();
    album.img = cart;
    album.owner = req.user;
    album.name = req.body.albumname;
    album.save(function(err) {
        if (err) {
            console.log('error');
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } 
    });
    User.findById(req.user._id,function(err,user){
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            Album.find({"owner":req.user._id}).exec(function(err,albums){
                user.albums = albums;
                user.save(function (err) {
                    if (err){
                    return res.status(400).send({
                        message: getErrorMessage(err)
                        });
                    } 
                });
            });
        }
    });
    console.log('suc');
    delete req.session.cart.items;
    cart = req.session.cart;
    cart.items = [];
    res.jsonp(cart);
};
