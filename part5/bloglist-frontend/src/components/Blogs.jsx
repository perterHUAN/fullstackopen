import Blog from "./Blog";
function Blogs({ blogs, logout }) {
  console.log("blogs: ", blogs, "logout: ", logout);
  return (
    <div>
      <h2>blogs</h2>
      <button onClick={logout}>LogOut</button>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

export default Blogs;
