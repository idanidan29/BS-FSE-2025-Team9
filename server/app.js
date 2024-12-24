const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');  // Import user routes
const documentRoutes = require('./routes/DocumentRoutes'); // Import document routes (assumed)
const cors = require('cors');


const app = express();

// Configuration for PORT and MongoDB URI
const PORT = 5000;
const MONGO_URI = 'mongodb+srv://system:NzEo6pKiK9Kq9d9O@filesystem.5cw90.mongodb.net/File_System';

// Middleware for CORS and JSON parsing
app.use(cors({
  origin: '*'  // Allow all origins (adjust for production as needed)
}));
app.use(express.json());  // Middleware to parse JSON
app.use(express.json({ limit: '7mb' }));
app.use(express.urlencoded({ limit: '7mb', extended: true }));


// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected to File_System database'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Route handling
app.use('/', userRoutes);  // Use user routes
app.use('/', documentRoutes); // Use document routes (adjust as necessary)

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
