const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    email: {type:String, required:true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/},
    username: {type: String, required: true, unique: true },
    password: {type:String, required:true, minlength:6},
    confirmpw: {type:String, required:true}
})

const Login = mongoose.model('Login', LoginSchema)
module.exports = Login