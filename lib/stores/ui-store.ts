// ============================================================================
// UI STORE - Global UI State Management with Zustand
// Manages loading states, modals, notifications, and sidebar
// Theme management is handled by next-themes
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

  // Global actions
  reset: () => void;
}

// ============================================================================
// ZUSTAND STORE IMPLEMENTATION
// ============================================================================

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Loading state
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

      // Modal state
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
        set((state) => {
          const updatedModals = { ...state.modals };
          Object.keys(updatedModals).forEach((key) => {
            updatedModals[key] = {
              ...updatedModals[key],
              isOpen: false,
            };
          });
          return { modals: updatedModals };
        });
      },
      isModalOpen: (key: string) => {
        return get().modals[key]?.isOpen || false;
      },
      getModalData: (key: string) => {
        return get().modals[key]?.data;
      },

      // Notification system
      notifications: [],
      addNotification: (notification) => {
        const id = Date.now().toString() + Math.random().toString(36);
        const newNotification: NotificationState = {
          ...notification,
          id,
          createdAt: new Date(),
        };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Optimize setTimeout - use shorter duration and requestAnimationFrame
        const duration = Math.min(
          notification.duration || NOTIFICATION_CONFIG.DEFAULT_DURATION,
          5000
        );

        // Use requestAnimationFrame for better performance
        const removeNotification = () => {
          setTimeout(() => {
            set((state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }));
          }, duration);
        };

        // Schedule removal using RAF for better performance
        requestAnimationFrame(removeNotification);
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
        isCollapsed: true, // Başlangıçta kilitli (daraltılmamış) olmalı
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

      // Global actions
      reset: () => {
        set({
          loading: {},
          modals: {},
          notifications: [],
          sidebar: {
            isOpen: true,
            isCollapsed: true, // Başlangıçta kilitli (daraltılmamış) olmalı
          },
        });
      },
    }),
    {
      name: STORAGE_KEYS.PREFERENCES,
      partialize: (state) => ({
        sidebar: state.sidebar,
      }),
    }
  )
);

// ============================================================================
// SELECTOR HOOKS - Optimized to prevent infinite loops
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

// Action selectors - Optimized with individual selectors
export const useSetLoading = () => useUIStore((state) => state.setLoading);
export const useClearAllLoading = () =>
  useUIStore((state) => state.clearAllLoading);
export const useOpenModal = () => useUIStore((state) => state.openModal);
export const useCloseModal = () => useUIStore((state) => state.closeModal);
export const useCloseAllModals = () =>
  useUIStore((state) => state.closeAllModals);
export const useAddNotification = () =>
  useUIStore((state) => state.addNotification);
export const useRemoveNotification = () =>
  useUIStore((state) => state.removeNotification);
export const useClearAllNotifications = () =>
  useUIStore((state) => state.clearAllNotifications);
export const useShowSuccess = () => useUIStore((state) => state.showSuccess);
export const useShowError = () => useUIStore((state) => state.showError);
export const useShowWarning = () => useUIStore((state) => state.showWarning);
export const useShowInfo = () => useUIStore((state) => state.showInfo);
export const useToggleSidebar = () =>
  useUIStore((state) => state.toggleSidebar);
export const useSetSidebarOpen = () =>
  useUIStore((state) => state.setSidebarOpen);
export const useToggleSidebarCollapse = () =>
  useUIStore((state) => state.toggleSidebarCollapse);
export const useSetSidebarCollapsed = () =>
  useUIStore((state) => state.setSidebarCollapsed);
export const useResetUI = () => useUIStore((state) => state.reset);

// Legacy useUIActions - Now uses individual selectors to prevent infinite loops
export const useUIActions = () => ({
  setLoading: useUIStore.getState().setLoading,
  clearAllLoading: useUIStore.getState().clearAllLoading,
  openModal: useUIStore.getState().openModal,
  closeModal: useUIStore.getState().closeModal,
  closeAllModals: useUIStore.getState().closeAllModals,
  addNotification: useUIStore.getState().addNotification,
  removeNotification: useUIStore.getState().removeNotification,
  clearAllNotifications: useUIStore.getState().clearAllNotifications,
  showSuccess: useUIStore.getState().showSuccess,
  showError: useUIStore.getState().showError,
  showWarning: useUIStore.getState().showWarning,
  showInfo: useUIStore.getState().showInfo,
  toggleSidebar: useUIStore.getState().toggleSidebar,
  setSidebarOpen: useUIStore.getState().setSidebarOpen,
  toggleSidebarCollapse: useUIStore.getState().toggleSidebarCollapse,
  setSidebarCollapsed: useUIStore.getState().setSidebarCollapsed,
  reset: useUIStore.getState().reset,
});

// ============================================================================
// UTILITY HOOKS
// ============================================================================

// Hook for managing component loading state
export const useComponentLoading = (componentName: string) => {
  const isLoading = useIsLoading(componentName);
  const setLoading = useSetLoading();

  return {
    isLoading,
    startLoading: () => setLoading(componentName, true),
    stopLoading: () => setLoading(componentName, false),
  };
};

// Hook for managing modal state
export const useModalControl = (modalKey: string) => {
  const { isOpen, data } = useModal(modalKey);
  const openModal = useOpenModal();
  const closeModal = useCloseModal();

  return {
    isOpen,
    data,
    open: (modalData?: unknown) => openModal(modalKey, modalData),
    close: () => closeModal(modalKey),
  };
};

// Hook for showing notifications with consistent API
export const useNotify = () => ({
  success: useShowSuccess(),
  error: useShowError(),
  warning: useShowWarning(),
  info: useShowInfo(),
});

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
  const state = useUIStore.getState();
  const filteredNotifications = state.notifications.filter(
    (n) => n.type !== type
  );
  useUIStore.setState({ notifications: filteredNotifications });
};

// Export store for direct access if needed
export { useUIStore as uiStore };
