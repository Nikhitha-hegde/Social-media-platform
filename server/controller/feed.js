const User = require('../models/user')
const Login = require('../models/login')
const Post = require('../models/post')

const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user.id

    const userData = await Login.findById(userId)
    if (!userData) {
    return res.status(404).json({ message: "User not found in Login" })
    }

    const user = await User.findOne({ username: userData.username }).populate('following', 'username profilePic')
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const posts = await Post.find({ username: { $in: user.following.map(f => f.username) } })
      .populate('comments.userId', 'username profilePic')
      .sort({ createdAt: -1 })

    res.status(200).json({
      posts: posts.map(post => ({
        id: post._id,
        username: post.username,
        profilePic: user.following.find(f => f.username === post.username)?.profilePic || '',
        postUrl: post.postUrl,
        caption: post.caption,
        createdAt: post.createdAt,
        likesCount: post.likes.length,
        comments: post.comments.map(comment => ({
          username: comment.userId?.username || 'Unknown',
          profilePic: comment.userId?.profilePic || '',
          commentText: comment.commentText,
          createdAt: comment.createdAt,
        })),
      })),
    })
  } catch (error) {
    console.error("Error fetching feed posts:", error)
    res.status(500).json({ message: "Failed to fetch feed posts" })
  }
}

module.exports = getFeedPosts