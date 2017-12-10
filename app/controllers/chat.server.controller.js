// Load the module dependencies
var mongoose = require('mongoose'),
    url = require('url'),
    User = require('mongoose').model('User'),
    passport = require('passport'),
    Photo = require('mongoose').model('Photo'),
    client = require('../../config/redis')(),
    Album = require('mongoose').model('Album');


// Redis Client Ready
client.once('ready', function () {
    // Flush Redis DB
    // client.flushdb();

    // Initialize Chatters
    client.get('chat_users', function (err, reply) {
        if (reply) {
            chatters = JSON.parse(reply);
        }
    });

    // Initialize Messages
    client.get('chat_app_messages', function (err, reply) {
        if (reply) {
            chat_messages = JSON.parse(reply);
        }
    });
});


// Store people in chatroom
var chatters = [];
// Store messages in chatroom
var chat_messages = [];

exports.join = function (req, res) {
    var isAdded = false;
    var count = 0;
    var username = req.body.username;
    var room = req.body.room;
    var tempuser = {
        "username" : username,
        "room" : room
    };

    for(var i=0; i<chatters.length; i++){
        count++;
        if(chatters[i].username === username && chatters[i].room === room){
            isAdded = true;
            console.log('same user');
        }
        if(count===chatters.length){
            if (!isAdded) {
                chatters.push(tempuser);
                client.set('chat_users', JSON.stringify(chatters));
                res.send({
                    'chatters': chatters,
                    'status': 'OK'
                });
            } else {
                res.send({
                    'status': 'FAILED'
                });
            }
            count = 0;
        }
    }
};

exports.leave = function (req, res) {
    var username = req.user.username;
    chatters.splice(chatters.indexOf(username), 1);
    client.set('chat_users', JSON.stringify(chatters));
    res.send({
        'status': 'OK'
    });
};

// API - Send + Store Message
exports.send_message = function (req, res) {
    var username = req.user.username;
    var message = req.body.message;
    var room = req.body.room;
    chat_messages.push({
        'sender': username,
        'message': message,
        'room' : room
    });
    client.set('chat_app_messages', JSON.stringify(chat_messages));
    res.send({
        'status': 'OK'
    });
};

// API - Get Messages
exports.get_messages = function (req, res) {
    var messages = [];
    client.get('chat_app_messages', function (err, msg) {
        if (msg) {
            chat_messages = JSON.parse(msg);
            for(var i=0; i<chat_messages.length; i++){
                if(chat_messages[i].room===req.body.room){
                    messages.push(chat_messages[i]);
                }
            }
        }
        console.log(messages);
        res.jsonp(messages);
    });
};

// API - Get Chatters
exports.get_chatters = function (req, res){
    var chatusers = [];
    // var isAdded = false;
    client.get('chat_users', function (err, users) {
        if (users) {
            chatusers = JSON.parse(users);
            console.log(chatusers);
            res.jsonp(chatusers);
        }    

    });
};

// get chatList
exports.chatList = function (req, res){

};