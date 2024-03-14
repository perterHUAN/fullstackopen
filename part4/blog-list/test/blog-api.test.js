const { describe, it, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const helper = require("./test-helper");

const app = require("../app");
const mongoose = require("mongoose");
const supertest = require("supertest");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany();

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("get /api/blogs", () => {
  it("blogs are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
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
      .expect(200)
      .expect("content-type", /application\/json/);
    assert.equal(response.body.length, 6);
  });
});

describe("id property", () => {
  it("the unique identifier property of the blog posts is named id", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("content-type", /application\/json/);
    assert.ok(response.body[0].hasOwnProperty("id"));
  });
});

describe("POST /api/blogs", () => {
  it("a valid note can be added", async () => {
    const info = {
      title: "full stack open part 4",
      author: "peter",
      url: "https://fullstackopen.com/en/part4/testing_the_backend",
      likes: 2,
    };

    const response = await api
      .post("/api/blogs")
      .send(info)
      .expect(201)
      .expect("content-type", /application\/json/);
    const newBlog = response.body;
    assert.equal(newBlog.title, info.title);
    assert.equal(newBlog.author, info.author);
    assert.equal(newBlog.url, info.url);
    assert.equal(newBlog.likes, info.likes);
    assert.ok(newBlog.hasOwnProperty("id"));

    // length + 1
    const blogsAtEnd = await helper.blogsInDB();
    assert.equal(blogsAtEnd.length, helper.initialBlogs.length + 1);
  });

  it(" if the likes property is missing from the request, it will default to the value 0.", async () => {
    const info = {
      title: "full stack open part 4",
      author: "peter",
      url: "https://fullstackopen.com/en/part4/testing_the_backend",
    };
    const response = await api
      .post("/api/blogs")
      .send(info)
      .expect(201)
      .expect("content-type", /application\/json/);
    assert.equal(response.body.likes, 0);
  });
});
after(async () => {
  await mongoose.connection.close();
  // console.log("close connection sucessfully");
});
