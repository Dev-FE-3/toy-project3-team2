import { test, expect } from "@playwright/test";

// 테스트용 계정 정보
const TEST_EMAIL = "test@test.com";
const TEST_PASSWORD = "test123!";
const WRONG_EMAIL = "wrong@email.com";
const WRONG_PASSWORD = "wrongpassword";

test.describe("로그인 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/login");
  });

  test("로그인 유효성 검사 후 유저 정보 저장", async ({ page }) => {
    // Step 1: 유효성 검사
    await test.step("빈 필드로 로그인 시도", async () => {
      const submitButton = page.getByTestId("login-button");
      await expect(submitButton).toBeDisabled();
    });

    await test.step("잘못된 이메일로 로그인 실패", async () => {
      await page.getByTestId("email-input").fill(WRONG_EMAIL);
      await page.getByTestId("password-input").fill(TEST_PASSWORD);
      await page.getByTestId("login-button").click();
      const errorMessage = page.locator("p.text-red-500");
      await expect(errorMessage).toContainText("이메일과 비밀번호를 확인해주세요");
    });

    await test.step("잘못된 비밀번호로 로그인 실패", async () => {
      await page.getByTestId("email-input").fill(TEST_EMAIL);
      await page.getByTestId("password-input").fill(WRONG_PASSWORD);
      await page.getByTestId("login-button").click();
      const errorMessage = page.locator("p.text-red-500");
      await expect(errorMessage).toContainText("이메일과 비밀번호를 확인해주세요");
    });

    // Step 2: 기능 테스트
    await test.step("회원가입 페이지로 이동", async () => {
      await page.getByTestId("signup-link").click();
      await expect(page.getByTestId("signup-page")).toBeVisible();
      await page.goto("http://localhost:5173/login"); // 로그인 페이지로 돌아가기
    });

    await test.step("유효한 이메일과 비밀번호로 로그인 성공", async () => {
      await page.getByTestId("email-input").fill(TEST_EMAIL);
      await page.getByTestId("password-input").fill(TEST_PASSWORD);
      await page.getByTestId("login-button").click();
      await expect(page).toHaveURL("http://localhost:5173");
    });

    // Step 3: 상태 저장
    await test.step("로그인 상태 저장", async () => {
      await page.context().storageState({ path: "./tests/fixtures/auth.json" });
    });
  });
});
