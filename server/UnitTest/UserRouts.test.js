const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app"); // Import the main server
const User = require("../models/user"); // Import the User model

const should = chai.should();
chai.use(chaiHttp);

describe("User Routes", () => {

  it("should not create a user with missing fields", async () => {
    const res = await chai.request(server).post("/users").send({ username: "testuser" });
    res.should.have.status(400);
    res.body.should.have.property("message").eql("All fields are required.");
  });

  it("should log in an existing user", async () => {
    const newUser = {
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    };

    // Create the user for login
    await User.create(newUser);

    const res = await chai
      .request(server)
      .post("/users/login")
      .send({ username: "testuser", password: "password123" });

    res.should.have.status(200);
    res.body.should.have.property("username").eql("testuser");
  });

  it("should not log in with wrong credentials", async () => {
    const newUser = {
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    };

    // Create the user for login
    await User.create(newUser);

    const res = await chai
      .request(server)
      .post("/users/login")
      .send({ username: "testuser", password: "wrongpassword" });

    res.should.have.status(401);
    res.body.should.have.property("message").eql("Invalid password");
  });



  it("should get a user by username", async () => {
    const newUser = {
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
      student_id: 123456789,
    };

    // Create the user for this specific test
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

});
