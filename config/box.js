// Initialize SDK
var	config = require('./config'),
    BoxSDK = require('box-node-sdk');

module.exports = function() {
    var sdk = new BoxSDK({
        clientID: config.cloudStorage.clientID,
        clientSecret: config.cloudStorage.clientSecret
    });
      
    // Create a basic API client
    var client = sdk.getAnonymousClient();
    // var client = sdk.getBasicClient('2pSUhQJLHaHN5ElcdNmZjNehGlcaTk9v');
    
    // // Get some of that sweet, sweet data!
    // client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
    // if(err) throw err;
    // console.log('Hello, ' + currentUser.name + '!');
    // });
    
    // // The SDK also supports Promises
    // client.users.get(client.CURRENT_USER_ID)
    //     .then(user => console.log('Hello', user.name, '!'))
    //     .catch(err => console.log('Got an error!', err));

    return client;
};
