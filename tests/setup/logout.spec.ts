import { test, expect } from "@playwright/test";

test.describe("마이페이지 로그아웃", () => {
  test("로그아웃 버튼 클릭 시 로그아웃 되고 로그인 페이지로 이동해야 함", async ({ page }) => {
    // 홈(메인) 페이지 접속
    await page.goto("/");

    // localStorage에서 userId 추출
    const userId = await page.evaluate(() => {
      const storage = JSON.parse(localStorage.getItem("user-storage") || "{}");
      return storage?.state?.user?.id;
    });

    // 마이페이지 접속
    await page.goto(`/mypage/${userId}`);

    // header icon 찾기
    const headerIcon = page.locator('[data-test-id="header-icon"]');
    await headerIcon.click();

    // 로그아웃 버튼 클릭
    const logoutButton = page.locator('[data-test-id="logout-button"]');
    await logoutButton.click();

    // 로그인 페이지로 리디렉션 확인
    await expect(page).toHaveURL("/login");
  });
});
