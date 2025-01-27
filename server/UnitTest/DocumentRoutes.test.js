const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const server = require('../app'); // Import the main server
const Document = require('../models/Document'); // Import the Document model

const should = chai.should();
chai.use(chaiHttp);

describe("Document Routes", () => {
  before(async () => {
    const uri = ''; // Update if using a different test database URI
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  beforeEach(async () => {
    await Document.deleteMany({}); // Clear documents before each test
  });

  after(async () => {
    await mongoose.disconnect(); // Disconnect after all tests
  });

  /*** Tests for Document Creation ***/
  it("should create a document with valid data", async function () {
    this.timeout(5000); // Increase timeout to 5000ms
    const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."; // Use a valid base64 string

    const newDocument = {
      parking_application: {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        student_id: 123456,
        phone_number: 1234567890,
        Study_Department: "Computer Science",
        car_type: "Sedan",
        car_number: 1234,
        license_image: base64Image, // Use the actual base64 string here
      },
    };

    const res = await chai.request(server).post("/documents").send(newDocument);
    res.should.have.status(201);
    res.body.should.have.property("message").eql("Document created successfully");
    res.body.should.have.property("document");
    res.body.document.should.have.property("first_name").eql("John");
  });

  it("should return 400 if missing required fields", async () => {
    const incompleteDocument = {
      parking_application: {
        first_name: "John",
        last_name: "Doe",
        student_id: 123456,
        phone_number: 1234567890,
        Study_Department: "Computer Science",
        car_type: "Sedan",
        car_number: 1234,
        // Missing license_image
      },
    };

    const res = await chai.request(server).post("/documents").send(incompleteDocument);
    res.should.have.status(400);
    res.body.should.have.property("message").eql("All fields are required.");
  });

  /*** Tests for Fetching Documents ***/
  it("should get a document by student ID", async () => {
    const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."; 

    const newDocument = {
      parking_application: {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        student_id: 123456,
        phone_number: 1234567890,
        Study_Department: "Computer Science",
        car_type: "Sedan",
        car_number: 1234,
        license_image: base64Image, // Use the actual base64 string here
      },
    };

    const createdDocument = await chai.request(server).post("/documents").send(newDocument);
    const res = await chai.request(server).get(`/documents/${createdDocument.body.document.student_id}`);
    res.should.have.status(200);
    res.body.should.have.property("student_id").eql(123456);
  });

  it("should return 404 for a non-existing document", async () => {
    const res = await chai.request(server).get("/documents/999999");
    res.should.have.status(404);
    res.body.should.have.property("message").eql("No document found for this student.");
  });

  it("should fetch all documents", async () => {
    const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."; // Use a valid base64 string

    const newDocument1 = {
      parking_application: {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        student_id: 123456,
        phone_number: 1234567890,
        Study_Department: "Computer Science",
        car_type: "Sedan",
        car_number: 1234,
        license_image: base64Image,
      },
    };

    const newDocument2 = {
      parking_application: {
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        student_id: 654321,
        phone_number: 9876543210,
        Study_Department: "Mathematics",
        car_type: "SUV",
        car_number: 4321,
        license_image: base64Image,
      },
    };

    await chai.request(server).post("/documents").send(newDocument1);
    await chai.request(server).post("/documents").send(newDocument2);

    const res = await chai.request(server).get("/documents");
    res.should.have.status(200);
    res.body.should.be.a('array').that.has.lengthOf(2);
  });
});
