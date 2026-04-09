import { test, expect } from "@playwright/test";

/**
 * Smoke tests — verifies the app boots and critical pages render.
 * These tests do NOT require a logged-in user; they cover the public surface.
 */

test.describe("Public pages", () => {
  test("home page loads and shows key content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Manager AI Coach/i);
    await expect(page.getByRole("heading", { name: /Manager AI Coach/i })).toBeVisible();
    await expect(page.getByText(/Learning Path/i)).toBeVisible();
    await expect(page.getByText(/AI Coach/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Get Started/i })).toBeVisible();
  });

  test("sign-in page loads", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.getByRole("heading", { name: /Sign in/i })).toBeVisible();
    await expect(page.getByPlaceholder(/your@email.com/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Send magic link/i })).toBeVisible();
  });

  test("verify-request page loads", async ({ page }) => {
    await page.goto("/auth/verify-request");
    await expect(page).not.toHaveURL(/error/);
  });

  test("onboarding page loads", async ({ page }) => {
    await page.goto("/onboarding");
    // Onboarding is client-rendered; page should load without 500
    await expect(page).not.toHaveURL(/error/);
    await expect(page.locator("body")).not.toContainText("Internal Server Error");
  });

  test("dashboard redirects unauthenticated users to sign-in", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test("skills page redirects unauthenticated users to sign-in", async ({ page }) => {
    await page.goto("/skills");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test("coach page loads (client-side, no auth required to render)", async ({ page }) => {
    await page.goto("/coach");
    await expect(page.locator("body")).not.toContainText("Internal Server Error");
  });
});

test.describe("API health", () => {
  test("NextAuth endpoint responds", async ({ request }) => {
    const response = await request.get("/api/auth/providers");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("google");
    expect(body).toHaveProperty("email");
  });
});
