const blogRouter = require("express").Router();
const assert = require("node:assert");
const User = require("../models/user");
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
// we don't need to write try-catch in middleware, it can help
// us handle error.
require("express-async-errors");

// the path becomes shorter.
blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

function getToken(request) {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
}

blogRouter.post("/", async (request, response) => {
  const body = request.body;

  // may throw error
  const decodeToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodeToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodeToken.id);

  const newBlog = new Blog({
    user: user._id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  const result = await newBlog.save();
  // same
  assert.equal(result, newBlog);
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});
blogRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id);
  if (blog) {
    response.status(200).end();
  } else {
    response.status(404).end();
  }
});

blogRouter.put("/:id", async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });
  if (blog) {
    response.send(blog);
  } else {
    response.status(404).end();
  }
});
module.exports = blogRouter;
