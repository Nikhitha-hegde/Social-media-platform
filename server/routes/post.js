const express = require('express')
const router = express.Router()
const { deletePost, getPosts, createPost } = require('../controller/post')
const getFeedPosts = require('../controller/feed')
const getAllUsers = require('../controller/allUsers')
const authenticationMiddleware = require('../middleware/auth')

router.route("/post").post(authenticationMiddleware,createPost)
router.route("/getpost").get(authenticationMiddleware,getPosts)
router.route("/getfeed").get(authenticationMiddleware,getFeedPosts)
router.route("/getallusers").get(authenticationMiddleware,getAllUsers)
router.route("/deletepost/:postId").post(authenticationMiddleware,deletePost)

module.exports = router