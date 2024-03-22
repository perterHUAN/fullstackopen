import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Blogs from "./components/Blogs";
import Notification from "./components/Notification";
import Togglable from "./components/Toggleable";
import Logout from "./components/Logout";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  // user info retrieved from server
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  console.log(blogs);
  const removeBlog = async (blog) => {
    try {
      const data = await blogService.deleteBlog(blog);
      setBlogs(blogs.filter((e) => e.id !== blog.id));
      console.log("data: ", data);
      setMessage(`Delete ${blog.title} by ${blog.author}`);
    } catch (expection) {
      console.log("expection: ", expection);
      setMessage(expection.response.data.error || "Delete Blog Fail");
    }
    setTimeout(() => setMessage(""), 3000);
  };
  const addLikes = async (blog) => {
    try {
      // create new blog
      const newBlog = { ...blog, likes: blog.likes + 1 };
      console.log("put to server: ", newBlog);
      // put to server
      const savedBlog = await blogService.update(newBlog);
      // change local blog
      setBlogs(
        blogs
          .filter((blog) => blog.id !== savedBlog.id)
          .concat(savedBlog)
          .sort((a, b) => a.likes - b.likes)
      );
      setMessage("Update Blog Successful");
    } catch (expection) {
      setMessage("Update Blog Fail");
    }
    setTimeout(() => setMessage(""), 3000);
  };
  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => a.likes - b.likes)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const login = async (loginInfo) => {
    const user = await blogService.login(loginInfo);
    window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
    setUser(user);
    blogService.setToken(user.token);
  };

  const logout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    blogService.setToken(null);
    setUser(null);
  };

  const createBlog = async (blog) => {
    const newBlog = await blogService.create(blog);
    setBlogs(blogs.concat(newBlog));
  };

  const isShowMessage = message !== "";
  const isShowLoginForm = user === null;
  const isShowLogout = user !== null;
  const isShowBlogs = user !== null;
  const isShowBlogForm = user !== null;

  return (
    <>
      {isShowMessage && <Notification message={message} />}
      {isShowLogout && <Logout logout={logout} username={user.username} />}
      {isShowLoginForm && <LoginForm setMessage={setMessage} login={login} />}
      {isShowBlogs && (
        <Blogs blogs={blogs} addLikes={addLikes} removeBlog={removeBlog} />
      )}
      {isShowBlogForm && (
        <Togglable buttonLabel={"create a blog"}>
          <BlogForm createBlog={createBlog} setMessage={setMessage} />
        </Togglable>
      )}
    </>
  );
};

export default App;
