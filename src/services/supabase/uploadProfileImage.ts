import { supabase } from "./supabaseClient";

export const uploadProfileImage = async (file: File, userId: string) => {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/profile.${fileExt}`;

  const { error } = await supabase.storage.from("profile-images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) throw new Error("이미지 업로드 실패: " + error.message);

  const { data } = supabase.storage.from("profile-images").getPublicUrl(filePath);
  const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

  return publicUrl;
};
