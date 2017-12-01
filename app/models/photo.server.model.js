var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define a new 'UserSchema'
var PhotoSchema = new Schema({
    created: {
		type: Date,
		default: Date.now
	},
    originalname: String,
    path: String,
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

// Create the 'User' model out of the 'UserSchema'
mongoose.model('Photo', PhotoSchema);