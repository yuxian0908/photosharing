// Load the module dependencies
var mongoose = require('mongoose'),
    User = require('mongoose').model('User'),
    passport = require('passport'),
    Photo = require('mongoose').model('Photo'),
    client = require('redis'),
    Album = require('mongoose').model('Album');

// Store people in chatroom
var chatters = [];
// Store messages in chatroom
var chat_messages = [];


exports.join = function (req, res) {
    var username = req.body.username;
    if (chatters.indexOf(username) === -1) {
        chatters.push(username);
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
};

exports.leave = function (req, res) {
    var username = req.body.username;
    chatters.splice(chatters.indexOf(username), 1);
    client.set('chat_users', JSON.stringify(chatters));
    res.send({
        'status': 'OK'
    });
};

// API - Send + Store Message
exports.send_message = function (req, res) {
    var username = req.body.username;
    var message = req.body.message;
    chat_messages.push({
        'sender': username,
        'message': message
    });
    client.set('chat_app_messages', JSON.stringify(chat_messages));
    res.send({
        'status': 'OK'
    });
};

// API - Get Messages
exports.get_messages = function (req, res) {
    res.send(chat_messages);
};

// API - Get Chatters
exports.get_chatters = function (req, res) {
    res.send(chatters);
};