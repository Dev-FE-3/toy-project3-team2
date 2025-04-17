import { test, expect } from "@playwright/test";

test.use({ storageState: "./tests/fixtures/auth.json" });

test("인증 상태 확인", async ({ page }) => {
  // 타임아웃 설정 (기본값: 30초)
  test.setTimeout(30000); // 30초로 설정

  // 홈페이지로 이동
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });

  // 초기 URL 저장
  const initialUrl = page.url();

  // 3초 대기
  await page.waitForTimeout(3000);

  // 3초 후 URL 확인
  const finalUrl = page.url();

  // URL이 변경되지 않았는지 확인
  const isLoggedIn = initialUrl === finalUrl && finalUrl === "http://localhost:5173/";

  // 쿠키 정보 확인
  const cookies = await page.context().cookies();
});
