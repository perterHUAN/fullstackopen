import { useState } from "react";
const Blog = ({ blog, addLikes, removeBlog }) => {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div>
      <h3>
        {blog.title} {blog.author}
        <button onClick={() => setShowDetail(!showDetail)}>
          {showDetail ? "hide" : "show"}
        </button>
      </h3>
      {showDetail && (
        <>
          <p>{blog.url}</p>
          <p>
            likes: {blog.likes}{" "}
            <button onClick={() => addLikes(blog)}>likes</button>
          </p>
          <button onClick={() => removeBlog(blog)}>remove</button>
        </>
      )}
    </div>
  );
};

export default Blog;
