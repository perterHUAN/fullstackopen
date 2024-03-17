import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  // user info retrieved from server
  const [user, setUser] = useState("");

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
      console.log("login error");
    }
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
            ></input>
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
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    );
  };
  return (
    <>
      {!user && loginForm()}
      {user && showBlogs()}
    </>
  );
};

export default App;
