const { describe, it, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test-helper");

const app = require("../app");
const mongoose = require("mongoose");
const supertest = require("supertest");

const api = supertest(app);

describe("POST /api/blogs", () => {
  beforeEach(async () => {
    // clear all blogs
    await Blog.deleteMany();
    // clear all users
    await User.deleteMany();
  });

  it("a valid note can be added", async () => {
    const blogsAtStart = await helper.blogsInDB();
    // first login and get token
    const token = await helper.getTestUserToken();
    // create a blog with userId
    const info = {
      title: "full stack open part 4",
      author: "peter",
      url: "https://fullstackopen.com/en/part4/testing_the_backend",
      likes: 2,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(info)
      .expect(201)
      .expect("content-type", /application\/json/);
    const savedBlog = response.body;
    assert.equal(savedBlog.title, info.title);
    assert.equal(savedBlog.author, info.author);
    assert.equal(savedBlog.url, info.url);
    assert.equal(savedBlog.likes, info.likes);
    assert.ok(savedBlog.hasOwnProperty("id"));

    // check wheter user's blogs info changed
    const user = await helper.getUserById(savedBlog.user);
    assert.ok(user);
    assert.ok(user.blogs.some((e) => e.toJSON() === savedBlog.id));
    // length + 1
    const blogsAtEnd = await helper.blogsInDB();
    assert.equal(blogsAtEnd.length, blogsAtStart.length + 1);
  });

  it(" if the likes property is missing from the request, it will default to the value 0.", async () => {
    const token = await helper.getTestUserToken();
    const info = {
      title: "full stack open part 4",
      author: "peter",
      url: "https://fullstackopen.com/en/part4/testing_the_backend",
    };
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(info)
      .expect(201)
      .expect("content-type", /application\/json/);
    assert.equal(response.body.likes, 0);
  });

  it("valid request data, missing title or url propterty", async () => {
    const token = await helper.getTestUserToken();
    const validInfo = {
      author: "peter",
      url: "https://fullstackopen.com/en/part4/testing_the_backend",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(validInfo)
      .expect(400);
  });
});

after(async () => {
  await mongoose.connection.close();
});
