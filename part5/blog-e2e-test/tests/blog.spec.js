const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog List App", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });
  test("Login form is shown", async ({ page }) => {
    // two checkbox boxes for inputing username or password
    const password = page.getByRole("textbox", { name: "password" });
    await expect(password).toBeVisible();

    const username = page.getByRole("textbox", { name: "username" });
    await expect(username).toBeVisible();
  });
});
