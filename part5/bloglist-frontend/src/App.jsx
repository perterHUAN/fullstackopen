import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Blogs from "./components/Blogs";

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

  const showMessage = () => {
    return <p className="message">{message}</p>;
  };
  const createBlog = async (blog) => {
    const newBlog = await blogService.create(blog);
    setBlogs(blogs.concat(newBlog));
  };
  return (
    <>
      {message !== "" && showMessage()}
      {user === null && <LoginForm setMessage={setMessage} login={login} />}
      {user !== null && <Blogs blogs={blogs} logout={logout} />}
      {user !== null && (
        <BlogForm createBlog={createBlog} setMessage={setMessage} />
      )}
    </>
  );
};

export default App;
