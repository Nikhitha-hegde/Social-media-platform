const express=require("express")
const router = express.Router()
const {login,signup, verifyEmail}=require("../controller/login")
const {getFollowing, getFollowers,getuser, followUser, unfollowUser} =require("../controller/user")
const authenticationMiddleware = require('../middleware/auth')

router.route("/login").post(login)
router.route("/signup").post(signup)
router.route("/verifyEmail").post(verifyEmail)
router.route("/getuser").get(authenticationMiddleware,getuser)
router.route("/updateuser").put(authenticationMiddleware,getuser)
router.route("/follow/:id").post(authenticationMiddleware, followUser)
router.route("/unfollow/:id").post(authenticationMiddleware, unfollowUser)
router.route("/getFollowers").get(authenticationMiddleware,getFollowers)
router.route("/getFollowing").get(authenticationMiddleware,getFollowing)

module.exports=router;