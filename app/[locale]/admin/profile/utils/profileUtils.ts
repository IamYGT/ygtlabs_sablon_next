import { AdminProfile } from "../types/profile.types";

export const getProfileInitials = (profile: AdminProfile): string => {
  if (profile.name) {
    return profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return profile.email.slice(0, 2).toUpperCase();
};

export const formatDate = (date: string | null): string => {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString();
};
