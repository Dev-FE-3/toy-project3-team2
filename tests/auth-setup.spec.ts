import { test } from "@playwright/test";

const TEST_EMAIL = "test@test.com";
const TEST_PASSWORD = "test123!";

test("로그인 상태 저장", async ({ page }) => {
  await page.goto("http://localhost:5173/login"); // 로그인 URL
  await page.fill("#email", TEST_EMAIL);
  await page.fill("#password", TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL("http://localhost:5173"); // 로그인 성공 후 리디렉션

  // 로그인된 상태 저장
  await page.context().storageState({ path: "./tests/fixtures/auth.json" });
});