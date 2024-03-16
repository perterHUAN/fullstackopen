const { describe, it, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test-helper");

const app = require("../app");
const mongoose = require("mongoose");
const supertest = require("supertest");

const api = supertest(app);

beforeEach(async () => {
  // clear all blogs
  await Blog.deleteMany();
  // clear all users
  await User.deleteMany();

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
    // first create a user
    const userId = await helper.getOneUserId();
    // create a blog with userId
    const info = {
      title: "full stack open part 4",
      author: "peter",
      url: "https://fullstackopen.com/en/part4/testing_the_backend",
      likes: 2,
      userId,
    };

    const response = await api
      .post("/api/blogs")
      .send(info)
      .expect(201)
      .expect("content-type", /application\/json/);
    const savedBlog = response.body;
    assert.equal(savedBlog.title, info.title);
    assert.equal(savedBlog.author, info.author);
    assert.equal(savedBlog.url, info.url);
    assert.equal(savedBlog.likes, info.likes);
    assert.equal(savedBlog.user, userId);
    assert.ok(savedBlog.hasOwnProperty("id"));

    // check wheter user's blogs info changed
    const user = await helper.getOneUser(savedBlog.user);
    assert.ok(user);
    assert.ok(user.blogs.some((e) => e.toJSON() === savedBlog.id));
    // length + 1
    const blogsAtEnd = await helper.blogsInDB();
    assert.equal(blogsAtEnd.length, helper.initialBlogs.length + 1);
  });

  it(" if the likes property is missing from the request, it will default to the value 0.", async () => {
    const userId = await helper.getOneUserId();
    const info = {
      title: "full stack open part 4",
      author: "peter",
      url: "https://fullstackopen.com/en/part4/testing_the_backend",
      userId,
    };
    const response = await api
      .post("/api/blogs")
      .send(info)
      .expect(201)
      .expect("content-type", /application\/json/);
    assert.equal(response.body.likes, 0);
  });

  it("valid request data, missing title or url propterty", async () => {
    const userId = await helper.getOneUserId();
    const validInfo = {
      author: "peter",
      url: "https://fullstackopen.com/en/part4/testing_the_backend",
      userId,
    };

    await api.post("/api/blogs").send(validInfo).expect(400);
  });
});

describe("GET /api/blogs/:id", () => {
  it("return the blog with the same request id", async () => {
    const userId = await helper.getOneUserId();

    const info = {
      title: "full stack open part 4",
      author: "peter",
      url: "https://fullstackopen.com/en/part4/testing_the_backend",
      userId,
    };
    const response1 = await api.post("/api/blogs").send(info);

    const response2 = await api.get(`/api/blogs/${response1.body.id}`);

    for (const e in info) {
      if (info.hasOwnProperty(e) && e !== "userId") {
        assert.equal(info[e], response2.body[e]);
      }
    }
    assert.equal(response2.body.user, userId);
  });

  it("request no existed id", async () => {
    const id = await helper.nonExistingId();
    // 404 Not Found
    await api.get(`/api/blogs/${id}`).expect(404);
  });

  it("request invalid id", async () => {
    const id = "sgisn4234823094";
    // next(error)  castError 400
    await api.get(`/api/blogs/${id}`).expect(400);
  });
});

describe("delete /api/blogs/:id", () => {
  it("an existing id", async () => {
    const id = await helper.existingId();
    const blogsBeforeDelete = await helper.blogsInDB();
    await api.delete(`/api/blogs/${id}`);
    const blogsAfterDelete = await helper.blogsInDB();

    assert.equal(blogsBeforeDelete.length, blogsAfterDelete.length + 1);
  });

  it("a none existing id", async () => {
    const id = await helper.nonExistingId();
    // Not Found
    await api.delete(`/api/blogs/${id}`).expect(404);
  });

  it("an invalid id", async () => {
    const id = "sing424235fsfs";
    // bad request
    await api.delete(`/api/blogs/${id}`).expect(400);
  });
});

describe("PUT /api/blogs/:id", () => {
  it("an existing id", async () => {
    const id = await helper.existingId();

    const response1 = await api.get(`/api/blogs/${id}`);
    const blogBeforeUpdate = response1.body;

    const response2 = await api.put(`/api/blogs/${id}`).send({
      title: blogBeforeUpdate.title,
      author: blogBeforeUpdate.author,
      url: blogBeforeUpdate.url,
      likes: blogBeforeUpdate.likes + 1,
    });
    const blogAfterUpdate = response2.body;

    assert.equal(blogBeforeUpdate.likes + 1, blogAfterUpdate.likes);
  });

  it("a none existing id", async () => {
    const id = await helper.nonExistingId();

    await api
      .put(`/api/blogs/${id}`)
      .send({
        title: "full stack open part 4",
        author: "peter",
        url: "https://fullstackopen.com/en/part4/testing_the_backend",
        likes: 1,
      })
      .expect(404);
  });

  it("an invalid id", async () => {
    const id = "sign4234234";
    await api
      .put(`/api/blogs/${id}`)
      .send({
        title: "full stack open part 4",
        author: "peter",
        url: "https://fullstackopen.com/en/part4/testing_the_backend",
        likes: 1,
      })
      .expect(400);
  });
});
after(async () => {
  await mongoose.connection.close();
  // console.log("close connection sucessfully");
});
