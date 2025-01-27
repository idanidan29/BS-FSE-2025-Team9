const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const server = require("../app"); // Import the main server
const User = require("../models/user"); // Import the User model

const should = chai.should();
chai.use(chaiHttp);

describe("User Routes", () => {
  before(async () => {
    MONGO_URI='mongodb+srv://system:NzEo6pKiK9Kq9d9O@filesystem.5cw90.mongodb.net/File_System';
    const uri = MONGO_URI; // Update if using a different test database URI
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.disconnect();
  });

  /*** Tests for User Creation ***/
  it("should not create a user with missing fields", async () => {
    const res = await chai.request(server).post("/users").send({ username: "testuser" });
    res.should.have.status(400);
    res.body.should.have.property("message").eql("All fields are required.");
  });

  it("should not create a user with an already existing username", async () => {
    const user = {
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    };

    await User.create(user); // Create user manually
    const res = await chai.request(server).post("/users").send(user);
    res.should.have.status(400);
    res.body.should.have.property("message").eql("Username already exists.");
  });

  it("should create a user with valid data", async () => {
    const newUser = {
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    };

    const res = await chai.request(server).post("/users").send(newUser);
    res.should.have.status(201);
    res.body.should.have.property("username").eql(newUser.username);
    res.body.should.have.property("first_name").eql(newUser.first_name);
    res.body.should.have.property("email").eql(newUser.email);
  });

  /*** Tests for Login ***/
  it("should log in an existing user with correct credentials", async () => {
    const newUser = {
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    };

    await User.create(newUser);

    const res = await chai
      .request(server)
      .post("/users/login")
      .send({ username: "testuser", password: "password123" });
    res.should.have.status(200);
    res.body.should.have.property("username").eql("testuser");
  });

  it("should not log in with incorrect credentials", async () => {
    const newUser = {
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    };

    await User.create(newUser);

    const res = await chai
      .request(server)
      .post("/users/login")
      .send({ username: "testuser", password: "wrongpassword" });
    res.should.have.status(401);
    res.body.should.have.property("message").eql("Invalid password");
  });

  it("should return 404 if trying to log in a non-existing user", async () => {
    const res = await chai
      .request(server)
      .post("/users/login")
      .send({ username: "nonexistentuser", password: "password123" });
    res.should.have.status(404);
    res.body.should.have.property("message").eql("User not found");
  });

  /*** Tests for Retrieving Users ***/
  it("should get a user by username", async () => {
    const newUser = {
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    };

    await User.create(newUser);

    const res = await chai.request(server).get("/users/testuser");
    res.should.have.status(200);
    res.body.should.have.property("username").eql("testuser");
  });

  it("should return 404 for a non-existing user", async () => {
    const res = await chai.request(server).get("/users/nonexistentuser");
    res.should.have.status(404);
    res.body.should.have.property("message").eql("User not found");
  });

  it("should get all users", async () => {
    const users = [
      {
        username: "testuser1",
        first_name: "Test1",
        last_name: "User1",
        email: "test1@example.com",
        password: "password123",
        student_id: 123456789,
      },
      {
        username: "testuser2",
        first_name: "Test2",
        last_name: "User2",
        email: "test2@example.com",
        password: "password456",
        student_id: 987654321,
      },
    ];

    await User.insertMany(users);

    const res = await chai.request(server).get("/users");
    res.should.have.status(200);
    res.body.should.be.a("array");
    res.body.length.should.eql(2);
  });

  /*** Tests for Updating Users ***/
  it("should update a user by username", async () => {
    const newUser = {
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    };

    await User.create(newUser);

    const updatedData = { first_name: "UpdatedTest", email: "updated@example.com" };

    const res = await chai.request(server).put("/users/testuser").send(updatedData);
    res.should.have.status(200);
    res.body.should.have.property("first_name").eql("UpdatedTest");
    res.body.should.have.property("email").eql("updated@example.com");
  });

  it("should return 404 when updating a non-existing user", async () => {
    const res = await chai
      .request(server)
      .put("/users/nonexistentuser")
      .send({ first_name: "NewName" });
    res.should.have.status(404);
    res.body.should.have.property("message").eql("User not found");
  });

  /*** Tests for Deleting Users ***/
  it("should delete a user by student_id", async () => {
    const newUser = {
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    };

    await User.create(newUser);

    const res = await chai.request(server).delete(`/users/${newUser.student_id}`);
    res.should.have.status(200);
    res.body.should.have.property("message").eql("User deleted successfully");
  });

  it("should return 404 when deleting a non-existing user", async () => {
    const res = await chai.request(server).delete("/users/000000000");
    res.should.have.status(404);
    res.body.should.have.property("message").eql("User not found");
  });

  it("should delete all users", async () => {
    const users = [
      {
        username: "testuser1",
        first_name: "Test1",
        last_name: "User1",
        email: "test1@example.com",
        password: "password123",
        student_id: 123456789,
      },
      {
        username: "testuser2",
        first_name: "Test2",
        last_name: "User2",
        email: "test2@example.com",
        password: "password456",
        student_id: 987654321,
      },
    ];

    await User.insertMany(users);

    const res = await chai.request(server).delete("/users");
    res.should.have.status(200);
    res.body.should.have.property("message").eql("All users deleted successfully");
    res.body.should.have.property("deletedCount").eql(2);
  });
});
