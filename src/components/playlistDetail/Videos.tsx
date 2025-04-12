import { Video } from "../../types/video";

const Videos = ({
  videos,
  onSelect,
  selectedVideoId,
}: {
  videos: Video[];
  onSelect: (video: Video) => void;
  selectedVideoId: string;
}) => {
  return (
    <section className="border-y border-solid border-[#333] py-4">
      <h3 className="pl-4 text-body1-bold">재생목록</h3>
      <div className="scrollbar-hide overflow-x-auto">
        <ul className="mt-4 flex gap-3 pl-4">
          {videos.map((video) => {
            const isActive = video.id === selectedVideoId;

            return (
              <li
                key={video.id}
                className={`flex w-36 shrink-0 cursor-pointer flex-col gap-2 ${isActive ? "opacity-100" : "opacity-60"}`}
                onClick={() => onSelect(video)}
              >
                <div className="relative w-full overflow-hidden rounded-[4px] bg-black pt-[56.25%]">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute left-0 top-0 h-full w-full object-cover"
                  />
                </div>
                <h4 className="line-clamp-2 text-sub">{video.title}</h4>
              </li>
            );
          })}
          {/* 마지막 여백을 위한 투명 요소 */}
          <div className="w-1 shrink-0"></div>
        </ul>
      </div>
    </section>
  );
};

export default Videos;
