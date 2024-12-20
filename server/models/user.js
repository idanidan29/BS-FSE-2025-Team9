const mongoose = require('mongoose');

// Define the schema for users
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  student_id: { type: Number, required: true, unique: true },
  is_admin: { type: Boolean, default: false } 
});


// Create a model from the schema
const User = mongoose.model('User', userSchema, 'Users');
module.exports = User;
