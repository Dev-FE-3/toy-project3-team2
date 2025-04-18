import { RefObject, useEffect, useRef, useState } from "react";

import { Input } from "./Input";
import Cross from "@/assets/icons/cross.svg?react";
import useSearchStore from "@/store/useSearchStore";
import { useLocation } from "react-router-dom";

interface SearchBarProps {
  onClose: () => void;
}

const SearchBar = ({ onClose }: SearchBarProps) => {
  const location = useLocation();
  const searchInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

  const searchKeyword = useSearchStore((state) => state.searchKeyword);
  const setSearchKeyword = useSearchStore((state) => state.setSearchKeyword);

  const [searchQuery, setSearchQuery] = useState("");

  // zustand 상태로 로컬 상태 초기화 (한 번만)
  useEffect(() => {
    setSearchQuery(searchKeyword);
  }, [searchKeyword]);

  // 검색창이 마운트되면 자동으로 포커스
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchInputRef]);

  // 이전 경로를 저장
  const prevPathRef = useRef(location.pathname);

  // 페이지 이동 감지
  useEffect(() => {
    // 경로가 변경되었을 때
    if (prevPathRef.current !== location.pathname) {
      handleReset();
      // 현재 경로 업데이트
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery !== searchKeyword) {
        setSearchKeyword(searchQuery);
      }
    }
  };

  // 검색어 초기화 및 검색창 닫기
  const handleReset = () => {
    setSearchQuery("");
    setSearchKeyword("");
    onClose();
  };

  return (
    <form className="flex w-full items-center gap-3">
      <Input
        ref={searchInputRef}
        type="round"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
        placeholder="검색어를 입력해주세요"
        className="flex-1"
      />
      <button type="button" onClick={handleReset}>
        <Cross />
      </button>
    </form>
  );
};

export default SearchBar;
