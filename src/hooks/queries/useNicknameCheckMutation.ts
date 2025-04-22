import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/services/axios/axiosInstance";

interface UseNicknameCheckMutationProps {
  userId: string | undefined;
  onSuccess?: (isValid: boolean) => void;
  onError?: (error: unknown) => void;
}

export const useNicknameCheckMutation = ({
  userId,
  onSuccess,
  onError,
}: UseNicknameCheckMutationProps) => {
  return useMutation({
    mutationFn: async (nickname: string) => {
      const { data } = await axiosInstance.get("/user", {
        params: { nickname: `eq.${nickname}` },
      });
      return data;
    },
    onSuccess: (data) => {
      const isDuplicate = data.length > 0 && data[0].id !== userId;
      onSuccess?.(!isDuplicate);
    },
    onError,
  });
};
