// Set the 'production' environment configuration object
module.exports = {
	db: 'mongodb://yuxian:andyreta551209@ds117336.mlab.com:17336/node6-test',
	redis: 'redis://redis-14522.c16.us-east-1-3.ec2.cloud.redislabs.com:14522',
	sessionSecret: 'productionSessionSecret',
	cloudStorage: {
		photofolder:'43341632199',
		state: 'MyYuxianWebsite',
		clientID: 'fxqgv6j3jhaw8ojcru516o4syzrc0hoj',
		clientSecret: 'z6WJz4b3bMOylAT5BWD892OEc1E1n5aW',
		redirect_uri: 'https://yuxian-photosharing.herokuapp.com/cloud/redirect',
		redirect_uri2:'https://yuxian-photosharing.herokuapp.com/cloud/redirect2',
	},
};