const express = require('express');
//const bcrypt = require('bcrypt'); // For password hashing
const User = require('../models/user');

const router = express.Router();

// Route to create a new user
router.post('/users', async (req, res) => {
  const { username, first_name, last_name, email, password, student_id } = req.body;

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

    // Hash the password before storing it in the database
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      username,
      first_name,
      last_name,
      email,
      password, //hashedPassword,
      student_id,
    });
    await newUser.save();

    // Respond with the newly created user's details (excluding the password)
    res.status(201).json({ username, first_name, last_name, email, student_id });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
  }
});

// Route to authenticate user login
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate that both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Find the user in the database by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // If authentication is successful, return a success message and user details
    res.status(200).json({ message: 'Login successful!', user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
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

// Route to get a specific user by username
router.get('/users/:username', async (req, res) => {
  try {
    // Find a user by their username
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user's details
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching user', error: err });
  }
});

module.exports = router;
