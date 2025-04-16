import { create } from "zustand";

interface SearchState {
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

const useSearchStore = create<SearchState>((set) => ({
  searchKeyword: "",
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
}));

export default useSearchStore;
