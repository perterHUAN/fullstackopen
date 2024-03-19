import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

describe("<BlogForm createBlog setMessage />", () => {
  test("click submit button, the handler shoulde be call, the blog's info will be passed to createBlog function", async () => {
    // props createBlog setMessage blog
    const blog = {
      author: "peter",
      title: "Hello world",
      url: "https://www.baidu.com",
    };

    const createBlog = vi.fn();
    const setMessage = vi.fn();
    // render
    render(<BlogForm createBlog={createBlog} setMessage={setMessage} />);

    // click submit button
    const user = userEvent.setup();

    const inputElements = screen.getAllByRole("textbox");

    await user.type(inputElements[0], blog.title);
    await user.type(inputElements[1], blog.author);
    await user.type(inputElements[2], blog.url);

    const submitButton = screen.getByText("submit");
    await user.click(submitButton);
    // check whether the handler is called, what parameters are passed
    expect(createBlog.mock.calls).toHaveLength(1);
    // console.log("first parameter: ", createBlog.mock.calls[0]);
    expect(createBlog.mock.calls[0][0]).toEqual(blog);
  });
});
