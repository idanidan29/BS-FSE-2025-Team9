const express = require('express');
const User = require('../models/Document');  // Import the User model

const router = express.Router();

// Route to create a new document (e.g., for registration)
router.post('/documents', async (req, res) => {
  const { first_name, last_name, email, student_id, phon_number, Study_Department, car_type, car_number } = req.body;

  try {
    // Create and save the new document
    const newDocument = new Document({ first_name, last_name, email, student_id, phon_number, Study_Department, car_type, car_number });
    await newDocument.save();

    // Respond with the newly created user (without the password for security reasons)
    res.status(201).json({ first_name, last_name, email, student_id, phon_number, Study_Department, car_type, car_number });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
  }
});

// Route to get a user by email
router.get('/documents/:email', async (req, res) => {
  try {
    const document = await Document.findOne({ email: req.params.email });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching document', error: err });
  }
});

// Route to get all documents
router.get('/documents', async (req, res) => {
  try {
    const documents = await Document.find();  // Retrieve all documents from the 'Documents' collection
    res.status(200).json(documents);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching documents', error: err });
  }
});


module.exports = router;
