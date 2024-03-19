import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    const urlElement = screen.queryByText(blog.url);
    expect(urlElement).toBeNull();

    const likesElement = screen.queryByText("likes");
    expect(likesElement).toBeNull();
  });

  test("after clicking button, display url and likes", async () => {
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
    // click button
    const showButton = screen.getByText("show");
    const user = userEvent.setup();

    await user.click(showButton);
    // check whther url and likes exist
    screen.getByText(blog.url, { exact: false });
    screen.getByText("likes", { exact: false });
  });

  test("click the likes button twice, the handler should be called twice", async () => {
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
    // click button show url and likes
    const showButton = screen.getByText("show");
    const user = userEvent.setup();

    await user.click(showButton);

    // click likes button twice
    // exact: true
    const likesButton = screen.getByText("likes");
    await user.click(likesButton);
    await user.click(likesButton);
    // check the number of calls of hanlder

    expect(addLikes.mock.calls).toHaveLength(2);
  });
});
