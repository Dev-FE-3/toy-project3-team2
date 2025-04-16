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

    // 메뉴 버튼 찾기
    const overflowMenuButton = page.locator('header button[aria-controls="user-menu"]');
    await overflowMenuButton.click();

    // 메뉴가 펼쳐졌으면 로그아웃 버튼 클릭
    const logoutButton = page.locator('#user-menu button:has-text("로그아웃")');
    await logoutButton.click();

    // 로그인 페이지로 리디렉션 확인
    await expect(page).toHaveURL("/login");
    await expect(page.locator("text=로그인")).toBeVisible();

    // 다시 마이페이지 접근 시 로그인 페이지로 리디렉션 되는지 확인
    await page.goto(`/mypage/${userId}`);
    await expect(page).toHaveURL("/login");
  });
});
