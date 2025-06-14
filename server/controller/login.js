const jwt=require('jsonwebtoken')
const Login =require('../models/login')
const nodemailer = require('nodemailer')
const Verification =require('../models/verification')
const { validationResult } = require('express-validator')
const authenticationMiddleware = require('../middleware/auth')


const login =async(req,res) =>{
  const reqdata =req.body;
  const {email,password}=reqdata;
  const data=await Login.find(reqdata);
  const incorrectPass= await Login.find({email:email})
  try {
    if(!email || !password) {
      return res.status(400).json({success: false, msg:"Enter required details"})
    }
    if(incorrectPass.length>0&&password!=incorrectPass[0].password){
      return res.status(401).json({success: false, msg:"Incorrect password"})
    }
    if(data.length>0){
      const {id,email,username}=data[0];
      const token=jwt.sign({id,email,username},process.env.JWT_SECRET,{expiresIn:'7d'})
      console.log('Logged in successfully'); 
      return res.status(200).json({success: true, msg:"Logged-in sucessfully",token,userId:id})
    }
    if(email != incorrectPass.email) {
      return res.status(200).json({success: false, msg:"User not found, please sign up"})
    }
  } catch (error) {
       console.log(error)
       res.status(500).json({success: false, msg: "Internal server error" })
  }
}

// Function to generate and send verification email
const sendVerificationCodeEmail = async (email, verificationCode) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.SECRET_EMAIL, 
        pass: process.env.SECRET_PASS, 
        },
    })

    const mailprocess = {
        from: process.env.SECRET_EMAIL,
        to: email,
        subject: 'Verify Your Email for Sign Up',
        html: `
        <h1>Verification Code for Your PhotoGram Account</h1>
        <p>Here is your verification code: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        `,
    }

    try {
        await transporter.sendMail(mailprocess)
        console.log('Verification email sent')
    } catch (error) {
        console.error('Error sending verification email:', error)
        throw new Error('Failed to send verification email')
    }
}

// Signup Controller
const signup = async (req, res) => {
  const { email, username, password, confirmpw } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    if (!password || !confirmpw) {
      return res.status(400).json({ msg: 'Password and Confirm Password are required' })
    }

    const existingUser = await Login.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists with this email' })
    }

    if (password !== confirmpw) {
      return res.status(400).json({ msg: 'Passwords do not match' })
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Code expires in 10 minutes

    const newVerification = new Verification({
      email,
      verificationCode,
      expiresAt,
    });
    await newVerification.save();
    await sendVerificationCodeEmail(email, verificationCode);

    const newUser = new Login({
      email,
      username,
      password,
      confirmpw,
    });
    await newUser.save();

    res.status(200).json({ msg: 'Signup successful. Please verify your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error', error });
  }
};

const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const verification = await Verification.findOne({ email });
    if (!verification) {
      return res.status(400).json({ msg: 'Verification code not found' });
    }

    if (verification.verificationCode !== verificationCode) {
      return res.status(400).json({ msg: 'Invalid verification code' });
    }

    if (new Date() > verification.expiresAt) {
      return res.status(400).json({ msg: 'Verification code has expired. Please request a new one.' });
    }

    const user = await Login.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ msg: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error', error });
  }
};

module.exports = { login,signup,verifyEmail};
