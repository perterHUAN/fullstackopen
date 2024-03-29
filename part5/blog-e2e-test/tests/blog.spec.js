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
          `a new blog ${blog.title} by ${blog.author} added`
        );
        await expect(message).toBeVisible();

        const addBlog = page.getByText(`${blog.title} ${blog.author}`, {
          exact: false,
        });
        await expect(addBlog).toBeVisible();
      });

      describe("when create blogs", () => {
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
        beforeEach(async ({ page }) => {
          // create blogs
          await createBlogs(page, blogs);
        });
        test("a created blog can can receive likes", async ({ page }) => {
          // click show button
          const blog = page
            .getByText(`${blogs[0].title}`, { expect: false })
            .locator("..");
          await showBlog(blog);
          // find likes
          const likesButton = blog.getByText("likes");
          const likes = blog.getByText("likes: 0", { exact: false });

          await expect(likesButton).toBeVisible();
          await expect(likes).toBeVisible();
          // click likes
          await likesButton.click();

          const message = page.getByText("Update Blog Successful");
          await expect(message).toBeVisible();

          const newLikes = page.getByText("likes: 1", { exact: false }).first();
          await expect(newLikes).toBeVisible();
        });
        test("a created blog can be delete", async ({ page }) => {
          const blog = page
            .getByText(`${blogs[0].title}`, { exact: false })
            .locator("..");
          // click show button
          const showButton = blog.getByRole("button", { name: "show" }).first();
          await expect(showButton).toBeVisible();
          await showButton.click();

          // remove button, blog to be removed
          const removeButton = blog.getByRole("button", { name: "remove" });
          // before click
          await expect(blog).toBeVisible();
          // click
          await removeButton.click();
          // after click
          const message = page.getByText(`Delete ${blogs[0].title}`, {
            exact: false,
          });
          await expect(message).toBeVisible();
          await expect(blog).not.toBeVisible();
        });
        test("only the user who added the blog can sees the blog's delete button", async ({
          page,
        }) => {
          // current login can see delete button
          const blog = page
            .getByText(`${blogs[0].title}`, { exact: false })
            .locator("..");
          // click show button
          await showBlog(blog);

          const removeButton = blog.getByRole("button", { name: "remove" });
          await expect(removeButton).toBeVisible();

          // logout
          const logoutButton = page.getByRole("button", { name: "logout" });
          await logoutButton.click();
          await expect(logoutButton).not.toBeVisible();
        });
        test("the blogs are arranged in the order according to the likes, the blog with the most likes first", async ({
          page,
        }) => {
          const likes = [2, 3, 1];
          for (let i = 0; i < 3; ++i) {
            const blog = page
              .getByText(`${blogs[i].title}`, { exact: false })
              .locator("..");
            await showBlog(blog);
            const cnt = likes[i];
            for (let j = 0; j < cnt; ++j) {
              await clickLikes(blog);
            }
          }

          const likesInfo = page.getByText(/likes: \d/);
          await expect(likesInfo).toContainText([/3/, /2/, /1/]);
        });
      });
    });
  });
});
async function showBlog(blog) {
  const showButton = blog.getByRole("button", { name: "show" });
  await expect(showButton).toBeVisible();
  await showButton.click();
}

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
async function clickLikes(blog) {
  const likesButton = blog.getByRole("button", { name: "likes" });
  const likes = blog.getByText("likes: ", { expect: false });
  const beforeClickInfo = await likes.innerText();
  const afterClickInfo = beforeClickInfo.replace(/\d+/, (e) => Number(e) + 1);
  await likesButton.click();
  await expect(likes).toHaveText(afterClickInfo);
}
