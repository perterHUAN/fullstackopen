import Blog from "./Blog";
function Blogs({ blogs, addLikes }) {
  return (
    <div>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} addLikes={addLikes} />
      ))}
    </div>
  );
}

export default Blogs;
