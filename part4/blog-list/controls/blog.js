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
  const body = request.body;
  // console.log("post a blog: ", body);

  const user = request.user;
  // console.log("find user", user);

  const newBlog = new Blog({
    user: user._id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  await newBlog.save();
  user.blogs = user.blogs.concat(newBlog._id);
  await user.save();
  response.status(201).json(newBlog);
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
  // console.log("delete blog", decodeToken.id);
  const user = request.user;
  const blogId = request.params.id;
  const userId = user.id;
  // if one people uses own token to delete other people's blog, what's happen?
  // const blog = await Blog.findByIdAndDelete(blogId);
  const blog = await Blog.findById(blogId);

  if (blog) {
    if (blog.user.toString() !== userId) {
      return response
        .status(400)
        .send({ error: "This bog does not belong to you" });
    }
    await Blog.deleteOne({ _id: blog._id });
    console.log("delete");
    user.blogs = user.blogs.filter((blog) => blog.id !== blogId);
    await user.save();
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
