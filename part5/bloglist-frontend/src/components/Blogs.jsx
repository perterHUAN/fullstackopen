import Blog from "./Blog";
function Blogs({ blogs, logout }) {
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
