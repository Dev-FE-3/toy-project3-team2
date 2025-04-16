import { test, expect } from "@playwright/test";

test.use({ storageState: "./tests/fixtures/auth.json" });

test("인증 상태 확인", async ({ page }) => {
  // 타임아웃 설정 (기본값: 30초)
  test.setTimeout(30000); // 30초로 설정

  console.log("테스트 시작");

  // 홈페이지로 이동
  console.log("홈페이지로 이동 시도...");
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  console.log("홈페이지 이동 완료");

  // 초기 URL 저장
  const initialUrl = page.url();
  console.log("초기 URL:", initialUrl);

  // 3초 대기
  console.log("3초 대기 중...");
  await page.waitForTimeout(3000);

  // 3초 후 URL 확인
  const finalUrl = page.url();
  console.log("3초 후 URL:", finalUrl);

  // URL이 변경되지 않았는지 확인
  const isLoggedIn = initialUrl === finalUrl && finalUrl === "http://localhost:5173/";
  console.log("로그인 상태:", isLoggedIn ? "로그인됨" : "로그인되지 않음");

  // 쿠키 정보 확인
  console.log("쿠키 정보 확인 중...");
  const cookies = await page.context().cookies();
  console.log("쿠키 정보:", cookies);

  console.log("테스트 완료");
});
