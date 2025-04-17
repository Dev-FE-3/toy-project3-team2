import { User } from "@/types/user";

interface Props {
  userInfo: User;
}

const UserProfileSection = ({ userInfo }: Props) => {
  return (
    <section className="flex flex-wrap items-center gap-[14px] p-[16px]">
      <img
        className="h-[60px] w-[60px] rounded-full object-cover"
        src={userInfo.profile_image}
        alt="User Profile"
      />
      <div className="flex flex-grow flex-col gap-[4px]">
        <span>{userInfo.nickname}</span>
        <span className="text-sub text-font-muted">구독 {userInfo.subscribe_count ?? 0}</span>
      </div>
      <p className="my-[2px] w-full text-body2">
        {userInfo.description || "소개글을 작성해주세요."}
      </p>
    </section>
  );
};

export default UserProfileSection;
