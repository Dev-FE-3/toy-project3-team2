import { test, expect } from "@playwright/test";

// 테스트용 계정 정보
const TEST_EMAIL = "ehjang@gmail.com";
const TEST_PASSWORD = "qwert123!";
const WRONG_EMAIL = "wrong@email.com";
const WRONG_PASSWORD = "wrongpassword";

test.describe("로그인 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/login");
  });

  test("유효한 이메일과 비밀번호로 로그인 성공", async ({ page }) => {
    // 이메일과 비밀번호 입력
    await page.fill("#email", TEST_EMAIL);
    await page.fill("#password", TEST_PASSWORD);
    // 로그인 버튼 클릭
    await page.click('button[type="submit"]');
    // 로그인 성공 후 홈페이지로 리디렉션 확인
    await page.waitForURL("http://localhost:5173");
    await expect(page).toHaveURL("http://localhost:5173");
    console.log("로그인 성공 테스트 완료");
  });

  test("잘못된 이메일로 로그인 실패", async ({ page }) => {
    // 잘못된 이메일 입력
    await page.fill("#email", WRONG_EMAIL);
    await page.fill("#password", TEST_PASSWORD);
    // 로그인 버튼 클릭
    await page.click('button[type="submit"]');
    // 에러 메시지 확인
    const errorMessage = page.locator("p.text-red-500");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("이메일과 비밀번호를 확인해주세요");
    console.log("잘못된 이메일 로그인 실패 테스트 완료");
  });

  test("잘못된 비밀번호로 로그인 실패", async ({ page }) => {
    // 잘못된 비밀번호 입력
    await page.fill("#email", TEST_EMAIL);
    await page.fill("#password", WRONG_PASSWORD);
    // 로그인 버튼 클릭
    await page.click('button[type="submit"]');
    // 에러 메시지 확인
    const errorMessage = page.locator("p.text-red-500");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText("이메일과 비밀번호를 확인해주세요");
    console.log("잘못된 비밀번호 로그인 실패 테스트 완료");
  });

  test("빈 필드로 로그인 시도", async ({ page }) => {
    // 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
    console.log("빈 필드 로그인 시도 테스트 완료");
  });

  test("회원가입 페이지로 이동", async ({ page }) => {
    // 회원가입 링크 클릭
    await page.click('a[href="/signup"]');
    // 회원가입 페이지로 리디렉션 확인
    await page.waitForURL("http://localhost:5173/signup");
    await expect(page).toHaveURL("http://localhost:5173/signup");
    console.log("회원가입 페이지 이동 테스트 완료");
  });
});
