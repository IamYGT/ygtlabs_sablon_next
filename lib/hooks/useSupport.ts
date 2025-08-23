"use client";

// Support hooks using TanStack Query
// State management is handled by React Query, not Zustand

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

// Types
export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: "open" | "pending" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  categoryId?: string;
  customerId: string;
  assignedToId?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export interface Message {
  id: string;
  ticketId: string;
  senderId: string;
  content: string;
  messageType: "customer_message" | "admin_message" | "system_message";
  isRead: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

// Query keys
const SUPPORT_KEYS = {
  tickets: ["support", "tickets"] as const,
  ticket: (id: string) => ["support", "tickets", id] as const,
  messages: (ticketId: string) => ["support", "messages", ticketId] as const,
  categories: ["support", "categories"] as const,
};

// Hooks

// Get tickets list
export function useTickets(filters?: {
  status?: string;
  priority?: string;
  categoryId?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: [...SUPPORT_KEYS.tickets, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.priority) params.append("priority", filters.priority);
      if (filters?.categoryId) params.append("categoryId", filters.categoryId);
      if (filters?.search) params.append("search", filters.search);
      
      const response = await api.get<Ticket[]>(`/api/support/tickets?${params}`);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Get single ticket
export function useTicket(ticketId: string) {
  return useQuery({
    queryKey: SUPPORT_KEYS.ticket(ticketId),
    queryFn: async () => {
      const response = await api.get<Ticket>(`/api/support/tickets/${ticketId}`);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    enabled: !!ticketId,
    staleTime: 30 * 1000,
  });
}

// Get ticket messages
export function useTicketMessages(ticketId: string) {
  return useQuery({
    queryKey: SUPPORT_KEYS.messages(ticketId),
    queryFn: async () => {
      const response = await api.get<Message[]>(`/api/support/tickets/${ticketId}/messages`);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    enabled: !!ticketId,
    staleTime: 10 * 1000, // 10 seconds - messages update frequently
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  });
}

// Get categories
export function useCategories() {
  return useQuery({
    queryKey: SUPPORT_KEYS.categories,
    queryFn: async () => {
      const response = await api.get<Category[]>("/api/support/categories");
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create ticket
export function useCreateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      subject: string;
      description: string;
      categoryId?: string;
      priority?: string;
    }) => {
      const response = await api.post<Ticket>("/api/support/tickets", data);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.tickets });
    },
  });
}

// Update ticket
export function useUpdateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Ticket>) => {
      const response = await api.patch<Ticket>(`/api/support/tickets/${id}`, data);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.ticket(variables.id) });
      queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.tickets });
    },
  });
}

// Send message
export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ ticketId, content }: { ticketId: string; content: string }) => {
      const response = await api.post<Message>(
        `/api/support/tickets/${ticketId}/messages`,
        { content }
      );
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.messages(variables.ticketId) });
      queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.ticket(variables.ticketId) });
    },
  });
}

// Close ticket
export function useCloseTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await api.patch<Ticket>(
        `/api/support/tickets/${ticketId}`,
        { status: "closed" }
      );
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: (_, ticketId) => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.ticket(ticketId) });
      queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.tickets });
    },
  });
}
