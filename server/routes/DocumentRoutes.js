const express = require('express');
const Document = require('../models/Document');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Helper function to decode and save base64 image
const saveBase64Image = (base64String, student_id) => {
    // Extract base64 data and file extension
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
    }

    const fileType = matches[1];
    const base64Data = matches[2];
    const extension = fileType.split('/')[1];
   
    // Create filename
    const fileName = `license-${student_id}-${Date.now()}.${extension}`;
    const filePath = path.join('uploads', fileName);

    // Ensure uploads directory exists
    if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads');
    }

    // Save file
    fs.writeFileSync(filePath, base64Data, 'base64');
    return fileName;
};

// Route to create a new document
router.post('/documents', async (req, res) => {
    console.log("=== POST /documents request received ===");
   
    try {
        const { parking_application } = req.body;
       
        // Validate required fields
        if (!parking_application.first_name ||
            !parking_application.last_name ||
            !parking_application.email ||
            !parking_application.student_id ||
            !parking_application.phone_number ||
            !parking_application.Study_Department ||
            !parking_application.car_type ||
            !parking_application.car_number ||
            !parking_application.license_image) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Save base64 image
        const fileName = saveBase64Image(
            parking_application.license_image,
            parking_application.student_id
        );

        // Create new document
        const newDocument = new Document({
            first_name: parking_application.first_name,
            last_name: parking_application.last_name,
            email: parking_application.email,
            student_id: parking_application.student_id,
            phone_number: parking_application.phone_number,
            Study_Department: parking_application.Study_Department,
            car_type: parking_application.car_type,
            car_number: parking_application.car_number,
            licenseImage: fileName,
            is_Won: is_Won || false,
        });

        await newDocument.save();
        console.log("Document saved successfully");
       
        res.status(201).json({
            message: 'Document created successfully',
            document: newDocument
        });
    } catch (err) {
        console.error("Error saving document:", err);
        res.status(400).json({ message: 'Error creating document', error: err.message });
    }
});

// Keep your existing routes
/*router.get('/documents/:student_id', async (req, res) => {
    try {
        const document = await Document.findOne({ student_id: req.params.student_id });
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(document);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching document', error: err });
    }
});*/ 
//new get
router.get('/documents/:student_id', async (req, res) => {
    try {
        const {student_id }=req.params;
        console.log("Fetching document for student_id:", student_id);
        const updatedDocument = await Document.findOne({ student_id }); // חפש את המסמך לפי student_id

    

    if (!updatedDocument) {
      return res.status(404).json({ message: 'No document found for this student.' });
    }

    res.status(200).json(updatedDocument);
  } catch (err) {
    console.error("Error fetching document:", err);
    res.status(400).json({ message: 'Error updating document', error: err });
  }
});



router.get('/documents', async (req, res) => {
    try {
        const documents = await Document.find();
        res.status(200).json(documents);
    } catch (err) {
        console.error("Error fetching document:", err);
        res.status(400).json({ message: 'Error fetching documents', error: err });
    }
});

router.put('/documents/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    const updatedData = req.body; // Data to update
    // Validate required fields 
    if (!updatedData.first_name ||
        !updatedData.last_name ||
        !updatedData.email ||
        !updatedData.phone_number ||
        !updatedData.Study_Department ||
        !updatedData.car_type ||
        !updatedData.car_number ||
        !updatedData.license_image) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

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