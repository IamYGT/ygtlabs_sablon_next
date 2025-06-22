// ============================================================================
// UI STORE - Global UI State Management with Zustand
// Manages loading states, modals, notifications, sidebar, and theme
// ============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoadingState, ModalState, NotificationState } from "../types";
import { STORAGE_KEYS, NOTIFICATION_CONFIG } from "../constants";

// ============================================================================
// UI STORE INTERFACE
// ============================================================================

interface UIStore {
  // Loading states
  loading: LoadingState;
  setLoading: (key: string, loading: boolean) => void;
  clearAllLoading: () => void;

  // Modal management
  modals: { [key: string]: ModalState };
  openModal: (key: string, data?: unknown) => void;
  closeModal: (key: string) => void;
  closeAllModals: () => void;
  isModalOpen: (key: string) => boolean;
  getModalData: (key: string) => unknown;

  // Notification system
  notifications: NotificationState[];
  addNotification: (
    notification: Omit<NotificationState, "id" | "createdAt">
  ) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Convenience notification methods
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;

  // Sidebar state
  sidebar: {
    isOpen: boolean;
    isCollapsed: boolean;
  };
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;

  // Theme management
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Global actions
  reset: () => void;
}

// ============================================================================
// UI STORE IMPLEMENTATION
// ============================================================================

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Loading states
      loading: {},
      setLoading: (key: string, loading: boolean) => {
        set((state) => ({
          loading: {
            ...state.loading,
            [key]: loading,
          },
        }));
      },
      clearAllLoading: () => {
        set({ loading: {} });
      },

      // Modal management
      modals: {},
      openModal: (key: string, data?: unknown) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [key]: {
              isOpen: true,
              data,
            },
          },
        }));
      },
      closeModal: (key: string) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [key]: {
              ...state.modals[key],
              isOpen: false,
            },
          },
        }));
      },
      closeAllModals: () => {
        const { modals } = get();
        const closedModals = Object.keys(modals).reduce((acc, key) => {
          acc[key] = { ...modals[key], isOpen: false };
          return acc;
        }, {} as { [key: string]: ModalState });

        set({ modals: closedModals });
      },
      isModalOpen: (key: string) => {
        const { modals } = get();
        return modals[key]?.isOpen || false;
      },
      getModalData: (key: string) => {
        const { modals } = get();
        return modals[key]?.data;
      },

      // Notification system
      notifications: [],
      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const newNotification: NotificationState = {
          ...notification,
          id,
          createdAt: new Date(),
          duration:
            notification.duration || NOTIFICATION_CONFIG.DEFAULT_DURATION,
        };

        set((state) => {
          const notifications = [...state.notifications, newNotification];

          // Limit the number of notifications
          if (notifications.length > NOTIFICATION_CONFIG.MAX_NOTIFICATIONS) {
            notifications.splice(
              0,
              notifications.length - NOTIFICATION_CONFIG.MAX_NOTIFICATIONS
            );
          }

          return { notifications };
        });

        // Auto-remove notification after duration
        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }
      },
      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      clearAllNotifications: () => {
        set({ notifications: [] });
      },

      // Convenience notification methods
      showSuccess: (title: string, message?: string) => {
        get().addNotification({
          type: "success",
          title,
          message,
          duration: NOTIFICATION_CONFIG.SUCCESS_DURATION,
        });
      },
      showError: (title: string, message?: string) => {
        get().addNotification({
          type: "error",
          title,
          message,
          duration: NOTIFICATION_CONFIG.ERROR_DURATION,
        });
      },
      showWarning: (title: string, message?: string) => {
        get().addNotification({
          type: "warning",
          title,
          message,
          duration: NOTIFICATION_CONFIG.WARNING_DURATION,
        });
      },
      showInfo: (title: string, message?: string) => {
        get().addNotification({
          type: "info",
          title,
          message,
          duration: NOTIFICATION_CONFIG.INFO_DURATION,
        });
      },

      // Sidebar state
      sidebar: {
        isOpen: true,
        isCollapsed: false,
      },
      toggleSidebar: () => {
        set((state) => ({
          sidebar: {
            ...state.sidebar,
            isOpen: !state.sidebar.isOpen,
          },
        }));
      },
      setSidebarOpen: (isOpen: boolean) => {
        set((state) => ({
          sidebar: {
            ...state.sidebar,
            isOpen,
          },
        }));
      },
      toggleSidebarCollapse: () => {
        set((state) => ({
          sidebar: {
            ...state.sidebar,
            isCollapsed: !state.sidebar.isCollapsed,
          },
        }));
      },
      setSidebarCollapsed: (isCollapsed: boolean) => {
        set((state) => ({
          sidebar: {
            ...state.sidebar,
            isCollapsed,
          },
        }));
      },

      // Theme management
      theme: "system",
      setTheme: (theme: "light" | "dark" | "system") => {
        set({ theme });
      },

      // Global actions
      reset: () => {
        set({
          loading: {},
          modals: {},
          notifications: [],
          sidebar: {
            isOpen: true,
            isCollapsed: false,
          },
          theme: "system",
        });
      },
    }),
    {
      name: STORAGE_KEYS.PREFERENCES,
      partialize: (state) => ({
        sidebar: state.sidebar,
        theme: state.theme,
      }),
    }
  )
);

// ============================================================================
// SELECTOR HOOKS
// ============================================================================

// Loading selectors
export const useLoading = (key?: string) => {
  const loading = useUIStore((state) => state.loading);
  return key ? loading[key] || false : loading;
};

export const useIsLoading = (key: string) =>
  useUIStore((state) => state.loading[key] || false);

export const useAnyLoading = () =>
  useUIStore((state) =>
    Object.values(state.loading).some((loading) => loading)
  );

// Modal selectors
export const useModal = (key: string) =>
  useUIStore((state) => ({
    isOpen: state.modals[key]?.isOpen || false,
    data: state.modals[key]?.data,
  }));

export const useIsModalOpen = (key: string) =>
  useUIStore((state) => state.modals[key]?.isOpen || false);

export const useModalData = (key: string) =>
  useUIStore((state) => state.modals[key]?.data);

// Notification selectors
export const useNotifications = () =>
  useUIStore((state) => state.notifications);

export const useNotificationCount = () =>
  useUIStore((state) => state.notifications.length);

// Sidebar selectors
export const useSidebar = () => useUIStore((state) => state.sidebar);

export const useIsSidebarOpen = () =>
  useUIStore((state) => state.sidebar.isOpen);

export const useIsSidebarCollapsed = () =>
  useUIStore((state) => state.sidebar.isCollapsed);

// Theme selectors
export const useTheme = () => useUIStore((state) => state.theme);

// Action selectors
export const useUIActions = () =>
  useUIStore((state) => ({
    setLoading: state.setLoading,
    clearAllLoading: state.clearAllLoading,
    openModal: state.openModal,
    closeModal: state.closeModal,
    closeAllModals: state.closeAllModals,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    clearAllNotifications: state.clearAllNotifications,
    showSuccess: state.showSuccess,
    showError: state.showError,
    showWarning: state.showWarning,
    showInfo: state.showInfo,
    toggleSidebar: state.toggleSidebar,
    setSidebarOpen: state.setSidebarOpen,
    toggleSidebarCollapse: state.toggleSidebarCollapse,
    setSidebarCollapsed: state.setSidebarCollapsed,
    setTheme: state.setTheme,
    reset: state.reset,
  }));

// ============================================================================
// UTILITY HOOKS
// ============================================================================

// Hook for managing component loading state
export const useComponentLoading = (componentName: string) => {
  const isLoading = useIsLoading(componentName);
  const setLoading = useUIStore((state) => state.setLoading);

  return {
    isLoading,
    startLoading: () => setLoading(componentName, true),
    stopLoading: () => setLoading(componentName, false),
  };
};

// Hook for managing modal state
export const useModalControl = (modalKey: string) => {
  const { isOpen, data } = useModal(modalKey);
  const { openModal, closeModal } = useUIActions();

  return {
    isOpen,
    data,
    open: (modalData?: unknown) => openModal(modalKey, modalData),
    close: () => closeModal(modalKey),
  };
};

// Hook for showing notifications with consistent API
export const useNotify = () => {
  const { showSuccess, showError, showWarning, showInfo } = useUIActions();

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Helper to check if any specific loading states are active
export const isAnyLoading = (keys: string[]): boolean => {
  const loading = useUIStore.getState().loading;
  return keys.some((key) => loading[key]);
};

// Helper to get notification by ID
export const getNotificationById = (
  id: string
): NotificationState | undefined => {
  const notifications = useUIStore.getState().notifications;
  return notifications.find((n) => n.id === id);
};

// Helper to count notifications by type
export const countNotificationsByType = (
  type: NotificationState["type"]
): number => {
  const notifications = useUIStore.getState().notifications;
  return notifications.filter((n) => n.type === type).length;
};

// Helper to clear notifications by type
export const clearNotificationsByType = (
  type: NotificationState["type"]
): void => {
  const { notifications, removeNotification } = useUIStore.getState();
  notifications
    .filter((n) => n.type === type)
    .forEach((n) => removeNotification(n.id));
};

// Export store for direct access if needed
export { useUIStore as uiStore };
