const { describe, it, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const User = require("../models/user");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

describe("POST /api/login", () => {
  beforeEach(async () => {
    await User.deleteMany();
  });
  it("valid username and password, return a token", async () => {
    const username = "test-login-user",
      password = "123455",
      name = username;
    // create a user
    await api
      .post("/api/users")
      .send({
        username,
        password,
        name,
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    // login in

    const response = await api
      .post("/api/login")
      .send({
        username,
        password,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert.ok(response.body.token);
  });

  it("incorrect password", async () => {
    const username = "test-login-user",
      password = "123455",
      name = username;
    // create a user
    await api
      .post("/api/users")
      .send({
        username,
        password,
        name,
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    // login in

    const response = await api
      .post("/api/login")
      .send({
        username,
        password: "2423423",
      })
      .expect(401)
      .expect("Content-Type", /application\/json/);
    assert.ok(response.body.error.includes("invalid username or password"));
    assert.ok(!response.body.token);
  });
  it("invalid user", async () => {
    const response = await api
      .post("/api/login")
      .send({
        username: "non-existing-user",
        password: "2423423",
      })
      .expect(401)
      .expect("Content-Type", /application\/json/);
    assert.ok(response.body.error.includes("invalid username or password"));
    assert.ok(!response.body.token);
  });

  after(async () => {
    mongoose.connection.close();
  });
});
