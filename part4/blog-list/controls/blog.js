const blogRouter = require("express").Router();
const middleware = require("../utils/middleware");
const Blog = require("../models/blog");
const user = require("../models/user");
// we don't need to write try-catch in middleware, it can help
// us handle error.
require("express-async-errors");

// the path becomes shorter.
blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  // console.log("post a blog: ", body);

  const user = request.user;
  // console.log("find user", user);
  if (!user) {
    return response.status(403).json({ error: "user missing" });
  }

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
blogRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
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
          .status(403)
          .send({ error: "This bog does not belong to you" });
      }
      await Blog.deleteOne({ _id: blog._id });
      console.log("delete");
      user.blogs = user.blogs.filter((blog) => blog.id !== blogId);
      await user.save();
      response.status(204).end();
    } else {
      response.status(404).end();
    }
  }
);

blogRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  const updateBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
  }).populate("user", { username: 1, name: 1 });
  if (updateBlog) {
    response.send(updateBlog);
  } else {
    response.status(404).end();
  }
});
module.exports = blogRouter;
