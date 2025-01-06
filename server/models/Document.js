const mongoose = require('mongoose');

// Define the schema for users
const DocumentSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true},
  student_id: { type: Number, required: true,unique: true },
  phone_number: { type: Number, required: true },
  Study_Department:{ type: String, required: true},
  car_type: { type: String, required: true },
  car_number: { type: Number, required: true },
  licenseImage: { type: String, required: true },
  is_Won: {type: Boolean, required: false, default: false}

});

// Create a model from the schema
const Document = mongoose.model('Document', DocumentSchema, 'Documents');
module.exports = Document;