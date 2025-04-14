import { useState } from "react";

export const usePlaylistSearch = (playlists: any[]) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredPlaylists = searchKeyword
    ? playlists.filter((playlist) =>
        playlist.title.toLowerCase().includes(searchKeyword.toLowerCase()),
      )
    : playlists;

  return {
    filteredPlaylists,
    searchKeyword,
    setSearchKeyword,
  };
};
