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

blogRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
});

module.exports = blogRouter;
