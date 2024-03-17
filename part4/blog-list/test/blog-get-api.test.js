const { describe, it, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test-helper");

const app = require("../app");
const mongoose = require("mongoose");
const supertest = require("supertest");

const api = supertest(app);

describe("get /api/blogs", () => {
  let token;
  const user = {
    name: "test-get-user",
    username: "test-get-user",
    password: "12345",
  };
  const blogs = helper.initialBlogs;
  beforeEach(async () => {
    // create a user
    await api.post("/api/users").send(user).expect(200);
    console.log("create user");
    // login in
    const response = await api.post("/api/login").send({
      username: user.username,
      password: user.password,
    });
    token = response.body.token;
    console.log("login in, token:", token);
    // create a series blogs
    const createBlogsPromises = blogs.map(async (blog) => {
      await aip
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(blog)
        .expect(201);
    });

    await Promise.all(createBlogsPromises);
    console.log("create blog");
  });
  it("blogs are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("content-type", /application\/json/);
    assert.equal(
      /application\/json/.test(response.header["content-type"]),
      true
    );
  });

  it("there are six blogs", async () => {
    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("content-type", /application\/json/);
    assert.equal(response.body.length, 6);
  });
});

after(async () => {
  mongoose.connection.close();
});
