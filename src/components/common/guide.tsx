import { Button } from "./button";

const Guide = () => {
  return (
    <>
      {/* Button Guide */}
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
    </>
  );
};

export default Guide;
