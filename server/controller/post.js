const cloudinary = require('../middleware/cloudinary')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const Post = require('../models/post')
const Login = require('../models/login')
const User = require('../models/user')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'posts', 
    allowed_formats: ['jpg', 'jpeg', 'png'], 
  },
});
const upload = multer({ storage })

const createPost = (async (req,res) => {
  upload.single('postUrl')(req, res, async (err) => { 
    if (err) {
        console.log('Multer Error:', err)
        return res.status(400).json({ message: err.message })
    }
    const {caption} = req.body
    try {
        const userId = req.user.id
        const user = await Login.findById(userId)
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }
        if(!req.file) {
          return res.status(200).json({msg : 'Please upload a picture for the post'})
        }

        const postUrl = req.file.path

        const newPost = new Post ({
            username:user.username,
            postUrl,
            caption : caption || '',
            likes :[],
            comments : []
        })      
        await newPost.save()

        const userProfile = await User.findOne({username : user.username})
        if (userProfile) {
          userProfile.posts.push(newPost._id);
          await userProfile.save();
        }

        return res.status(200).json({msg : 'Posted ', post:newPost})
    } catch (error) {
        console.log('Error creating post:', error)
        res.status(500).json({ msg: 'Internal server error', error })
    }
  })
})

const getPosts = async (req, res) => {
  try {
    const userId = req.user.id

    if (!userId) {
      return res.status(404).json({ message: 'User Id not found' })
    } else {
      const user = await Login.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      const posts = await Post.find({ username: user.username })
      if (!posts || posts.length === 0) {
        return res.status(200).json({ message: 'No posts found for this user', posts: [] })
      }
      return res.status(200).json({ posts })
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return res.status(500).json({ message: 'Error fetching posts', error })
  }
}

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params; // Post ID passed as a route parameter
    const userId = req.user.id; // Assume user authentication middleware adds `req.user`

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure the user is authorized to delete the post
    const user = await Login.findById(userId);
    if (!user || post.username !== user.username) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    // Delete the post from the Post schema
    await Post.findByIdAndDelete(postId);

    // Remove the post ID from the User's posts array
    const userProfile = await User.findOne({ username: user.username });
    if (userProfile) {
      userProfile.posts = userProfile.posts.filter(id => id.toString() !== postId);
      await userProfile.save();
    }

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};


module.exports = { deletePost, getPosts, createPost }






