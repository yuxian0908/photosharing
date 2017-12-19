var mongoose = require('mongoose'),
    User = require('mongoose').model('User'),
    Photo = require('mongoose').model('Photo'),
    passport = require('passport'),
    fs = require('fs'),
    multer = require('multer'),
    Album = require('mongoose').model('Album'),
    box = require('../../config/box'),
    request = require('request'),
    config = require('../../config/config'),
    async =  require('async');

var Token = {};
var imgAry = [];
var imgDetail = {
    info:{},
    thumbnail:''
};

exports.boxinit = function(req,res){
    async.waterfall([
        function(callback){
            var OAuth = {
                response_type:'code',
                client_id:config.cloudStorage.clientID,
                state:config.cloudStorage.state,
                redirect_uri:config.cloudStorage.redirect_uri
            };
        
            request.post('https://account.box.com/api/oauth2/authorize',{form:OAuth},
                        function(err,httpResponse,body){
                            fs.writeFile('app/views/cloudStorageLogin.html', body, function (err) {
                                if (err) throw err;
                                console.log('文件建立成功');
                                callback(null);
                              });
                        });
        },
        function(callback){
            var path = process.cwd();
            res.sendFile(path+'/app/views/cloudStorageLogin.html');

            callback(null,"done");
        },
    ]);
};

exports.getToken = function(req, res){
    box.getToken(req.query.code,function(err,res){
        Token = res;
    });
    res.redirect('/');
};

exports.refreshToken = function(req, res, next){
    box.refreshToken(Token,function(err,res){
        Token = res;
        console.log(Token);
        next();
    });
};

// 用戶主頁照片
exports.uploadphotos = function(req,res){
    async.waterfall([
        function(callback){
            var filename = '';
            var storage = multer.diskStorage({ //multers disk storage settings
                destination: function (req, file, cb) {
                    var dir = './public/uploads/'+ req.user._id ;
                    fs.mkdir(dir, function(err){
                        cb(null, dir);
                    });
                },
                filename: function (req, file, cb) {
                    var datetimestamp = Date.now();
                    filename = req.user._id + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
                    cb(null, filename);
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
        
                callback(null,filePath,filename,img);
            });
        },
        function(filePath,filename,img,callback){

            var dirpath = process.cwd().replace(/\\/g, "/");
            var cloudPath = dirpath+'/public/'+filePath;

            var client = box.init(Token.access_token);
                    
            var stream = fs.createReadStream(cloudPath);
            client.files.uploadFile(config.cloudStorage.photofolder, filename, stream, function(err,res){
                if(err){
                    console.log('err');
                }else{
                    var cloudPhoId = res.entries[0].id;
                    callback(null,filePath,cloudPhoId,img);
                }
            });
        },
        function(filePath,cloudPhoId,img,callback){
            fs.unlink('./public/'+ filePath, function(error) {
                if (error) {
                    throw error;
                }
                callback(null,cloudPhoId,img);
            });
        },
        function(cloudPhoId,img,callback){
        // Create a new photo object
            var photo = new Photo(img);
            
            // Set the photo's 'creator' property
            photo.creator = req.user;
            photo.cloudStorageId = cloudPhoId;
        
            // Try saving the photo
            photo.save(function(err) {
                if (err) {
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
                    Photo.find({"creator":req.user._id}).exec(function(err,imgs){
                        user.imgs = imgs;
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
                res.json({error_code:0,err_desc:null});
        }
    ]);
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
            imgAry = [];
            imgDetail = {
                info:{},
                thumbnail:''
            };
            for(var i=0;i<img.length;i++){
                if(req.body.id===img[i].creator.id){
                    imgDetail = {
                        info:{},
                        thumbnail:''
                    };
                    imgDetail.info = img[i];
                    imgAry.push(imgDetail);
                }
            }
            
           
            (function uploader(i) {
                var client = box.init(Token.access_token);
                if( i < imgAry.length ) {
                    if(i===imgAry.length-1){
                        client.files.getEmbedLink(imgAry[i].info.cloudStorageId, function(err,data){
                            imgAry[i].thumbnail = data;
                            res.jsonp(imgAry);
                        });
                    }else{
                        client.files.getEmbedLink(imgAry[i].info.cloudStorageId, function(err,data){
                            imgAry[i].thumbnail = data;
                            uploader(i+1);
                        });
                    }
                }
            })(0);
        }
    });
};

function deleteCloudImg(img){
    var client = box.init(Token.access_token);
    client.files.delete(img, function(err,data){
        console.log('deleted');
    });
}
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
                deleteCloudImg(photo.cloudStorageId);
                photo.remove(function(err){
                    if (err) return handleError(err);
                    console.log('removed');
                });
                res.jsonp(photo);
            }
        });
};
// /用戶主頁照片

exports.showCartPhotos = function(req,res,next){
    var cart = req.session.cart.items;
    (function uploader(i) {
        var client = box.init(Token.access_token);
        if( i < cart.length ) {
            if(i===cart.length-1){
                client.files.getEmbedLink(cart[i].info.cloudStorageId, function(err,data){
                    cart[i].thumbnail = data;
                    req.session.cart.items = cart;
                    next();
                    // res.jsonp(cart);
                });
            }else{
                client.files.getEmbedLink(cart[i].info.cloudStorageId, function(err,data){
                    cart[i].thumbnail = data;
                    uploader(i+1);
                });
            }
        }
    })(0);
};