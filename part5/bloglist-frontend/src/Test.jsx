import BlogForm from "./components/BlogFrom";

function App() {
  const createBlog = (blog) => {
    console.log("create Blog", blog);
  };
  return <BlogForm createBlog={createBlog} />;
}

export default App;
