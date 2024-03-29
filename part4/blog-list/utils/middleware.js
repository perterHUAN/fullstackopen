const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error("error message: ", error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    // Mongoose validations do not detect the index violation,
    // and instead of ValidationError they return an error of
    // type MongoServerError
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  next(error);
};

const tokenExtractor = (request, reponse, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodeToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodeToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  request.user = await User.findById(decodeToken.id);
  next();
};
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
