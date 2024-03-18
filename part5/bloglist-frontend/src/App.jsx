import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";

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

  const handleLogin = async (event) => {
    event.preventDefault();
    // login in
    try {
      const user = await blogService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUserName("");
      setPassword("");
    } catch (exception) {
      // error handle
      setMessage("wrong username or password");
      setTimeout(() => setMessage(""), 5000);
    }
  };
  const login = async (loginInfo) => {
    const user = await blogService.login(loginInfo);
    window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
    setUser(user);
    blogService.setToken(user.token);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    blogService.setToken(null);
    setUser(null);
  };

  const showBlogs = () => {
    return (
      <div>
        <h2>blogs</h2>
        <button onClick={handleLogout}>LogOut</button>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    );
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
      {user !== null && showBlogs()}
      {user !== null && (
        <BlogForm createBlog={createBlog} setMessage={setMessage} />
      )}
    </>
  );
};

export default App;
