const express = require('express');
const User = require('../models/user');  // Import the User model

const router = express.Router();

// Route to create a new user (e.g., for registration)
router.post('/users', async (req, res) => {
  const { username, first_name, last_name, email, password, student_id, is_admin } = req.body;

  try {
    // Create and save the new user
    is_admin = false;
    const newUser = new User({ username, first_name, last_name, email, password, student_id, is_admin });
    await newUser.save();

    // Respond with the newly created user (without the password for security reasons)
    res.status(201).json({ username, first_name, last_name, email, student_id, is_admin });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
  }
});

// Route to get a user by email
router.get('/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching user', error: err });
  }
});

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Retrieve all users from the 'Users' collection
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching users', error: err });
  }
});




module.exports = router;
