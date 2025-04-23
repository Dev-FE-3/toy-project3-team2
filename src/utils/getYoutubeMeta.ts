type YoutubeMeta = {
  title: string;
  thumbnailUrl: string;
};

export const getYoutubeMeta = async (url: string): Promise<YoutubeMeta | null> => {
  try {
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oEmbedUrl);

    if (!res.ok) throw new Error("요청 실패");

    const data = await res.json();

    return {
      title: data.title,
      thumbnailUrl: data.thumbnail_url,
    };
  } catch (error) {
    console.error("유튜브 메타데이터를 가져오는 데 실패했습니다:", error);
    return null;
  }
};
