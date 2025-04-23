import React, { ChangeEvent } from "react";
import Camera from "@/assets/icons/camera.svg?react";

interface ProfileImageProps {
  previewImage: string | null;
  onProfileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  email: string | undefined;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ previewImage, onProfileChange, email }) => {
  return (
    <div className="mb-[20px] mt-[50px] text-center">
      <div className="relative inline-block">
        <label htmlFor="profile" className="cursor-pointer">
          {previewImage && (
            <img
              className="mx-auto h-[80px] w-[80px] rounded-full object-cover brightness-[0.6]"
              src={previewImage}
              alt="User Profile"
            />
          )}
          <Camera className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </label>
        <input
          id="profile"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onProfileChange}
        />
      </div>
      <span className="mt-[8px] block">{email}</span>
    </div>
  );
};

export default ProfileImage;
