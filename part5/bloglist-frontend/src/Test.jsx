import BlogForm from "./components/BlogForm";

function App() {
  const createBlog = (blog) => {
    console.log("create Blog", blog);
  };
  return <BlogForm createBlog={createBlog} />;
}

export default App;
