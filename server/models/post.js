const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema ({
    username: { type: String, required: true },
    postUrl: { type: String, default:'', required: true}, 
    caption: { type: String, default : ''},
    createdAt: { type: Date, default: Date.now },
    likes: {type: [mongoose.Schema.Types.ObjectId], default:[]},
    comments: [{
        userId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Login',
          required: true,
        },
        commentText: {
          type: String, 
          required: true,
        },
        createdAt: {
          type: Date, 
          default: Date.now,
        }
      }]
})

const Post = mongoose.model('Post', PostSchema)
module.exports = Post