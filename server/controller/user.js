const cloudinary = require('../middleware/cloudinary')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const User = require('../models/user')
const Login = require('../models/login')
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pics', 
    allowed_formats: ['jpg', 'jpeg', 'png'], 
  },
});
const upload = multer({ storage })

const getuser = async(req,res) => {
  try {
    const userId = req.user.id;

    const userData = await Login.findById(userId)
    if (!userData) {
    return res.status(404).json({ message: "User not found" })
    }

    let userProfile = await User.findOne({ username: userData.username }).populate('posts')
    if (req.method === 'GET') {
        if(!userProfile) {
            userProfile = new User ({
            username: userData.username,
            profilePic: userData.profilePic || null,
            bio: userData.bio || null,
            posts: userData.posts || [],
            followers: userData.followers || [],
            following: userData.following || [],
            followersCount: userData.followersCount || 0,
            followingCount: userData.followingCount || 0
            })
            await userProfile.save()
        }
        return res.status(200).json({ user: userProfile })
    } else if(req.method === 'PUT') {
      upload.single('profilePic')(req, res, async (err) => {
        if (err) {
          console.error('Multer Error:', err)
          return res.status(400).json({ message: err.message })
        }

        const { bio, posts, followers, following, followersCount, followingCount } = req.body
        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" })
        }

        // Update profilePic if uploaded
        if (req.file) {
          console.log('File received:', req.file)
          userProfile.profilePic = req.file.path
        } else {
          console.log('No file uploaded')
        }
        userProfile.bio = bio || userProfile.bio
        userProfile.posts = posts || userProfile.posts
        userProfile.followers = followers || userProfile.followers
        userProfile.following = following || userProfile.following
        userProfile.followersCount = followersCount || userProfile.followersCount
        userProfile.followingCount = followingCount || userProfile.followingCount

        console.log('Request Body:', req.body)
        console.log('Uploaded File:', req.file)

        await userProfile.save()
        return res.status(200).json({user : userProfile})
      })
    }
    

    } catch(error) {
        console.error(error)
        return res.status(500).json({ message: 'Error fetching user data' })
    }
}

const followUser = async (req, res) => {
  try {
    const currentUserLoginId = req.user.id
    const targetUserId = req.params.id

    const currentUserLogin = await Login.findById(currentUserLoginId)
    if (!currentUserLogin) {
      return res.status(404).json({ message: "Current user login not found" })
    }

    const currentUser = await User.findOne({ username: currentUserLogin.username })
    if (!currentUser) {
      return res.status(404).json({ message: "Current user profile not found" })
    }

    if (currentUser._id.toString() === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" })
    }

    const targetUser = await User.findById(targetUserId)
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" })
    }

    if (!currentUser.following.includes(targetUser._id.toString())) {
      currentUser.following.push(targetUser._id)
      currentUser.followingCount++
    }

    if (!targetUser.followers.includes(currentUser._id.toString())) {
      targetUser.followers.push(currentUser._id)
      targetUser.followersCount++
    }

    await currentUser.save()
    await targetUser.save()

    res.status(200).json({
      message: "Successfully followed the user",
      currentUser,
      targetUser,
    })
  } catch (error) {
    console.error("Error following user:", error)
    res.status(500).json({ message: "Failed to follow user" })
  }
}


const unfollowUser = async (req, res) => {
  try {
    const currentUserLoginId = req.user.id
    const targetUserId = req.params.id

    const currentUserLogin = await Login.findById(currentUserLoginId)
    if (!currentUserLogin) {
      return res.status(404).json({ message: "Current user login not found" })
    }

    const currentUser = await User.findOne({ username: currentUserLogin.username })
    if (!currentUser) {
      return res.status(404).json({ message: "Current user profile not found" })
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" })
    }

    const isFollowing = currentUser.following.includes(targetUser._id.toString())
    if (!isFollowing) {
      return res.status(400).json({ message: "You are not following this user" })
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUser._id.toString()
    );
    currentUser.followingCount = Math.max(0, currentUser.followingCount - 1)

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );
    targetUser.followersCount = Math.max(0, targetUser.followersCount - 1)

    await currentUser.save()
    await targetUser.save()

    res.status(200).json({
      message: "Successfully unfollowed the user",
      currentUser,
      targetUser,
    })
  } catch (error) {
    console.error("Error unfollowing user:", error)
    res.status(500).json({ message: "Failed to unfollow user" })
  }
}


const getFollowers = async (req, res) => {
  try {
    const currentUserId = req.user.id

    const currentUserLogin = await Login.findById(currentUserId)
    if (!currentUserLogin) {
      return res.status(404).json({ message: "User not found in Login" })
    }

    const currentUser = await User.findOne({ username: currentUserLogin.username })
    if (!currentUser) {
      return res.status(404).json({ message: "User profile not found" })
    }

    const followers = await User.find(
      { _id: { $in: currentUser.followers } },
      { username: 1, profilePic: 1 }
    )

    res.status(200).json({
      message: "Followers retrieved successfully",
      followers,
    })
  } catch (error) {
    console.error("Error retrieving followers:", error)
    res.status(500).json({ message: "Failed to retrieve followers" })
  }
}

const getFollowing = async (req, res) => {
  try {
    const currentUserId = req.user.id

    const currentUserLogin = await Login.findById(currentUserId)
    if (!currentUserLogin) {
      return res.status(404).json({ message: "User not found in Login" })
    }
    const currentUser = await User.findOne({ username: currentUserLogin.username })
    if (!currentUser) {
      return res.status(404).json({ message: "User profile not found" })
    }

    const following = await User.find(
      { _id: { $in: currentUser.following } },
      { username: 1, profilePic: 1 } 
    )

    res.status(200).json({
      message: "Following retrieved successfully",
      following,
    });
  } catch (error) {
    console.error("Error retrieving following:", error);
    res.status(500).json({ message: "Failed to retrieve following" })
  }
}


module.exports = { getFollowing, getFollowers, getuser, followUser, unfollowUser }
