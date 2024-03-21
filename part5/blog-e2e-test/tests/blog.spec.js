const { test, expect, beforeEach, describe } = require("@playwright/test");

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
      expect(message).toBeDefined();
    });
    test("failed with wrong credentials", async ({ page }) => {
      const wrongCredential = {
        username: "peterhan",
        password: "09876",
      };

      await loginWith(page, wrongCredential);

      const message = page.getByText("wrong username or password");
      expect(message).toBeDefined();
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
