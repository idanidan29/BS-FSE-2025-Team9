const express = require('express');
const User = require('../models/user');

const router = express.Router();

// Route to create a new user
router.post('/users', async (req, res) => {
  const { username, first_name, last_name, email, password, student_id, is_admin } = req.body;

  try {
    // Basic validation to ensure all required fields are provided
    if (!username || !email || !password || !student_id) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Create and save the new user
    const newUser = new User({
      username,
      first_name,
      last_name,
      email,
      password,
      student_id,
      is_admin: is_admin || false,  // הגדרת ברירת מחדל אם לא נשלח is_admin
    });
    await newUser.save();

    // Respond with the newly created user's details (excluding the password)
    res.status(201).json({ username, first_name, last_name, email, student_id, is_admin });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const { password: _, ...userDetails } = user.toObject(); // Removing the password from the response
    res.status(200).json(userDetails); // Send the user's details without the password
  } catch (err) {
    // If there is any error, return a 400 Bad Request with the error details
    res.status(400).json({ message: 'Error fetching user', error: err });
  }
});

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching users', error: err });
  }
});

router.get('/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userDetails } = user.toObject(); // Exclude password
    res.status(200).json(userDetails); // Return user details
  } catch (err) {
    res.status(400).json({ message: 'Error fetching user', error: err });
  }
});

// Route to delete all users
router.delete('/users', async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.status(200).json({
      message: 'All users deleted successfully',
      deletedCount: result.deletedCount, // Number of deleted users
    });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting all users', error: error.message });
  }
});



module.exports = router;
