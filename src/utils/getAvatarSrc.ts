// src/utils/getAvatarSrc.ts
import type { User } from "@/types/User";

export const PLACEHOLDER = "/images/user/owner.jpg";

export function getAvatarSrc(u: Pick<User, "profileImage"> & { profileImageUrl?: string }): string {
  if (u.profileImageUrl && /^https?:\/\//i.test(u.profileImageUrl)) {
    return u.profileImageUrl;
  }
  if (u.profileImage && /^https?:\/\//i.test(u.profileImage)) {
    return u.profileImage;
  }
  if (u.profileImage) {
    return `/${u.profileImage.replace(/^\/+/, "")}`;
  }
  return PLACEHOLDER;
}
