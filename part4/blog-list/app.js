const express = require("express");
const logger = require("./utils/logger");
const config = require("./utils/config");
const cors = require("cors");
const blogRouter = require("./controls/blog");

const mongoose = require("mongoose");

logger.info("start to connect to MongoDB", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("connected to MongoDB!"))
  .catch((error) =>
    logger.error("error connecting to MongoDB: ", error.message)
  );

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);

module.exports = app;
