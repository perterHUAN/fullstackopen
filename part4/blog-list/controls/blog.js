const blogRouter = require("express").Router();
const Blog = require("../models/blog");
// we don't need to write try-catch in middleware, it can help
// us handle error.
require("express-async-error");

// the path becomes shorter.
blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogRouter;
