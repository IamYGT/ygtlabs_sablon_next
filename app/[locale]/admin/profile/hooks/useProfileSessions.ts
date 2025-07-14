import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SessionInfo } from "../types/profile.types";

export const useProfileSessions = () => {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ["profile-sessions"],
    queryFn: async (): Promise<SessionInfo[]> => {
      const response = await fetch("/api/admin/profile/sessions");
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const terminateSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/api/admin/profile/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to terminate session");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["profile-stats"] });
      toast.success(data.message || "Session terminated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to terminate session");
    },
  });

  return {
    sessions: sessionsQuery.data,
    isLoading: sessionsQuery.isLoading,
    isError: sessionsQuery.isError,
    error: sessionsQuery.error,
    terminateSession: terminateSessionMutation.mutate,
    isTerminating: terminateSessionMutation.isPending,
  };
};
