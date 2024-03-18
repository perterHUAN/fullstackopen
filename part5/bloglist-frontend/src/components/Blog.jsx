import { useState } from "react";
const Blog = ({ blog }) => {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div>
      <h3>
        {blog.title}{" "}
        <button onClick={() => setShowDetail(!showDetail)}>
          {showDetail ? "hide" : "show"}
        </button>
      </h3>
      {showDetail && (
        <>
          <p>{blog.author}</p>
          <p>{blog.url}</p>
          <p>lieks: {blog.likes}</p>
        </>
      )}
    </div>
  );
};

export default Blog;
