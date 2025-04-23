import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/utils/toast";
import supabase from "@/services/supabase/supabaseClient";
import uploadProfileImage from "@/services/supabase/uploadProfileImage";
import axiosInstance from "@/services/axios/axiosInstance";
import useUserStore from "@/store/useUserStore";

interface UpdateProfileParams {
  userId: string;
  profileImage: File | null;
  previewImage: string | null;
  password: string;
  nickname: string;
  description: string;
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async ({
      userId,
      profileImage,
      previewImage,
      password,
      nickname,
      description,
    }: UpdateProfileParams) => {
      let imageUrl = previewImage;

      if (profileImage) {
        imageUrl = await uploadProfileImage(profileImage, userId);
      }

      if (password) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw new Error("비밀번호 변경 실패");
      }

      const { data } = await axiosInstance.patch(
        "/user",
        { profile_image: imageUrl, nickname, description },
        { params: { id: `eq.${userId}` }, headers: { Prefer: "return=representation" } },
      );

      return data[0];
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries();
      showToast("success", "정보 변경이 완료되었습니다");
      navigate(`/mypage/${updatedUser.id}`);
    },
    onError: (error) => {
      console.error("업데이트 실패:", error);
    },
  });
};
