// Load the module dependencies
var mongoose = require('mongoose'),
    fs = require('fs'),
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
            
            res.redirect('/test');
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

    // box.files.getDownloadURL('255361058796', null, function(error, downloadURL) {
    // if (error) {
    //     //handle error
    // }
    // console.log(downloadURL);
    // //process the downloadURL
    // });
};