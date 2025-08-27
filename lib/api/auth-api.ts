// Auth API client
import { api } from "../api";
import type { SimpleUser } from "../types";

export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post<{ user: SimpleUser }>("/api/auth/login", data),
  
  logout: (logoutAllSessions = false) => 
    api.post("/api/auth/logout", { logoutAllSessions }),
  
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/api/auth/register", data),
  
  getCurrentUser: () => api.get<{ user: SimpleUser }>("/api/auth/current-user"),
  
  checkPermissions: (permissions: string[]) =>
    api.post("/api/auth/check-permissions", { permissions }),
  
  refreshPermissions: () => api.post("/api/auth/refresh-permissions"),
};
