const Blog = require("../models/blog");
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
  const result = await Blog.find({});
  // need to call toJSON method, because we don't request it through routing.
  return result.map((e) => e.toJSON());
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
module.exports = {
  initialBlogs,
  blogsInDB,
  nonExistingId,
  existingId,
};
