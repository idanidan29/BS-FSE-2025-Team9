const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app"); // Import your main server
const Document = require("../models/Document"); // Import the Document model

const should = chai.should();
chai.use(chaiHttp);

describe("Document Routes", () => {
  beforeEach(async function () {
    await Document.deleteMany({});
    console.log("Database cleared");
  });

  it("should create a new document", async () => {
    const newDocument = {
      parking_application: {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        student_id: "123456789",
        phone_number: "1234567890",
        Study_Department: "Computer Science",
        car_type: "Sedan",
        car_number: "1223",
        license_image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" // Shortened for brevity
      }
    };

    const res = await chai.request(server).post("/documents").send(newDocument);
    res.should.have.status(201);
    res.body.should.have.property("message").eql("Document created successfully");
    res.body.document.should.have.property("first_name").eql("John");
    console.log("Test passed: should create a new document");
  });

  it("should not create a document with missing fields", async () => {
    const newDocument = {
      parking_application: {
        first_name: "Jane",
        last_name: "Doe",
        email: "jane.doe@example.com",
        student_id: "987654321",
        // Missing required fields
      }
    };

    const res = await chai.request(server).post("/documents").send(newDocument);
    res.should.have.status(400);
    res.body.should.have.property("message").eql("All fields are required.");
    console.log("Test passed: should not create a document with missing fields");
  });

  it("should get a document by student_id", async () => {
    const newDocument = await Document.create({
      first_name: "Alice",
      last_name: "Smith",
      email: "alice.smith@example.com",
      student_id: 112233445, // Updated to Number
      phone_number: 9876543210, // Updated to Number
      Study_Department: "Engineering",
      car_type: "SUV",
      car_number: 12234, // Updated to Number
      licenseImage: "license-112233445.png",
    });
  
    const res = await chai.request(server).get(`/documents/${newDocument.student_id}`);
    res.should.have.status(200);
    res.body.should.have.property("student_id").eql(newDocument.student_id); // Matches Number
    console.log("Test passed: should get a document by student_id");
  });
  

  it("should return 404 for a non-existing document", async () => {
    const res = await chai.request(server).get("/documents/999999999");
    res.should.have.status(404);
    res.body.should.have.property("message").eql("No document found for this student.");
    console.log("Test passed: should return 404 for a non-existing document");
  });

  it("should get all documents", async () => {
    const documents = [
      {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        student_id: "123456789",
        phone_number: "1234567890",
        Study_Department: "Computer Science",
        car_type: "Sedan",
        car_number: "123456",
        licenseImage: "license-123456789.png"
      },
      {
        first_name: "Alice",
        last_name: "Smith",
        email: "alice.smith@example.com",
        student_id: "987654321",
        phone_number: "9876543210",
        Study_Department: "Engineering",
        car_type: "SUV",
        car_number: "76543",
        licenseImage: "license-987654321.png"
      }
    ];

    await Document.insertMany(documents);

    const res = await chai.request(server).get("/documents");
    res.should.have.status(200);
    res.body.should.be.a("array");
    res.body.length.should.be.eql(2);
    console.log("Test passed: should get all documents");
  });

  it("should update a document by student_id", async () => {
    const newDocument = await Document.create({
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      student_id: "123456789",
      phone_number: "1234567890",
      Study_Department: "Computer Science",
      car_type: "Sedan",
      car_number: "1223",
      licenseImage: "license-123456789.png"
    });

    const updatedData = {
      first_name: "John",
      last_name: "Updated",
      email: "john.updated@example.com",
      phone_number: "0987654321",
      Study_Department: "Math",
      car_type: "Coupe",
      car_number: "5678",
      license_image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
    };

    const res = await chai.request(server).put(`/documents/${newDocument.student_id}`).send(updatedData);
    res.should.have.status(200);
    res.body.should.have.property("last_name").eql("Updated");
    console.log("Test passed: should update a document by student_id");
  });

  it("should export all documents to an Excel file", async () => {
    await Document.create({
      first_name: "Export",
      last_name: "Test",
      email: "export.test@example.com",
      student_id: "456789123",
      phone_number: "5678901234",
      Study_Department: "Exporting",
      car_type: "Truck",
      car_number: "1234",
      licenseImage: "license-456789123.png"
    });

    const res = await chai.request(server).get("/documents/excel");
    res.should.have.status(200);
    res.header["content-type"].should.include("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    console.log("Test passed: should export all documents to an Excel file");
  });
});
