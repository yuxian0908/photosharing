// Load the module dependencies
var	config = require('./config'),
    redis = require('redis');

module.exports = function() {
    var client = '';
    client = redis.createClient(config.redis);

	return client;
};

