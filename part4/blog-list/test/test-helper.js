const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  // need to call toJSON method, because we don't request it through routing.
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog({
    title: "full stack open part 4",
    author: "peter",
    url: "https://fullstackopen.com/en/part4/testing_the_backend",
    likes: 1,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const existingId = async () => {
  const blog = new Blog({
    title: "full stack open part 4",
    author: "peter",
    url: "https://fullstackopen.com/en/part4/testing_the_backend",
    likes: 1,
  });

  const res = await blog.save();
  return res._id.toString();
};

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const createTestUser = async (props) => {
  const { name, username, password } = props;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const testUser = new User({
    name,
    username,
    passwordHash,
    blogs: [],
  });
  await testUser.save();
  return testUser;
};
const getTestUserId = async () => {
  const testUser = await createTestUser({
    name: "test-user",
    password: "13423",
    username: "test-user",
  });
  return testUser.id;
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const getTestUserToken = async () => {
  // create a user
  await createTestUser({
    name: "test-user",
    password: "12423",
    username: "test-user",
  });

  // get token
  const response = await api.post("/api/login").send({
    username: "test-user",
    password: "12423",
  });
  return response.body.token;
};
module.exports = {
  initialBlogs,
  blogsInDB,
  nonExistingId,
  existingId,
  usersInDB,
  getUserById,
  getTestUserId,
  getTestUserToken,
};
