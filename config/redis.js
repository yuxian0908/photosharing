// Load the module dependencies
var	config = require('./config'),
    redis = require('redis');

module.exports = function() {
    var client = '';
    client = redis.createClient(config.redis);
    
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

	return client;
};

