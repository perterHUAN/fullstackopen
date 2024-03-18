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

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
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
      {isShowBlogs && <Blogs blogs={blogs} />}
      {isShowBlogForm && (
        <Togglable buttonLabel={"create a blog"}>
          <BlogForm createBlog={createBlog} setMessage={setMessage} />
        </Togglable>
      )}
    </>
  );
};

export default App;
