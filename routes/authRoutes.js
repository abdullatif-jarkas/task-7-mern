const express = require("express");
const User = require("../models/User");
const router = express.Router();
const jwt = require('jsonwebtoken');


//^ Register
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;

    //~ Check if the user already exist by the email
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'the user already exists' });
    }

    //~ Create the user
    const user = new User(req.body);

    await user.save();

    //& Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name,  email: user.email },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//^ Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } =  req.body

    //? Find the user by email
    const user = await User.findOne({ email: email });
    if(!user) {
      return res.status(400).json({ message: 'Invalid Email or Password' });
    }
    
    //? check if the password matches 
    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
      return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    //& Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })
    
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name,  email: user.email },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//! Logout
router.post("/logout", (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});


module.exports = router;
