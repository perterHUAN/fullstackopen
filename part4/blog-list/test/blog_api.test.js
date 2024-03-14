const { describe, it, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");

const app = require("../app");
const mongoose = require("mongoose");
const supertest = require("supertest");

const api = supertest(app);

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

beforeEach(async () => {
  await Blog.deleteMany();

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
  console.log("initial database sucessfully");
});

describe("get /api/blogs", () => {
  it("blogs are returned as json", async () => {
    const response = await api.get("/api/blogs");

    assert.equal(
      /application\/json/.test(response.header["content-type"]),
      true
    );
  });

  it("there are six blogs", async () => {
    const response = await api.get("/api/blogs");
    assert.equal(response.body.length, 6);
  });
});

describe("id property", () => {
  it("the unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    assert.ok(response.body[0].hasOwnProperty("id"));
  });
});

after(async () => {
  await mongoose.connection.close();
  console.log("close connection sucessfully");
});
