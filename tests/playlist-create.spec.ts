import { test, expect } from "@playwright/test";

const testVideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

test.describe("플레이리스트 생성 페이지 테스트", () => {
  test.use({ storageState: "./tests/fixtures/auth.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/playlist/create");
    await page.waitForLoadState("networkidle");
    console.log("페이지가 로드되었습니다.");
  });

  test("필수 입력값이 없으면 생성 버튼이 비활성화되어야 함", async ({ page }) => {
    const createButton = page.getByRole("button", { name: "생성" });

    await test.step("초기 상태 확인", async () => {
      await expect(createButton).toBeVisible(); // 버튼 존재 먼저 보장
      await expect(createButton).toBeDisabled(); // 그다음 비활성화 상태 확인
    });

    await test.step("제목만 입력", async () => {
      await page.getByLabel("제목*").fill("테스트 제목");
      await expect(createButton).toBeDisabled(); // 비활성화
    });

    await test.step("제목과 설명 입력", async () => {
      await page.getByLabel("소개*").fill("테스트 설명");
      await expect(createButton).toBeDisabled(); // 비활성화
    });

    await test.step("모든 필수값 입력", async () => {
      await page.getByLabel("영상 링크 추가*").fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      await page.getByRole("button", { name: "추가" }).click();
      await expect(createButton).toBeEnabled(); // 활성화
    });
  });

  test("최소 한 개 이상의 영상이 필요해야 함", async ({ page }) => {
    await test.step("영상 추가", async () => {
      await page.getByLabel("영상 링크 추가*").fill(testVideoUrl);
      await page.getByRole("button", { name: "추가" }).click();
      await expect(page.getByTestId("video-card")).toBeVisible();
    });

    await test.step("마지막 영상 삭제 시도", async () => {
      // 삭제 버튼 클릭
      await page.locator("[data-testid='delete-video-button']").first().click();

      // 토스트 메시지가 표시될 때까지 대기
      await expect(
        page.getByText("플레이리스트에는 최소 한 개 이상의 영상이 필요합니다."),
      ).toBeVisible();
    });
  });

  test("유효한 정보로 플레이리스트를 생성할 수 있어야 함", async ({ page }) => {
    const testTitle = "테스트 플레이리스트";
    const testDescription = "테스트 설명입니다";

    await test.step("초기 상태 확인", async () => {
      const createButton = page.getByRole("button", { name: "생성" });
      await expect(createButton).toBeDisabled();
    });

    await test.step("플레이리스트 정보 입력", async () => {
      await page.waitForLoadState("domcontentloaded");
      await page.getByPlaceholder("제목을 입력하세요").fill(testTitle);
      await page.getByPlaceholder("소개글을 입력해주세요").fill(testDescription);

      // 영상 추가
      await page.getByPlaceholder("영상 링크를 입력해주세요").fill(testVideoUrl);
      await page.getByRole("button", { name: "추가" }).click();
      await expect(page.getByTestId("video-card")).toBeVisible();
    });

    await test.step("생성 버튼 클릭", async () => {
      await page.getByRole("button", { name: "생성" }).click();
    });

    await test.step("생성 성공 확인", async () => {
      await expect(page).toHaveURL(/\/playlist\/[a-z0-9-]+$/); // 상세 페이지로 이동하는가
      await expect(page.locator("h3", { hasText: testTitle })).toBeVisible();
    });
  });
});
