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
  });
  it("create a new user", async () => {
    const usersAtStart = await helper.usersInDB();
    const newUser = {
      name: "peter",
      password: "123445",
      username: "peter",
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();

    assert.equal(usersAtEnd.length, usersAtStart.length + 1);
    const usernames = usersAtEnd.map((user) => user.username);
    assert.ok(usernames.includes(newUser.username));
  });
  after(async () => {
    mongoose.connection.close();
  });   
});
