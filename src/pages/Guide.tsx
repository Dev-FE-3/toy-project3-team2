import { useState } from "react";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import OverflowMenu from "../components/common/OverflowMenu";

const ButtonGuide = () => {
  return (
    <div>
      <Button variant="full">저장</Button>
      <br />
      <Button disabled variant="full">
        저장
      </Button>
      <br />
      <Button variant="small">중복확인</Button>
      <br />
      <Button disabled variant="small">
        중복확인
      </Button>
      <br />
      <Button variant="secondary">닫기</Button>
      <br />
    </div>
  );
};

const InputGuide = () => {
  const [inputValue, setInputValue] = useState("defaultValue");

  return (
    <div>
      <Input type="text" placeholder="이름을 입력하세요" />
      <Input className="flex-grow" type="text" placeholder="이름을 입력하세요" />
      <Input type="password" placeholder="비밀번호를 입력하세요" />
      {/* delete 버튼 옵션 */}
      <Input type="email" showDelete placeholder="이메일을 입력하세요" />
      <Input
        type="text"
        placeholder="텍스트를 입력하세요"
        defaultValue={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        showDelete
      />
      {/* inputValue 확인 */}
      <p>{inputValue}</p>
      {/* textarea 소개글 */}
      <Input type="textarea" placeholder="소개글을 입력하세요" />
      {/* round */}
      <Input type="round" placeholder="검색어를 입력하세요" />
    </div>
  );
};

const OverflowMenuGuide = () => {
  const menuOptions = [
    { label: "수정", action: () => alert("수정 클릭") },
    { label: "삭제", action: () => alert("삭제 클릭") }
  ];

  return (
    <>
      {/* basic */}
      <OverflowMenu options={menuOptions} />

      {/* iconSize */}
      <OverflowMenu options={menuOptions} iconSize={24} />
    </>
  )
}



const Guide = () => {
  return (
    <>
      <ButtonGuide />
      <InputGuide />
      <OverflowMenuGuide />
    </>
  );
};

export default Guide;
