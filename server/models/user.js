const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  profilePic: { type: String, default: "" },
  bio: { type: String, default: "" },  
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref : 'Post', default: [] }],
  followers: [{ type: mongoose.Schema.Types.ObjectId,ref: 'User' , default: []}],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' , default: []}],
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema)
module.exports = User
