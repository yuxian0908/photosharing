// // Load the module dependencies
// var mongoose = require('mongoose'),
//     fs = require('fs'),
//     box = require('../../config/box'),
//     request = require('request'),
//     config = require('../../config/config'),
//     async =  require('async');

// Load the module dependencies
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
                            fs.writeFile('app/views/test.html', body, function (err) {
                                if (err) throw err;
                                console.log('文件建立成功');
                                callback(null);
                              });
                        });
        },
        function(callback){
            console.log('qwe');
            var path = process.cwd();
            res.sendFile(path+'/app/views/test.html');

            callback(null,"done");
        },
    ]);
};

exports.getToken = function(req, res){
    box.getToken(req.query.code,function(err,res){
        Token = res;
        console.log(Token);
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
                console.log(filename);
        
                callback(null,filePath,filename,img);
            });
        },
        function(filePath,filename,img,callback){

            var dirpath = process.cwd().replace(/\\/g, "/");
            var cloudPath = dirpath+'/public/'+filePath;

            var client = box.init(Token.access_token);
            
            client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
                if(err) throw err;
                console.log('Hello, ');
            });
        
            var stream = fs.createReadStream(cloudPath);
            console.log(stream);
            client.files.uploadFile(config.cloudStorage.photofolder, filename, stream, function(err,res){
                if(err){
                    console.log('err');
                }else{
                    var cloudPhoId = res.entries[0].id;
                    console.log(cloudPhoId);
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
            console.log('last');
            console.log(cloudPhoId);
            console.log(img);

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


function getThumbnail(req,res,img,done){
    var client = box.init(Token.access_token);
    client.files.getEmbedLink(img.info.cloudStorageId, function(err,data){
        console.log(img.info);
        img.thumbnail = data;
        if(done){
            console.log(imgAry);
            // res.jsonp(imgAry);
        }
    });
}
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
                    console.log(i);
                    console.log(imgDetail.info);
                    imgAry.push(imgDetail);
                }
            }
            // for(var j=0;j<imgAry.length;j++){
            //     if(j===imgAry.length-1){
            //         getThumbnail(req,res,imgAry[j],true);
            //     }else{
            //         getThumbnail(req,res,imgAry[j],false);
            //     }
            // }
            
           
            (function uploader(i) {
                var client = box.init(Token.access_token);
                if( i < imgAry.length ) {
                    if(i===imgAry.length-1){
                        client.files.getEmbedLink(imgAry[i].info.cloudStorageId, function(err,data){
                            imgAry[i].thumbnail = data;
                            console.log(imgAry);
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
            // while(count<imgAry.length){
            //     console.log(count);
            //     if(count===imgAry.length-1){
            //         getThumbnail(req,res,imgAry[count],true);
            //     }else{
            //         getThumbnail(req,res,imgAry[count],false);
            //     }
            //     count++;
            // }
        }
    });
};

exports.test = function(req,res){
    var client = box.init(Token.access_token);
    client.files.delete('256620995848', function(err,data){
        console.log('deleted');
    });
};

function deleteCloudImg(img){
    console.log(img);
    var client = box.init(Token.access_token);
    client.files.delete(img, function(err,data){
        console.log('deleted');
    });
}
exports.deletephoto = function(req,res){
    console.log(req.body.photoid);
    Photo.findById(req.body.photoid)
        .exec(function (err, photo) {
            if (err) {
                // If an error occurs send the error message
                console.log('err happened');
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                console.log(photo);
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