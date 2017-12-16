// Initialize SDK
var	config = require('./config'),
    request = require('request'),
    BoxSDK = require('box-node-sdk');

module.exports = {
    init:function(Token) {
        var sdk = new BoxSDK({
            clientID: config.cloudStorage.clientID,
            clientSecret: config.cloudStorage.clientSecret
        });
        var client = sdk.getBasicClient(Token);
        return client;
    },
    getToken: function(code,callback){
        var token = {
            grant_type: "authorization_code",
            code: code,
            client_id: config.cloudStorage.clientID,
            client_secret: config.cloudStorage.clientSecret,
            redirect_uri:config.cloudStorage.redirect_uri2
        };
    
        request.post('https://api.box.com/oauth2/token',{form:token},
        function(err,httpResponse,body){
            if(err){
                console.log("err");
                if(callback){
                    callback(err,null);
                }
            }else{
                var token = JSON.parse(body);
                if(callback){
                    callback(null,token);
                }
                return token;
            }
        });
    },
    refreshToken: function(refreshkey,callback){
        var token = {
            grant_type: "refresh_token",
            refresh_token: refreshkey.refresh_token,
            client_id: config.cloudStorage.clientID,
            client_secret: config.cloudStorage.clientSecret
        };
        request.post('https://api.box.com/oauth2/token',{form:token},
        function(err,httpResponse,body){
            if(err){
                console.log("err");
                if(callback){
                    callback(err,null);
                }
            }else{
                var token = JSON.parse(body);
                if(callback){
                    callback(null,token);
                }
                return token;
            }
        });
    }
};
