import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/api/user";

// 마이페이지 유저 쿼리
export const useUserInfoQuery = (userId: string) => {
  return useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });
};
