// Set the 'production' environment configuration object
module.exports = {
	db: 'mongodb://yuxian:andyreta551209@ds117336.mlab.com:17336/node6-test',
	redis: 'redis://redis-14522.c16.us-east-1-3.ec2.cloud.redislabs.com:14522',
	sessionSecret: 'productionSessionSecret',
	cloudStorage: {
		photofolder:'43341632199',
		state: 'MyYuxianWebsite',
		clientID: 'mze26rnupvitiyo9g9j2xamrx78e8gwo',
		clientSecret: 'NofcjyrNTIDMGL4WUaGO5nRGeen38m3H',
		redirect_uri: 'http://localhost:3000/cloud/redirect',
		redirect_uri2:'http://localhost:3000/cloud/redirect2',
	},
};