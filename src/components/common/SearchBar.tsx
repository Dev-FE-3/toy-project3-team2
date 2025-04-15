import { RefObject } from "react";

import { Input } from "./Input";
import Cross from "@/assets/icons/cross.svg?react";

interface SearchBarProps {
  searchQuery: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  onSearchQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  onClose: () => void;
}

const SearchBar = ({
  searchQuery,
  searchInputRef,
  onSearchQueryChange,
  onSearch,
  onClose,
}: SearchBarProps) => {
  // Enter 키 입력 시 검색 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchQuery);
    }
  };

  // 닫기 버튼 클릭 시 검색어 초기화 및 검색창 닫기
  const handleClose = () => {
    onSearchQueryChange(""); // 검색어 초기화
    onSearch(""); // 검색 결과 초기화
    onClose(); // 검색창 닫기
  };

  return (
    <div className="flex w-full items-center gap-3">
      <Input
        ref={searchInputRef}
        type="round"
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="검색어를 입력해주세요"
        className="flex-1"
      />
      <button onClick={handleClose}>
        <Cross />
      </button>
    </div>
  );
};

export default SearchBar;
