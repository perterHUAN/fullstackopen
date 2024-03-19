import { screen, render } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog blog addLikes removeBlog>", () => {
  test("Intitally, the blog should only display title and author,but not url and likes", () => {
    // parameters  blog addLikes removeBlog
    const blog = {
      author: "peter",
      title: "Hello World",
      url: "https://www.baidu.com",
      likes: 10,
    };

    const addLikes = vi.fn();
    const removeBlog = vi.fn();
    render(<Blog blog={blog} addLikes={addLikes} removeBlog={removeBlog} />);
    // console.log(screen.debug());
    // check whether both title and author exist
    // how to find a element by text content ?
    // getByText default exact: true
    // if can't find, test fail
    screen.getByText(`${blog.title} ${blog.author}`, {
      exact: false,
    });

    // check whether both url and likes don't exist
    const urlElement = screen.queryByText("url");
    expect(urlElement).toBeNull();

    const likesElement = screen.queryByText("likes");
    expect(likesElement).toBeNull();
  });
});
