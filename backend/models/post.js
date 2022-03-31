const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    image: {type: String, required: true},
    address: {type: String, required: true},
    location:{
        lat : {type: Number, required: true},
        lng : {type: Number, required: true},
    },
    creator: {
        id: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
        name: {type: String, required: true},
        image: {type: String, required: true},
    }
})

//above type : mongoose Object ID and
//ref connect User schema with Place schema

module.exports = mongoose.model('Post', postSchema);