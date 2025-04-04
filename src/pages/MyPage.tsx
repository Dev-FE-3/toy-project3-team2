import OverflowMenu from "../components/common/OverflowMenu";

const menuOptions = [
  { label: "수정", action: () => alert("수정 클릭") },
  { label: "삭제", action: () => alert("삭제 클릭") }
];

const MyPage = () => {
  return (
    <div>
      마이페이지 입니다.
      <OverflowMenu options={menuOptions} />
    </div>
  )
};

export default MyPage;
