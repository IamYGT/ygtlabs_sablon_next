import { useQuery } from "@tanstack/react-query";
import { ProfileStats } from "../types/profile.types";

export const useProfileStats = () => {
  return useQuery({
    queryKey: ["profile-stats"],
    queryFn: async (): Promise<ProfileStats> => {
      const response = await fetch("/api/admin/profile/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch profile stats");
      }
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useProfileStatsRealtime = () => {
  return useQuery<ProfileStats>({
    queryKey: ["profile-stats-realtime"],
    queryFn: async () => {
      const response = await fetch("/api/admin/profile/stats?realtime=true");
      if (!response.ok) {
        throw new Error("Gerçek zamanlı istatistikler alınamadı");
      }
      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};
