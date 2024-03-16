const blogRouter = require("express").Router();
const User = require("../models/user");
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
  const body = request.body;

  // If userId don't exist, what happen ?
  const user = await User.findById(body.userId);
  if (!user) {
    // 404 Not Found
    return response.status(404).send({ error: "User Not Found" });
  }

  const newBlog = new Blog({
    user: user.id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  const result = await newBlog.save();

  user.blogs = user.blogs.concat(result.id);
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
