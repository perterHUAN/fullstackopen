const blogRouter = require("express").Router();
const Blog = require("../models/blog");
// we don't need to write try-catch in middleware, it can help
// us handle error.
require("express-async-errors");

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
