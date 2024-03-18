import Blog from "./Blog";
function Blogs({ blogs, addLikes, removeBlog }) {
  return (
    <div>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          addLikes={addLikes}
          removeBlog={removeBlog}
        />
      ))}
    </div>
  );
}

export default Blogs;
