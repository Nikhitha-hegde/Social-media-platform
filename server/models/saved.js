const mongoose = require('mongoose')

const SavedSchema = new mongoose.Schema ({
    username: { type: String, required: true, ref:'Login' },
    postUrl: { type: String, required: true, ref:'Post'}, 
    caption: { type: String},
    createdAt: { type: Date, default: Date.now },
    likes: {type: Number, default: 0},
    comments: {type:String}
})

const Saved = mongoose.model('Saved',SavedSchema)
module.exports = Saved