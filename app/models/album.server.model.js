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

AlbumSchema.post('remove', function (doc) {    
    var This = this;
    this.model('User').update(
        { _id: This.owner },
        { $pull: { albums: This._id } },
        { multi: true },
        function(err,result){
            if(err) console.log('err');
            console.log("del suc");
        }
    );
});

// Create the 'Album' model out of the 'UserSchema'
mongoose.model('Album', AlbumSchema);