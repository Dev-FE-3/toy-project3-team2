import { Video } from "../../types/video";

export const Videos = ({
  videos,
  onSelect,
  selectedVideoId,
}: {
  videos: Video[];
  onSelect: (video: Video) => void;
  selectedVideoId: string;
}) => {
  return (
    <div className="border-y border-solid border-[#333] py-4">
      <h3 className="pl-4 text-body1-bold">재생목록</h3>
      <div className="scrollbar-hide overflow-x-auto">
        <ul className="mt-4 flex flex-row gap-3">
          {videos.map((video, index) => {
            const isActive = video.id === selectedVideoId;
            return (
              <li
                key={video.id}
                className={`flex w-[150px] shrink-0 cursor-pointer flex-col gap-2 ${index === 0 ? "ml-4" : ""} ${isActive ? "opacity-100" : "opacity-60"}`}
                onClick={() => onSelect(video)}
              >
                <div className="h-21 flex w-full items-center justify-center overflow-hidden rounded-[4px] bg-black">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="line-clamp-2 text-sub">{video.title}</h4>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
