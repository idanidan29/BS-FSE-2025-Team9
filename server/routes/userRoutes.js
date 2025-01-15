const multer = require('multer');
const upload= multer ({dest: 'uploads/'});
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');




const router = express.Router();

// Route to create a new user
router.post('/users', async (req, res) => {
  const { username, first_name, last_name, email, password, student_id, is_admin } = req.body;

  try {
    if (!username || !email || !password || !student_id) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const newUser = new User({
      username,
      first_name,
      last_name,
      email,
      password,
      student_id,
      is_admin: is_admin || false,
    });
    await newUser.save();

    res.status(201).json({ username, first_name, last_name, email, student_id, is_admin });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
  }
});

// Route to log in a user
router.post('/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const { password: _, ...userDetails } = user.toObject();
    res.status(200).json(userDetails);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching user', error: err });
    console.error(err);

  }

});

// Route to get all users who are not admins (is_admin: false)
router.get('/students', async (req, res) => {
  try {
    // סינון המשתמשים לפי is_admin: false
    const students = await User.find({ is_admin: false });

    // אם לא נמצאו משתמשים, מחזירים הודעת שגיאה
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found.' });
    }

    // מחזירים את כל המשתמשים שאינם אדמינים
    res.status(200).json(students);
  } catch (err) {
    // אם יש שגיאה בשאילתא, מחזירים הודעת שגיאה
    res.status(400).json({ message: 'Error fetching students', error: err });
  }
});

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching users', error: err });
  }
});

// Route to get a user by username
router.get('/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userDetails } = user.toObject();
    res.status(200).json(userDetails);
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

// Route to update a user
router.put('/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { first_name, last_name, email, password, student_id, is_admin } = req.body;

    // Find the user by username and update the provided fields
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: { first_name, last_name, email, password, student_id, is_admin } },
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userDetails } = updatedUser.toObject();
    res.status(200).json(userDetails);
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err });
  }
});

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await User.findOneAndDelete({ student_id: id });
      if (!result) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully', user: result });
  } catch (error) {
      res.status(400).json({ message: 'Error deleting user', error: error.message });
  }
});


module.exports = router;