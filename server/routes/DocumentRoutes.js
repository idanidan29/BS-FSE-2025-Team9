const express = require('express');
const Document = require('../models/Document'); 
const multer = require('multer');
const router = express.Router();
const path = require('path');

// הגדרת storage עבור multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ודא שהתיקייה הזו קיימת
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  }
});

// הכנת middleware ל-upload
const upload = multer({ storage: storage });

// Route to create a new document (e.g., for registration)
router.post('/documents', upload.single('licenseImage'), async (req, res) => {
  console.log("=== POST /documents request received ===");
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  const { first_name, last_name, email, student_id, phone_number, Study_Department, car_type, car_number } = req.body;
  const licenseImage = req.file ? req.file.path : null;

  if (!req.file) {
      console.log("Error: No file uploaded");
      return res.status(400).send('No file uploaded.');
  }

  if (!first_name || !last_name || !email || !student_id || !phone_number || !Study_Department || !car_type || !car_number) {
      console.log("Error: Missing required fields", { first_name, last_name, email, student_id, phone_number, Study_Department, car_type, car_number });
      return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
      console.log("Creating new document with data:", {
          first_name,
          last_name,
          email,
          student_id,
          phone_number,
          Study_Department,
          car_type,
          car_number,
          licenseImage: req.file.filename
      });

      const newDocument = new Document({
          first_name,
          last_name,
          email,
          student_id,
          phone_number,
          Study_Department,
          car_type,
          car_number,
          licenseImage: req.file.filename
      });

      await newDocument.save();
      console.log("Document saved successfully");
     
      res.status(201).json({ first_name, last_name, email, student_id, phone_number, Study_Department, car_type, car_number, driversLicense: req.file.filename });
  } catch (err) {
      console.error("Error saving document:", err);
      res.status(400).json({ message: 'Error creating document', error: err });
  }
});
/*router.get('/documents/license/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
  res.sendFile(filePath);
});*/



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


module.exports = router;