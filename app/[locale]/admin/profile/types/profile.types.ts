export interface AdminProfile {
  id: string;
  name: string | null;
  email: string;
  profileImage: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfilePreferences {
  theme: "light" | "dark" | "system";
  language: "tr" | "en";
}

export interface ProfileStats {
  totalLogins: number;
  accountAge: number;
  activeSessions: number;
}

export interface SessionInfo {
  id: string;
  deviceInfo: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isActive: boolean;
  isCurrent: boolean;
}

export interface ProfileFormData {
  name: string;
  email: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data?: AdminProfile;
}
