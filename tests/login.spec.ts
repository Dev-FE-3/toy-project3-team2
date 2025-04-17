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

  test("유효한 이메일과 비밀번호로 로그인 성공", async ({ page }) => {
    // 이메일과 비밀번호 입력
    await page.getByTestId("email-input").fill(TEST_EMAIL);
    await page.getByTestId("password-input").fill(TEST_PASSWORD);
    // 로그인 버튼 클릭
    await page.getByTestId("login-button").click();
    // 로그인 성공 후 홈페이지로 리디렉션 확인
    await expect(page).toHaveURL("http://localhost:5173");
  });

  test("잘못된 이메일로 로그인 실패", async ({ page }) => {
    // 잘못된 이메일 입력
    await page.getByTestId("email-input").fill(WRONG_EMAIL);
    await page.getByTestId("password-input").fill(TEST_PASSWORD);

    // 로그인 버튼 클릭
    const submitButton = page.getByTestId("login-button");
    await submitButton.click();

    // 에러 메시지가 나타날 때까지 기다림
    const errorMessage = page.locator("p.text-red-500");

    // 에러 메시지 확인
    await expect(errorMessage).toContainText("이메일과 비밀번호를 확인해주세요");
  });

  test("잘못된 비밀번호로 로그인 실패", async ({ page }) => {
    // 잘못된 비밀번호 입력
    await page.getByTestId("email-input").fill(TEST_EMAIL);
    await page.getByTestId("password-input").fill(WRONG_PASSWORD);
    // 로그인 버튼 클릭
    await page.getByTestId("login-button").click();
    // 에러 메시지 확인
    const errorMessage = page.locator("p.text-red-500");
    await expect(errorMessage).toContainText("이메일과 비밀번호를 확인해주세요");
  });

  test("빈 필드로 로그인 시도", async ({ page }) => {
    // 버튼이 비활성화되어 있는지 확인
    const submitButton = page.getByTestId("login-button");
    await expect(submitButton).toBeDisabled();
  });

  test("회원가입 페이지로 이동", async ({ page }) => {
    // 회원가입 링크 클릭
    await page.getByTestId("signup-link").click();
    // 회원가입 페이지의 요소가 나타나는지 확인
    await expect(page.getByTestId("signup-page")).toBeVisible();
  });
});
