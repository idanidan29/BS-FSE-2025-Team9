const express = require('express');
const Document = require('../models/Document'); 

const router = express.Router();

// Route to create a new document (e.g., for registration)
router.post('/documents', async (req, res) => {
  const { first_name, last_name, email, student_id, phone_number, Study_Department, car_type, car_number } = req.body;

  try {
    // Create and save the new document
    const newDocument = new Document({ first_name, last_name, email, student_id, phone_number, Study_Department, car_type, car_number });
    await newDocument.save();

    // Respond with the newly created user (without the password for security reasons)
    res.status(201).json({ first_name, last_name, email, student_id, phone_number, Study_Department, car_type, car_number });
  } catch (err) {
    res.status(400).json({ message: 'Error creating document', error: err });
  }
});


// Route to get a user by email
router.get('/documents/:student_id', async (req, res) => {
  try {
    const document = await Document.findOne({ student_id: req.params.student_id });
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

router.put('/documents/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    const updatedData = req.body; // Data to update

    // Find and update the document by student_id
    const updatedDocument = await Document.findOneAndUpdate(
      { student_id },
      { $set: updatedData },
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json(updatedDocument);
  } catch (err) {
    res.status(400).json({ message: 'Error updating document', error: err });
  }
});


module.exports = router;
