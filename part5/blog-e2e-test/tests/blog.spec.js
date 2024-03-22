const { test, expect, beforeEach, describe } = require("@playwright/test");
const exp = require("constants");
const { create } = require("domain");
const { listenerCount } = require("process");

describe("Blog List App", () => {
  beforeEach(async ({ page, request }) => {
    // clear out database
    await request.post("http://localhost:3003/api/testing/reset");
    // for test login
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "peterhuan",
        username: "peterhuan",
        password: "123456",
      },
    });
    await page.goto("http://localhost:5173");
  });
  test("Login form is shown", async ({ page }) => {
    // two checkbox boxes for inputing username or password
    const password = page.getByRole("textbox", { name: "password" });
    await expect(password).toBeVisible();

    const username = page.getByRole("textbox", { name: "username" });
    await expect(username).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      const correctCredential = {
        username: "peterhuan",
        password: "123456",
      };

      await loginWith(page, correctCredential);
      const message = page.getByText(
        `${correctCredential.username} logged in`,
        { exact: false }
      );
      await expect(message).toBeVisible();
    });
    test("failed with wrong credentials", async ({ page }) => {
      const wrongCredential = {
        username: "peterhan",
        password: "09876",
      };

      await loginWith(page, wrongCredential);

      const message = page.getByText("wrong username or password");
      await expect(message).toBeVisible();
    });

    describe("when logged in", () => {
      beforeEach(async ({ page }) => {
        // login in
        await loginWith(page, {
          username: "peterhuan",
          password: "123456",
        });
      });

      test("a new blog should be created", async ({ page }) => {
        const createBlogButton = page.getByRole("button", {
          name: "create a blog",
        });
        await createBlogButton.click();

        const title = page.getByRole("textbox", { name: "title" });
        const author = page.getByRole("textbox", { name: "author" });
        const url = page.getByRole("textbox", { name: "url" });
        const submitButton = page.getByRole("button", { name: "submit" });

        const blog = {
          title: "Hello World",
          author: "peterhuan",
          url: "http://www.baidu.com",
        };
        await title.fill(blog.title);
        await author.fill(blog.author);
        await url.fill(blog.url);
        await submitButton.click();

        const message = page.getByText(
          `a new blog ${blog.title} by ${author} added`
        );
        await expect(message).toBeVisible();

        const addBlog = page.getByText(`${blog.title} ${blog.author}`, {
          exact: false,
        });
        await expect(addBlog).toBeVisible();
      });

      describe("when create blogs", () => {
        beforeEach(async ({ page }) => {
          // create blogs
          const blogs = [
            {
              title: "Hello world",
              author: "peterhuan",
              url: "http://www.baidu.com",
            },
            {
              title: "A good day",
              author: "peterhuan",
              url: "https://www.baidu.com",
            },
            {
              title: "HTML and CSS",
              author: "peterhuan",
              url: "https://www.baidu.com",
            },
          ];
          await createBlogs(page, blogs);
        });
        test.only("a created blog can can receive likes", async ({ page }) => {
          // click show button
          const showButton = page.getByRole("button", { name: "show" }).first();
          await expect(showButton).toBeVisible();
          await showButton.click();
          // find likes
          const likesButton = page.getByText("likes").first();
          const likes = page.getByText("likes: 0", { exact: false }).first();

          await expect(likesButton).toBeVisible();
          await expect(likes).toBeVisible();
          // click likes
          await likesButton.click();

          const message = page.getByText("Update Blog Successful");
          await expect(message).toBeVisible();

          const newLikes = page.getByText("likes: 1", { exact: false }).first();
          await expect(newLikes).toBeVisible();
        });
        test("a created blog can be delete", async () => {});
        test("only the user who added the blog can delete the blog", () => {});
        test("the blogs are arranged in the order according to the likes, the blog with the most likes first", () => {});
      });
    });
  });
});

async function loginWith(page, credentials) {
  const password = page.getByRole("textbox", { name: "password" });
  await password.fill(credentials.password);

  const username = page.getByRole("textbox", { name: "username" });
  await username.fill(credentials.username);

  const submitButton = page.getByRole("button", { name: "login" });
  await submitButton.click();
}

async function createBlogs(page, blogs) {
  // click creatBlogButton
  const createBlogButton = page.getByRole("button", {
    name: "create a blog",
  });
  await createBlogButton.click();

  const title = page.getByRole("textbox", { name: "title" });
  const author = page.getByRole("textbox", { name: "author" });
  const url = page.getByRole("textbox", { name: "url" });
  const submitButton = page.getByRole("button", { name: "submit" });

  for (const blog of blogs) {
    await title.fill(blog.title);
    await author.fill(blog.author);
    await url.fill(blog.url);
    await submitButton.click();
    await page
      .getByText(`a new blog ${blog.title} by ${blog.author} added`)
      .waitFor();
  }
}
