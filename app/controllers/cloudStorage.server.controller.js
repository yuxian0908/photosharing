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
                            // .pipe(fs.createWriteStream('app/views/test.html'));
                        });
        },
        function(callback){
            console.log('qwe');
            var path = process.cwd();
            res.sendFile(path+'/app/views/test.html');

            callback(null,"done");
        },
    ]);
    // res.render('test');
};

exports.getToken = function(req, res){
    async.waterfall([
        function(callback){
            console.log(req.query.code);
            var token = {
                grant_type: "authorization_code",
                code: req.query.code,
                client_id: config.cloudStorage.clientID,
                client_secret: config.cloudStorage.clientSecret,
                redirect_uri:config.cloudStorage.redirect_uri2
            };
        
            request.post('https://api.box.com/oauth2/token',{form:token},
            function(err,httpResponse,body){
                var token = JSON.parse(body);
                console.log(body);
                var query ={
                    grant_type:"refresh_token&refresh_token",
                    refresh_token:token.refresh_token,
                    client_id:config.cloudStorage.clientID,
                    client_secret:config.cloudStorage.clientSecret
                };
                callback(null,query);
            });
        },
        function(arg1,callback){
            var token = {
                grant_type: "refresh_token",
                refresh_token: arg1.refresh_token,
                client_id: config.cloudStorage.clientID,
                client_secret: config.cloudStorage.clientSecret
            };
            request.post('https://api.box.com/oauth2/token',{form:token},
            function(err,httpResponse,body){
                console.log(body);
                var token = JSON.parse(body);
                Token = {
                    refresh_token:token.refresh_token,
                    access_token:token.access_token
                };
                callback(null);
                
            });
        },function(){
            
            res.redirect('/');
        }
    ]); 
};

exports.test = function(req, res){
    console.log('asdf');
    console.log(Token);
    var client = box(Token.access_token);

    client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
        if(err) throw err;
        console.log('Hello, ');
    });

    var stream = fs.createReadStream('C:/Users/User/Desktop/folder/coding/practice/yuxian/node6-test/public/uploads/5a2a7303d0b2ab01f4e2fc4d/5a2a7303d0b2ab01f4e2fc4d-1513135097971.jpg');
    console.log(stream);
    client.files.uploadFile('43260665844', 'test2345.jpg', stream, function(err,res){
        if(err){
            console.log('err');
        }else{
            console.log(res.entries[0].id);
        }
    });

    // box.files.getDownloadURL('255361058796', null, function(error, downloadURL) {
    // if (error) {
    //     //handle error
    // }
    // console.log(downloadURL);
    // //process the downloadURL
    // });
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
    
            callback(null,filePath,filename);
            // // Create a new photo object
            // var photo = new Photo(img);
            
            // // Set the photo's 'creator' property
            // photo.creator = req.user;
        
            // // Try saving the photo
            // photo.save(function(err) {
            //     if (err) {
            //         // If an error occurs send the error message
            //         return res.status(400).send({
            //             message: getErrorMessage(err)
            //         });
            //     } 
            // });
    
            // User.findById(req.user._id,function(err,user){
            //     if (err) {
            //         // If an error occurs send the error message
            //         return res.status(400).send({
            //             message: getErrorMessage(err)
            //         });
            //     } else {
            //         Photo.find({"creator":req.user._id}).exec(function(err,imgs){
            //             user.imgs = imgs;
            //             user.save(function (err) {
            //                 if (err){
            //                 return res.status(400).send({
            //                     message: getErrorMessage(err)
            //                     });
            //                 } 
            //             });
            //         });
            //     }

            // });
    
            //     res.json({error_code:0,err_desc:null});
        });
    },function(filePath,filename,callback){

        var dirpath = process.cwd().replace(/\\/g, "/");
        var cloudPath = dirpath+'/public/'+filePath;

        var client = box(Token.access_token);
        
        client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
            if(err) throw err;
            console.log('Hello, ');
        });
    
        var stream = fs.createReadStream(cloudPath);
        console.log(stream);
        client.files.uploadFile('43260665844', filename, stream, function(err,res){
            if(err){
                console.log('err');
            }else{
                console.log(res.entries[0].id);
                callback(null,filePath);
            }
        });
    },
    function(filePath,callback){
        fs.unlink('./public/'+ filePath, function(error) {
            if (error) {
                throw error;
            }
        });
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
                Photo.findById(photo._id)
                    .exec(function(err,photo){
                        if(err)console.log('find photo err');
                        photo.remove(function(err){
                            if (err) return handleError(err);
                            console.log('removed');
                        });
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
// /用戶主頁照片