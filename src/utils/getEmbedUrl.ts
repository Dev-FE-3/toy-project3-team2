// youtube URL을 embed용 URL로 변환
export const getEmbedUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1);
    } else if (hostname === "www.youtube.com" || hostname === "youtube.com") {
      const queryVideoId = urlObj.searchParams.get("v");
      if (queryVideoId) {
        videoId = queryVideoId;
      }
    }

    if (!videoId) {
      return url; // 예외 처리
    }

    const params = new URLSearchParams({
      autoplay: "0", // 자동재생
      mute: "0", // 음소거(자동재생 하려면 필수)
      controls: "0", // 컨트롤러 숨기려면 0
      modestbranding: "1", // 유튜브 로고 최소화
      rel: "0", // 관련 영상 안 보이도록
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  } catch (error) {
    console.error("잘못된 URL 형식입니다:", error);
    return "";
  }
};
