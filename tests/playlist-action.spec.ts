import { test, expect } from "@playwright/test";

test("구독/좋아요 버튼 클릭 시 상태 업데이트 및 카운트 반영", async ({ page }) => {
  const playlistId = "7f56b4a8-311f-4f5f-8fc9-68c46935fc81";

  await page.goto(`http://localhost:5173/playlist/${playlistId}`);

  const subscribeButton = page.getByTestId("subscribe-button");
  const likeButton = page.getByTestId("like-button");
  const subscribeIcon = page.getByTestId("subscribe-icon");
  const likeIcon = page.getByTestId("like-icon");
  const subscribeCountText = page.getByTestId("subscribe-count");
  const likeCountText = page.getByTestId("like-count");

  await expect(subscribeButton).toBeVisible();
  await expect(likeButton).toBeVisible();

  // 좋아요 상태 확인 및 토글 테스트
  const initialLikeIsActive = !((await likeIcon.getAttribute("class")) ?? "").includes("fill-none");
  let likeIsActive = initialLikeIsActive;
  let likeCount = likeIsActive ? 1 : 0;

  await expect(likeCountText).toHaveText(likeCount.toString());

  // 좋아요 클릭
  await likeButton.click();
  likeIsActive = !likeIsActive;
  likeCount = likeIsActive ? 1 : 0;

  await expect(likeCountText).toHaveText(likeCount.toString());

  // 좋아요 다시 클릭
  await likeButton.click();
  likeIsActive = !likeIsActive;
  likeCount = likeIsActive ? 1 : 0;

  await expect(likeCountText).toHaveText(likeCount.toString());

  // 구독 상태 확인 및 토글 테스트
  const initialSubscribeIsActive = !((await subscribeIcon.getAttribute("class")) ?? "").includes(
    "fill-none",
  );
  let subscribeIsActive = initialSubscribeIsActive;
  let subscribeCount = subscribeIsActive ? 1 : 0;

  await expect(subscribeCountText).toHaveText(subscribeCount.toString());

  // 구독 클릭
  await subscribeButton.click();
  subscribeIsActive = !subscribeIsActive;
  subscribeCount = subscribeIsActive ? 1 : 0;

  await expect(subscribeCountText).toHaveText(subscribeCount.toString());

  // 구독 다시 클릭
  await subscribeButton.click();
  subscribeIsActive = !subscribeIsActive;
  subscribeCount = subscribeIsActive ? 1 : 0;

  await expect(subscribeCountText).toHaveText(subscribeCount.toString());
});
