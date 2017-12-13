// Initialize SDK
var	config = require('./config'),
    BoxSDK = require('box-node-sdk');

module.exports = function() {
    var sdk = new BoxSDK({
        clientID: 'mze26rnupvitiyo9g9j2xamrx78e8gwo',
        clientSecret: 'NofcjyrNTIDMGL4WUaGO5nRGeen38m3H'
    });
      
    // Create a basic API client
    var client = sdk.getBasicClient('L8WxCFs7a0Q9Bc5tlmLAEgYuaAZOvCEZ');
    
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
