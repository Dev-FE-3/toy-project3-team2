import axiosInstance from "@/services/axios/axiosInstance";
import { User } from "@/types/user";

export const fetchUser = async (userId: string): Promise<User> => {
  const { data } = await axiosInstance.get<User[]>("/user", {
    params: {
      id: `eq.${userId}`,
      select: "*",
    },
  });
  return data[0];
};
