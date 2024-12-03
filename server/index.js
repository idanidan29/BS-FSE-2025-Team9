const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use(express.json()); // Middleware to parse JSON

// Basic API Route
app.get('/', (req, res) => res.send('API is running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
