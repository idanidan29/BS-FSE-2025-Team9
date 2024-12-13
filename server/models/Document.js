const mongoose = require('mongoose');

// Define the schema for users
const DocumentSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  student_id: { type: Number, required: true, unique: true },
  phon_number: { type: Number, required: true, unique: true },
  Study_Department:{ type: Number, required: true, unique: true },
  car_type: { type: Number, required: true, unique: true },
  car_number: { type: Number, required: true, unique: true }
});

// Create a model from the schema
const User = mongoose.model('Document', userSchema, 'Documents');
module.exports = Document;
