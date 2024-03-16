const express = require("express");
const logger = require("./utils/logger");
const config = require("./utils/config");
const cors = require("cors");
const middleware = require("./utils/middleware");
const blogRouter = require("./controls/blog");
const userRouter = require("./controls/user");
const loginRouter = require("./controls/login");

const mongoose = require("mongoose");

logger.info("start to connect to MongoDB", config.MONGODB_URI);

// when/where to close the connection to mongodb?
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("connected to MongoDB successful!"))
  .catch((error) =>
    logger.error("error connecting to MongoDB: ", error.message)
  );

const app = express();
app.use(cors());
app.use(express.json());
// place the middleware below
// after expresson.jon() to ensure we obtain a valid blog.
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/login", loginRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
// don't match any path
app.use(middleware.unknownEndpoint);

// finally, add errorHandle middleware
app.use(middleware.errorHandler);

module.exports = app;
