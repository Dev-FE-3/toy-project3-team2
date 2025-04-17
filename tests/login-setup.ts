import { chromium } from "@playwright/test";

const main = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 로그인 페이지로 이동
    console.log("로그인 페이지로 이동 중...");
    await page.goto("http://localhost:5173/login");
    console.log("로그인 페이지 로드 완료.");

    // 이메일 필드와 비밀번호 입력 필드가 로드될 때까지 대기
    await page.waitForSelector("#email");
    console.log("이메일 입력 필드 로드 완료.");

    // 이메일과 비밀번호 입력
    await page.fill("#email", "ehjang@gmail.com");
    await page.fill("#password", "qwert123!");
    console.log("이메일과 비밀번호 입력 완료.");

    // 로그인 버튼 클릭
    await page.click('button[type="submit"]');
    console.log("로그인 버튼 클릭.");

    // 홈 페이지로 리디렉션 대기 (정규 표현식으로 경로 확인)
    await page.waitForURL(/localhost:5173\/.*/);
    console.log("홈 페이지로 리디렉션 완료.");

    // 로컬스토리지에 값이 저장될 때까지 대기 (로컬스토리지에서 값이 비어 있지 않은지 확인)
    await page.waitForFunction(() => {
      return localStorage.getItem("user-storage") !== null;
    });
    console.log("로컬스토리지에 user-storage 값이 저장됨.");

    // 로컬스토리지에서 'user-storage' 값 가져오기
    const userStorage = await page.evaluate(() => {
      return localStorage.getItem("user-storage");
    });
    console.log("로컬스토리지 user-storage:", userStorage);

    // 로컬스토리지 상태 저장
    const storageStatePath = "./tests/fixtures/auth.json";
    await context.storageState({ path: storageStatePath });
    console.log(`인증 상태가 저장되었습니다. ${storageStatePath}`);
  } catch (error) {
    console.error("로그인 자동화 중 에러 발생:", error);
  } finally {
    await browser.close();
  }
};

main();
