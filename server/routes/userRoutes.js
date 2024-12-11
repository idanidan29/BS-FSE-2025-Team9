const express = require('express');
const User = require('../models/user');  

const router = express.Router();

// Route to create a new user 
router.post('/users', async (req, res) => {
  const { username, first_name, last_name, email, password, student_id } = req.body;

  try {
    // Create and save the new user
    const newUser = new User({ username, first_name, last_name, email, password, student_id });
    await newUser.save();

    res.status(201).json({ username, first_name, last_name, email, student_id });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
  }
});

router.get('/users/:username', async (req, res) => {
  try {

    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } 
    catch (err) {
    res.status(400).json({ message: 'Error fetching user', error: err });
  }
});


// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // return all users
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching users', error: err });
  }
});

module.exports = router;
