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
      password,
      student_id,
    });
    await newUser.save();

    // Respond with the newly created user's details (excluding the password)
    res.status(201).json({ username, first_name, last_name, email, student_id });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
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
    // Extract password from the request body
    const { password } = req.body;

    // Find the user in the database by their username
    const user = await User.findOne({ username: req.params.username });

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored password
    // If the password doesn't match, return a 401 Unauthorized error
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // If authentication is successful, return the user's details
    // We exclude the password from the response
    const { password: _, ...userDetails } = user.toObject(); // Removing the password from the response
    res.status(200).json(userDetails); // Send the user's details without the password
  } catch (err) {
    // If there is any error, return a 400 Bad Request with the error details
    res.status(400).json({ message: 'Error fetching user', error: err });
  }
});


module.exports = router;
