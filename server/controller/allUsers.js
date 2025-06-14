const User = require('../models/user')
const Login = require('../models/login')

const getAllUsers = async (req, res) => {
  try {
    const currentUserLoginId = req.user.id

    const currentUserLogin = await Login.findById(currentUserLoginId)
    if (!currentUserLogin) {
      return res.status(404).json({ message: "Current user login not found" })
    }

    const currentUser = await User.findOne({ username: currentUserLogin.username })
    if (!currentUser) {
      return res.status(404).json({ message: "Current user profile not found" })
    }

    const allUsers = await User.find({ _id: { $ne: currentUser._id } })
      .select("_id username profilePic followers following")
      .lean()

    if (!allUsers.length) {
      return res.status(404).json({ message: "No other users found" })
    }

    const userDetails = allUsers.map(user => ({
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic || "",
      followersCount: user.followers.length,
      followingCount: user.following.length,
    }))

    res.status(200).json({
      message: "Successfully fetched user details",
      users: userDetails,
    })
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
}

module.exports = getAllUsers