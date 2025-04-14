import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import OverflowMenu from "@/components/common/OverflowMenu";
import PlaylistCard from "@/components/common/PlaylistCard";
import { TextArea } from "@/components/common/TextArea";

const ButtonGuide = () => {
  return (
    <>
      <h3 className="ml-[10px] text-xl font-bold">Button</h3>
      <div className="my-4 rounded-xl border border-gray-600 p-4">
        <div className="mb-6">
          <h4 className="font-semibold">기본 버튼</h4>
          <h5 className="mb-2 text-sm font-medium">기본</h5>
          <Button variant="full">저장</Button>
          <br />
          <h5 className="mb-2 text-sm font-medium">비활성화</h5>
          <Button disabled variant="full">
            저장
          </Button>
          <Button variant="full" fixed>
            fixed 버튼
          </Button>
        </div>
        <h4 className="font-semibold">작은 버튼</h4>
        <div className="flex flex-row gap-[20px]">
          <div>
            <h5 className="mb-2 text-sm font-medium">기본</h5>
            <Button variant="small">중복확인</Button>
          </div>
          <div>
            <h5 className="mb-2 text-sm font-medium">비활성화</h5>
            <Button disabled variant="small">
              중복확인
            </Button>
          </div>
          <div>
            <h5 className="mb-2 text-sm font-medium">닫기</h5>
            <Button variant="secondary">닫기</Button>
          </div>
        </div>
      </div>
    </>
  );
};

const InputGuide = () => {
  const [inputValue, setInputValue] = useState("defaultValue");
  const [textareaValue, setTextareaValue] = useState("defaultValue");

  return (
    <>
      <h3 className="ml-[10px] text-xl font-bold">Input</h3>
      <div className="my-4 rounded-xl border border-gray-600 p-4">
        <div className="mb-6">
          {/* 라벨옵션 */}
          <Input type="text" placeholder="이름을 입력하세요" label="라벨 옵션" htmlFor="label-option" />
          <h5 className="mb-2 text-sm font-medium">기본</h5>
          <Input type="text" placeholder="이름을 입력하세요" />
        </div>
        <div className="mb-6">
          <h5 className="mb-2 text-sm font-medium">비밀번호</h5>
          <Input type="password" placeholder="비밀번호를 입력하세요" />
        </div>
        <div className="mb-6">
          {/* delete 버튼 옵션 */}
          <h5 className="mb-2 text-sm font-medium">delete 옵션 추가</h5>
          <Input type="email" showDelete placeholder="이메일을 입력하세요" />
        </div>
        <div className="mb-6">
          <h5 className="mb-2 text-sm font-medium">실시간 입력 미리보기</h5>
          <Input
            type="text"
            placeholder="텍스트를 입력하세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            showDelete
          />
          {/* inputValue 확인 */}
          <p>{inputValue}</p>
        </div>
        <div className="mb-6">
          {/* round */}
          <h5 className="mb-2 text-sm font-medium">둥근 input</h5>
          <Input type="round" placeholder="검색어를 입력하세요" />
        </div>
        <div className="mb-6">
        </div>
      </div>
      <h3 className="ml-[10px] text-xl font-bold">TextArea</h3>
      <div className="my-4 rounded-xl border border-gray-600 p-4">
        {/* textarea 소개글 */}
        <h5 className="mb-2 text-sm font-medium">textarea</h5>
          <TextArea label="소개글" htmlFor="textarea" value={textareaValue} onChange={(e) => setTextareaValue(e.target.value)} placeholder="소개글을 입력하세요" />
        </div>
    </>
  );
};

const OverflowMenuGuide = () => {
  const MENU_OPTIONS = [
    { label: "수정", action: () => alert("수정 클릭") },
    { label: "삭제", action: () => alert("삭제 클릭") },
  ];

  return (
    <>
      <h3 className="ml-[10px] text-xl font-bold">OverflowMenu</h3>
      <div className="my-4 flex flex-row gap-[10px] rounded-xl border border-gray-600 p-4">
        {/* basic */}
        <h5 className="text-sm font-medium">기본 메뉴</h5>
        <OverflowMenu options={MENU_OPTIONS} />
        {/* iconSize */}
        <h5 className="ml-[10px] text-sm font-medium">24px 사이즈</h5>
        <OverflowMenu options={MENU_OPTIONS} iconSize={24} />
      </div>
    </>
  );
};

const PlaylistCardGuide = () => {
  // 실제 Supabase에 있는 playlist ID로 상세 페이지 연결 테스트
  return (
    <>
      <h3 className="ml-[10px] text-xl font-bold">PlaylistCard</h3>
      <div className="my-4 rounded-xl border border-gray-600 p-4">
        <h5 className="mb-2 text-sm font-medium">홈 & 구독</h5>
        <PlaylistCard
          id="721649ae-fbaa-4b9d-a32e-91f9ed511bda"
          title="[Ghibli OST Playlist] 감성 충만 지브리 OST 연주곡 모음집 | 마녀배달부 키키, 이웃집 토토로, 센과 치히로의 행방불명 등"
          thumbnailUrl="https://i.pinimg.com/736x/60/0c/b6/600cb65bd5f67e70a8fac0909e4c1ee6.jpg"
          userImage="https://i.pinimg.com/736x/17/c1/d9/17c1d903910937ecfd18943ee06279c2.jpg"
          isOwner={false}
        />
        <h5 className="mb-2 text-sm font-medium">마이페이지 - 공개</h5>
        <PlaylistCard
          id="721649ae-fbaa-4b9d-a32e-91f9ed511bda"
          title="[Ghibli OST Playlist] 감성 충만 지브리 OST 연주곡 모음집 | 마녀배달부 키키, 이웃집 토토로, 센과 치히로의 행방불명 등"
          thumbnailUrl="https://i.pinimg.com/736x/60/0c/b6/600cb65bd5f67e70a8fac0909e4c1ee6.jpg"
          isOwner={true}
        />
        <h5 className="mb-2 text-sm font-medium">마이페이지 - 비공개</h5>
        <PlaylistCard
          id="721649ae-fbaa-4b9d-a32e-91f9ed511bda"
          title="[Ghibli OST Playlist] 감성 충만 지브리 OST 연주곡 모음집 | 마녀배달부 키키, 이웃집 토토로, 센과 치히로의 행방불명 등"
          thumbnailUrl="https://i.pinimg.com/736x/60/0c/b6/600cb65bd5f67e70a8fac0909e4c1ee6.jpg"
          isPublic={false}
          isOwner={true}
        />
      </div>
    </>
  );
};

const Guide = () => {
  return (
    <>
      <ButtonGuide />
      <InputGuide />
      <OverflowMenuGuide />
      <PlaylistCardGuide />
    </>
  );
};

export default Guide;
