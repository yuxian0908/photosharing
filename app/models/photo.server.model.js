var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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

PhotoSchema.post('remove', function (doc) {    
    var This = this;
    this.model('User').update(
        { _id: This.creator },
        { $pull: { imgs: This._id } },
        { multi: true },
        function(err,result){
            if(err) console.log('err');
            console.log("del suc");
        }
    );
});

mongoose.model('Photo', PhotoSchema);