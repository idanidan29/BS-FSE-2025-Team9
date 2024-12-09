const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');  // Keep the user routes

const app = express();

// Hardcoded port and MongoDB URI
const PORT = 5000;
const MONGO_URI = 'mongodb+srv://system:NzEo6pKiK9Kq9d9O@filesystem.5cw90.mongodb.net/File_System';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected to File_System database'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());  // Middleware to parse JSON

app.use('/', userRoutes);


// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
