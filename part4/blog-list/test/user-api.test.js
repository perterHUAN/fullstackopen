const { describe, it, beforeEach, after } = require("node:test");
const assert = require("assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("./test-helper");
const api = supertest(app);

describe("POST /api/users", () => {
  beforeEach(async () => {
    // clear out database before each test
    await User.deleteMany();

    const rootUser = {
      username: "root",
      password: "124324",
      name: "peter",
    };
    // add root user
    await api.post("/api/users").send(rootUser);
  });
  it("create a new user", async () => {
    const usersAtStart = await helper.usersInDB();
    const newUser = {
      name: "peter",
      password: "123445",
      username: "peter",
    };
    const response = await api.post("/api/users").send(newUser);
    //   .expect(201)
    //   .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();

    assert.equal(usersAtEnd.length, usersAtStart.length + 1);
    const usernames = usersAtEnd.map((user) => user.username);
    assert.ok(usernames.includes(newUser.username));
  });

  it("both username and password are required", async () => {
    // missing username
    let usersAtStart = await helper.usersInDB();
    let newUser = {
      name: "peter",
      password: "123445",
    };
    let response = await api.post("/api/users").send(newUser).expect(400);
    let usersAtEnd = await helper.usersInDB();
    // don't add new user
    assert.equal(usersAtStart.length, usersAtEnd.length);
    assert.ok(
      response.body.error.includes("both username and password are required")
    );

    // missing password
    usersAtStart = await helper.usersInDB();
    newUser = {
      name: "peter",
      username: "peter",
    };
    response = await api.post("/api/users").send(newUser).expect(400);
    usersAtEnd = await helper.usersInDB();
    // don't add new user
    assert.equal(usersAtStart.length, usersAtEnd.length);
    assert.ok(
      response.body.error.includes("both username and password are required")
    );
  });
  it("both username and password must be at least 3 characters", async () => {
    // username is invalid
    let usersAtStart = await helper.usersInDB();
    let newUser = {
      name: "peter",
      password: "123445",
      username: "p",
    };

    let response = await api.post("/api/users").send(newUser).expect(400);
    let usersAtEnd = await helper.usersInDB();
    // don't add new user
    assert.equal(usersAtStart.length, usersAtEnd.length);
    console.log("username response: ", response.body);
    assert.ok(
      response.body.error.includes("username must be at least 3 characters")
    );

    //  password is invalid
    usersAtStart = await helper.usersInDB();
    newUser = {
      name: "peter",
      password: "1",
      username: "peter",
    };

    response = await api.post("/api/users").send(newUser).expect(400);
    usersAtEnd = await helper.usersInDB();
    // don't add new user
    assert.equal(usersAtStart.length, usersAtEnd.length);
    console.log(response.body.error);
    assert.ok(
      response.body.error.includes("password must be at least 3 characters")
    );
  });
  it("username is unique", async () => {
    const usersAtStart = await helper.usersInDB();
    const newUser = {
      name: "peter",
      username: "root",
      password: "2342342",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);
    const usersAtEnd = await helper.usersInDB();

    assert.ok(response.body.error.includes("expected `username` to be unique"));
    assert.equal(usersAtStart.length, usersAtEnd.length);
  });
  after(async () => {
    mongoose.connection.close();
  });
});
