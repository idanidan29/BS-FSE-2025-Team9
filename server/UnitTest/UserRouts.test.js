const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app"); // Import the main server
const User = require("../models/user"); // Import the User model

const should = chai.should();
chai.use(chaiHttp);

describe("User Routes", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    console.log("Database cleared");
  });

  it("should create a new user", async () => {
    const newUser = {
      username: "newuser",
      first_name: "New",
      last_name: "User",
      email: "newuser@example.com",
      password: "newpassword123",
      student_id: 987654321,
    };

    const res = await chai.request(server).post("/users").send(newUser);
    res.should.have.status(201);
    res.body.should.have.property("username").eql("newuser");
  });

  it("should not create a user with missing fields", async () => {
    const res = await chai.request(server).post("/users").send({ username: "testuser" });
    res.should.have.status(400);
    res.body.should.have.property("message").eql("All fields are required.");
  });

  it("should log in an existing user", async () => {
    await User.create({
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    });

    const res = await chai
      .request(server)
      .post("/users/login")
      .send({ username: "testuser", password: "password123" });

    res.should.have.status(200);
    res.body.should.have.property("username").eql("testuser");
  });

  it("should not log in with wrong credentials", async () => {
    await User.create({
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    });

    const res = await chai
      .request(server)
      .post("/users/login")
      .send({ username: "testuser", password: "wrongpassword" });

    res.should.have.status(401);
    res.body.should.have.property("message").eql("Invalid password");
  });

  it("should get all users", async () => {
    const users = [
      {
        username: "user1",
        first_name: "First",
        last_name: "User",
        email: "user1@example.com",
        password: "password1",
        student_id: 123456781,
      },
      {
        username: "user2",
        first_name: "Second",
        last_name: "User",
        email: "user2@example.com",
        password: "password2",
        student_id: 123456782,
      },
    ];

    await User.insertMany(users);

    const res = await chai.request(server).get("/users");
    res.should.have.status(200);
    res.body.should.be.a("array");
    res.body.length.should.be.eql(2);
  });

  it("should get a user by username", async () => {
    await User.create({
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    });

    const res = await chai.request(server).get("/users/testuser");
    res.should.have.status(200);
    res.body.should.have.property("username").eql("testuser");
  });

  it("should return 404 for a non-existing user", async () => {
    const res = await chai.request(server).get("/users/nonexistentuser");
    res.should.have.status(404);
    res.body.should.have.property("message").eql("User not found");
  });

  it("should delete all users", async () => {
    await User.insertMany([
      {
        username: "user1",
        first_name: "First",
        last_name: "User",
        email: "user1@example.com",
        password: "password1",
        student_id: 123456781,
      },
      {
        username: "user2",
        first_name: "Second",
        last_name: "User",
        email: "user2@example.com",
        password: "password2",
        student_id: 123456782,
      },
    ]);

    const res = await chai.request(server).delete("/users");
    res.should.have.status(200);
    res.body.should.have.property("message").eql("All users deleted successfully");
    res.body.should.have.property("deletedCount").eql(2);
  });
});
