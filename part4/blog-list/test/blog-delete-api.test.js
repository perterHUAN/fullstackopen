const { describe, it, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test-helper");

const app = require("../app");
const mongoose = require("mongoose");
const supertest = require("supertest");

const api = supertest(app);
describe("delete /api/blogs/:id", () => {
  beforeEach(async () => {
    await Blog.deleteMany();
    await User.deleteMany();
  });
  it("a valid token", async () => {
    // create a user
    const username = "delete-user",
      password = "12345",
      name = "delete-user";
    const testUser = await helper.createTestUser({
      username,
      password,
      name,
      blogs: [],
    });
    // console.log("creat user: ", testUser.id);
    // login in, get token
    const loginResponse = await api
      .post("/api/login")
      .send({ username, password, name });
    const { token } = loginResponse.body;
    // console.log("login: ", token);
    // post a blog

    const createResponse = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "full stack open par4",
        url: "https://fullstackopen.com",
        author: "peter",
        likes: 10,
      })
      .expect(201);
    const { id: blogId } = createResponse.body;
    // console.log("createResponse: ", createResponse.body);
    // console.log("create a blog", blogId);
    // delete blog with token
    const blogsBeforeDelete = await helper.blogsInDB();
    // console.log("blogsBeforeDelete: ", blogsBeforeDelete);

    await api
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    // check status, the number of blogs

    const blogsAfterDelete = await helper.blogsInDB();
    assert.equal(blogsBeforeDelete.length, blogsAfterDelete.length + 1);
  });

  it("a invalid token", async () => {
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer xxxxxxxxxx`)
      .send({
        title: "full stack open par4",
        url: "https://fullstackopen.com",
        author: "peter",
        likes: 10,
      })
      .expect(400);
    assert.ok(response.body.error.includes("token missing or invalid"));
  });
});
after(async () => {
  await mongoose.connection.close();
});
