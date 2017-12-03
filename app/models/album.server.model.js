var mongoose = require('mongoose'),
Schema = mongoose.Schema;

// Define a new 'AlbumSchema'
var AlbumSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name:String,
    img:[{
        type: Schema.ObjectId,
        ref: 'Photo'
    }],
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

// Create the 'Album' model out of the 'UserSchema'
mongoose.model('Album', AlbumSchema);