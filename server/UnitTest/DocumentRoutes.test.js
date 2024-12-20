const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app"); // Import your main server
const Document = require("../models/Document"); // Import the Document model

const should = chai.should();
chai.use(chaiHttp);

describe("Document Routes", () => {
  // Clear the database before each test
  beforeEach(async function () {
    await Document.deleteMany({});
    console.log("Database cleared");
  });

  // Test for creating a new document
  it("should create a new document", async () => {
    const newDocument = {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      student_id: "123456789",
      phone_number: "1234567890",
      Study_Department: "Computer Science",
      car_type: "Sedan",
      car_number: "1223"
    };

    const res = await chai.request(server).post("/documents").send(newDocument);
    res.should.have.status(201);
    res.body.should.have.property("first_name").eql("John");
    res.body.should.have.property("last_name").eql("Doe");
    res.body.should.have.property("student_id").eql(123456789);
    console.log("Test passed: should create a new document");
  });

  // Test for missing fields when creating a document
  it("should not create a document with missing fields", async () => {
    const newDocument = {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@example.com",
      student_id: 987654321,
    };

    const res = await chai.request(server).post("/documents").send(newDocument);
    res.should.have.status(400);
    res.body.should.have.property("message").eql("Error creating document");
    console.log("Test passed: should not create a document with missing fields");
  });

  // Test for getting a document by student_id
  it("should get a document by student_id", async () => {
    const newDocument = await Document.create({
      first_name: "Alice",
      last_name: "Smith",
      email: "alice.smith@example.com",
      student_id: 112233445,
      phone_number: "9876543210",
      Study_Department: "Engineering",
      car_type: "SUV",
      car_number: 12234
    });

    const res = await chai.request(server).get(`/documents/${newDocument.student_id}`);
    res.should.have.status(200);
    console.log("Test passed: should get a document by student_id");
  });

  // Test for getting a document that doesn't exist
  it("should return 404 for a non-existing document", async () => {
    const res = await chai.request(server).get("/documents/999999999");
    res.should.have.status(404);
    res.body.should.have.property("message").eql("Document not found");
    console.log("Test passed: should return 404 for a non-existing document");
  });

  // Test for getting all documents
  it("should get all documents", async () => {
    const documents = [
      {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        student_id: 123456789,
        phone_number: "1234567890",
        Study_Department: "Computer Science",
        car_type: "Sedan",
        car_number: 123456
      },
      {
        first_name: "Alice",
        last_name: "Smith",
        email: "alice.smith@example.com",
        student_id: 987654321,
        phone_number: "9876543210",
        Study_Department: "Engineering",
        car_type: "SUV",
        car_number: 76543
      }
    ];

    await Document.insertMany(documents);

    const res = await chai.request(server).get("/documents");
    res.should.have.status(200);
    res.body.should.be.a("array");
    res.body.length.should.be.eql(2);
    console.log("Test passed: should get all documents");
  });
});
