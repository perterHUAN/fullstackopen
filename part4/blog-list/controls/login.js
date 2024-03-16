/*
    based-token authentication
*/
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginRouter = require("express").Router();

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  // check username and password
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    // 401 unauthorized
    return response.status(401).json({ error: "invalid username or password" });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };
  // token expires in 60 * 60 seconds, that is, in one hour
  // if expired, throw TokenExpiredError
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  // should use HTTP2, because it's more secure.
  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
