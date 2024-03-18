import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import BlogForm from "./components/BlogFrom";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  // user info retrieved from server
  const [user, setUser] = useState(null);
  const [blog, setBlog] = useState({ title: "", author: "", url: "" });
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
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    blogService.setToken(null);
    setUser(null);
  };
  const loginForm = () => {
    return (
      <>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username:</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUserName(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">password:</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button>login</button>
        </form>
      </>
    );
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
      {user === null && loginForm()}
      {user !== null && showBlogs()}
      {user !== null && (
        <BlogForm createBlog={createBlog} setMessage={setMessage} />
      )}
    </>
  );
};

export default App;
