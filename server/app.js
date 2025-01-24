const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');  // Import user routes
const documentRoutes = require('./routes/DocumentRoutes'); // Import document routes (assumed)
const cors = require('cors');
require('dotenv').config();



const app = express();

const PORT = 5000;
const mongoUri = process.env.MONGO_URI;



// Middleware for CORS and JSON parsing
app.use(cors({
  origin: '*'  // Allow all origins
}));
app.use(express.json({ limit: '7mb' }));
app.use(express.urlencoded({ limit: '7mb', extended: true }));


// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Route handling
app.use('/', userRoutes);  // Use user routes
app.use('/', documentRoutes); // Use document routes
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;