import { NewVideoForPlaylist } from "@/types/video";

export const areVideoListsEqual = (
  list1: NewVideoForPlaylist[],
  list2: NewVideoForPlaylist[],
): boolean => {
  if (list1.length !== list2.length) return false;

  return list1.every((video, index) => {
    const other = list2[index];
    return (
      video.url === other.url && video.title === other.title && video.thumbnail === other.thumbnail
    );
  });
};
