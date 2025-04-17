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

  await expect(subscribeButton).toBeVisible({ timeout: 5000 });
  await expect(likeButton).toBeVisible({ timeout: 5000 });

  // 초기 상태 가져오기
  const initialLikeClass = (await likeIcon.getAttribute("class")) ?? "";
  let likeClass = initialLikeClass.includes("fill-none") ? "fill-none" : "fill-white";
  let likeCount = likeClass === "fill-none" ? 0 : 1;

  await expect(likeIcon).toHaveClass(new RegExp(likeClass));
  await expect(likeCountText).toHaveText(likeCount.toString());

  // 좋아요 클릭
  await likeButton.click();
  likeClass = likeClass === "fill-white" ? "fill-none" : "fill-white";
  likeCount = likeClass === "fill-none" ? likeCount - 1 : likeCount + 1;

  await expect(likeIcon).toHaveClass(new RegExp(likeClass));
  await expect(likeCountText).toHaveText(likeCount.toString());

  // 좋아요 다시 클릭
  await likeButton.click();
  likeClass = likeClass === "fill-white" ? "fill-none" : "fill-white";
  likeCount = likeClass === "fill-none" ? likeCount - 1 : likeCount + 1;

  await expect(likeIcon).toHaveClass(new RegExp(likeClass));
  await expect(likeCountText).toHaveText(likeCount.toString());

  // 구독 상태 확인 및 토글
  const initialSubscribeClass = (await subscribeIcon.getAttribute("class")) ?? "";
  let subscribeClass = initialSubscribeClass.includes("fill-none") ? "fill-none" : "fill-white";
  let subscribeCount = subscribeClass === "fill-none" ? 0 : 1;

  await expect(subscribeIcon).toHaveClass(new RegExp(subscribeClass));
  await expect(subscribeCountText).toHaveText(subscribeCount.toString());

  // 구독 클릭
  await subscribeButton.click();
  subscribeClass = subscribeClass === "fill-white" ? "fill-none" : "fill-white";
  subscribeCount = subscribeClass === "fill-none" ? subscribeCount - 1 : subscribeCount + 1;

  await expect(subscribeIcon).toHaveClass(new RegExp(subscribeClass));
  await expect(subscribeCountText).toHaveText(subscribeCount.toString());

  // 구독 다시 클릭
  await subscribeButton.click();
  subscribeClass = subscribeClass === "fill-white" ? "fill-none" : "fill-white";
  subscribeCount = subscribeClass === "fill-none" ? subscribeCount - 1 : subscribeCount + 1;

  await expect(subscribeIcon).toHaveClass(new RegExp(subscribeClass));
  await expect(subscribeCountText).toHaveText(subscribeCount.toString());
});
