import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: "open" | "pending" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  categoryId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  deletedAt?: string;
  lastMessageAt?: string;
  messageCount: number;
  unreadCount?: number;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface Message {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  type: "customer_message" | "admin_message" | "system_message" | "internal_note";
  isRead: boolean;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  priority: number;
}

export interface Notification {
  id: string;
  ticketId?: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface SupportState {
  // State
  tickets: Ticket[];
  currentTicket: Ticket | null;
  messages: Message[];
  categories: Category[];
  notifications: Notification[];
  unreadNotifications: number;
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filters: {
    status?: string;
    priority?: string;
    categoryId?: string;
    assigneeId?: string;
    search?: string;
  };
  
  // Realtime
  typingUsers: Map<string, string[]>; // ticketId -> userIds
  onlineUsers: Set<string>;
  
  // Actions - Tickets
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
  deleteTicket: (ticketId: string) => void;
  setCurrentTicket: (ticket: Ticket | null) => void;
  
  // Actions - Messages
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  markMessageAsRead: (messageId: string) => void;
  
  // Actions - Categories
  setCategories: (categories: Category[]) => void;
  
  // Actions - Notifications
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Actions - Filters
  setFilters: (filters: Partial<SupportState["filters"]>) => void;
  clearFilters: () => void;
  
  // Actions - Realtime
  setTypingUser: (ticketId: string, userId: string, isTyping: boolean) => void;
  setUserOnline: (userId: string, isOnline: boolean) => void;
  
  // Actions - Utils
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: Pick<SupportState, 
  'tickets' | 'currentTicket' | 'messages' | 'categories' | 'notifications' | 
  'unreadNotifications' | 'isLoading' | 'error' | 'filters' | 'typingUsers' | 'onlineUsers'
> = {
  tickets: [],
  currentTicket: null,
  messages: [],
  categories: [],
  notifications: [],
  unreadNotifications: 0,
  isLoading: false,
  error: null,
  filters: {},
  typingUsers: new Map<string, string[]>(),
  onlineUsers: new Set<string>(),
};

export const useSupportStore = create<SupportState>()(
  devtools(
    persist(
      (set, _get) => ({
        ...initialState,
        
        // Tickets
        setTickets: (tickets) => 
          set({ tickets, error: null }),
        
        addTicket: (ticket) =>
          set((state) => ({ 
            tickets: [ticket, ...state.tickets],
            error: null 
          })),
        
        updateTicket: (ticketId, updates) =>
          set((state) => ({
            tickets: state.tickets.map((t) =>
              t.id === ticketId ? { ...t, ...updates } : t
            ),
            currentTicket: 
              state.currentTicket?.id === ticketId
                ? { ...state.currentTicket, ...updates }
                : state.currentTicket,
            error: null,
          })),
        
        deleteTicket: (ticketId) =>
          set((state) => ({
            tickets: state.tickets.filter((t) => t.id !== ticketId),
            currentTicket: 
              state.currentTicket?.id === ticketId ? null : state.currentTicket,
            error: null,
          })),
        
        setCurrentTicket: (ticket) =>
          set({ currentTicket: ticket, error: null }),
        
        // Messages
        setMessages: (messages) =>
          set({ messages, error: null }),
        
        addMessage: (message) =>
          set((state) => ({
            messages: [...state.messages, message],
            error: null,
          })),
        
        markMessageAsRead: (messageId) =>
          set((state) => ({
            messages: state.messages.map((m) =>
              m.id === messageId ? { ...m, isRead: true } : m
            ),
            error: null,
          })),
        
        // Categories
        setCategories: (categories) =>
          set({ categories, error: null }),
        
        // Notifications
        setNotifications: (notifications) => {
          const unreadCount = notifications.filter((n) => !n.isRead).length;
          set({ 
            notifications, 
            unreadNotifications: unreadCount,
            error: null 
          });
        },
        
        addNotification: (notification) =>
          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadNotifications: state.unreadNotifications + (notification.isRead ? 0 : 1),
            error: null,
          })),
        
        markNotificationAsRead: (notificationId) =>
          set((state) => {
            const notification = state.notifications.find((n) => n.id === notificationId);
            if (!notification || notification.isRead) return state;
            
            return {
              notifications: state.notifications.map((n) =>
                n.id === notificationId ? { ...n, isRead: true } : n
              ),
              unreadNotifications: Math.max(0, state.unreadNotifications - 1),
              error: null,
            };
          }),
        
        markAllNotificationsAsRead: () =>
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadNotifications: 0,
            error: null,
          })),
        
        // Filters
        setFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
            error: null,
          })),
        
        clearFilters: () =>
          set({ filters: {}, error: null }),
        
        // Realtime
        setTypingUser: (ticketId, userId, isTyping) =>
          set((state) => {
            const newTypingUsers = new Map(state.typingUsers);
            const users = newTypingUsers.get(ticketId) || [];
            
            if (isTyping && !users.includes(userId)) {
              newTypingUsers.set(ticketId, [...users, userId]);
            } else if (!isTyping) {
              const filtered = users.filter((id) => id !== userId);
              if (filtered.length > 0) {
                newTypingUsers.set(ticketId, filtered);
              } else {
                newTypingUsers.delete(ticketId);
              }
            }
            
            return { typingUsers: newTypingUsers };
          }),
        
        setUserOnline: (userId, isOnline) =>
          set((state) => {
            const newOnlineUsers = new Set(state.onlineUsers);
            if (isOnline) {
              newOnlineUsers.add(userId);
            } else {
              newOnlineUsers.delete(userId);
            }
            return { onlineUsers: newOnlineUsers };
          }),
        
        // Utils
        setLoading: (loading) =>
          set({ isLoading: loading }),
        
        setError: (error) =>
          set({ error, isLoading: false }),
        
        reset: () =>
          set(initialState),
      }),
      {
        name: "support-storage",
        partialize: (state) => ({
          filters: state.filters,
          notifications: state.notifications,
        }),
      }
    )
  )
);
