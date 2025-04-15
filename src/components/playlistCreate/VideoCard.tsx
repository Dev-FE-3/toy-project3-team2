import DeleteIcon from "@/assets/icons/video_delete.svg?react";

type VideoCardProps = {
  index: number;
  video: {
    title: string;
    thumbnail: string;
  };
  onDelete: (index: number) => void;
};

const VideoCard = ({ index, video, onDelete }: VideoCardProps) => (
  <li className="relative flex flex-col gap-1">
    {index === 0 && (
      <span className="absolute left-2 top-2 rounded-md bg-overlay-primary px-1 py-[2px] text-tab">
        썸네일
      </span>
    )}
    <DeleteIcon className="absolute right-2 top-2 cursor-pointer" onClick={() => onDelete(index)} />

    <img
      src={video.thumbnail}
      alt={video.title}
      className="h-[88px] w-full rounded-md object-cover"
    />

    <p className="line-clamp-2 text-sub">{video.title}</p>
  </li>
);

export default VideoCard;
