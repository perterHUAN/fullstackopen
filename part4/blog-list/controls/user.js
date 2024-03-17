const User = require("../models/user");
const userRouter = require("express").Router();
require("express-async-errors");
const bcrypt = require("bcrypt");

// POST /api/users create a new user
userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  console.log(username, name, password);
  if (!username || !password) {
    return response
      .status(400)
      .send({ error: "both username and password are required." });
  }

  if (typeof password !== "string" || password.length < 3) {
    return response
      .status(400)
      .send({ error: "password must be at least 3 characters." });
  }

  // Erypt password rather than store plain password
  // in database as it's insecure.
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    username,
    name,
    passwordHash,
    blogs: [],
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

// GET /api/users get all users' info
userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    author: 1,
  });

  response.status(200).json(users);
});

module.exports = userRouter;
