import { useState } from "react";
const BlogForm = ({ createBlog, setMessage }) => {
  const [blog, setBlog] = useState({
    author: "",
    url: "",
    title: "",
  });
  const handleChangeBlog = (event) => {
    const { name, value } = event.target;
    if (blog.hasOwnProperty(name)) {
      setBlog({ ...blog, [name]: value });
    }
  };
  const handleSubmitBlog = async (event) => {
    event.preventDefault();
    try {
      await createBlog(blog);
      setBlog({
        author: "",
        title: "",
        url: "",
      });
      setMessage(`a new blog ${title} by ${author} added`);
      setTimeout(() => setMessage(""), 5000);
    } catch (expection) {
      setMessage("Create Blog Fail");
      setTimeout(() => setMessage(""), 5000);
    }
  };
  return (
    <>
      <h2>Create New</h2>
      <form onSubmit={handleSubmitBlog} onChange={handleChangeBlog}>
        <div>
          <label htmlFor="title">title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={blog.title}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input
            id="author"
            name="author"
            type="text"
            value={blog.author}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input id="url" name="url" type="text" value={blog.url}></input>
        </div>
        <button>create</button>
      </form>
    </>
  );
};

export default BlogForm;
