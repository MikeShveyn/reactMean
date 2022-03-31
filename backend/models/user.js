const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    image: {type: String, required: true},
    isAdmin: {type : Boolean, required: true},
    posts: [{type: mongoose.Types.ObjectId, required: true, ref: 'Post'}],
})

// take unique value (email in our case ) and make sure it unique across db
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);