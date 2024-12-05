const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Atlas Connection - Manually input connection details
const MONGO_URI = 'mongodb+srv://system:NzEo6pKiK9Kq9d9O@filesystem.5cw90.mongodb.net/File_System';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected to File_System database'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());  // Middleware to parse JSON request bodies

// Define User Model for the 'Users' collection inside the 'File_System' database
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// The third parameter specifies the collection name in MongoDB ('Users')
const User = mongoose.model('User', userSchema, 'Users');

// Basic API Route
app.get('/', (req, res) => res.send('API is running'));

// Route to create a new user
app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = new User({ username, email, password });
    await newUser.save(); // Save the new user to the 'Users' collection
    res.status(201).json(newUser);  // Respond with the newly created user
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
  }
});

// Route to fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Retrieve all users from 'Users' collection
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching users', error: err });
  }
});

// Route to fetch a user by email
app.get('/users/:email', async (req, res) => {
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

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
