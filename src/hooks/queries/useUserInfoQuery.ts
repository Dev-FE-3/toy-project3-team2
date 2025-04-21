import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios/axiosInstance";
import { User } from "@/types/user";

const fetchUser = async (userId: string): Promise<User> => {
  const { data } = await axiosInstance.get<User[]>("/user", {
    params: {
      id: `eq.${userId}`,
      select: "*",
    },
  });
  return data[0];
};

// 마이페이지 유저 쿼리
export const useUserInfoQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  });
};
