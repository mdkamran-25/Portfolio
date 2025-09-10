/**
 * UI State Management with Zustand
 *
 * Manages ephemeral UI state that doesn't need to persist across sessions.
 * Includes modals, theme preferences, temporary selections, and loading states.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Modal State Types
 */
interface PaymentModalState {
  isOpen: boolean;
  amount: number | null;
  purpose: string | null;
}

interface ProjectDetailsModalState {
  isOpen: boolean;
  projectId: string | null;
}

interface ContactModalState {
  isOpen: boolean;
}

/**
 * Notification Type
 */
interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  timestamp: number;
}

/**
 * UI State Interface
 */
interface UIState {
  // Modal Management
  paymentModal: PaymentModalState;
  projectDetailsModal: ProjectDetailsModalState;
  contactModal: ContactModalState;

  // Theme and Appearance
  themeMode: "light" | "dark" | "system";
  primaryColor: string;

  // Navigation and Layout
  activeSection: string | null;
  isMenuOpen: boolean;
  isScrolled: boolean;

  // Temporary Selections and Filters
  selectedCategory: string | null;
  selectedTechnology: string | null;
  searchQuery: string;
  sortBy: "date" | "name" | "featured";
  sortOrder: "asc" | "desc";

  // Loading and Error States (UI-specific)
  isLoading: boolean;
  loadingMessage: string | null;
  notifications: Notification[];
}

/**
 * UI Actions Interface
 */
interface UIActions {
  // Modal Actions
  openPaymentModal: (amount: number, purpose?: string) => void;
  closePaymentModal: () => void;
  openProjectDetailsModal: (projectId: string) => void;
  closeProjectDetailsModal: () => void;
  openContactModal: () => void;
  closeContactModal: () => void;
  closeAllModals: () => void;

  // Theme Actions
  setThemeMode: (mode: "light" | "dark" | "system") => void;
  setPrimaryColor: (color: string) => void;
  toggleTheme: () => void;

  // Navigation Actions
  setActiveSection: (section: string | null) => void;
  toggleMenu: () => void;
  closeMenu: () => void;
  setScrolled: (isScrolled: boolean) => void;

  // Filter Actions
  setSelectedCategory: (category: string | null) => void;
  setSelectedTechnology: (technology: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: "date" | "name" | "featured") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  clearFilters: () => void;

  // UI State Actions
  setLoading: (isLoading: boolean, message?: string) => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Bulk Actions
  resetUIState: () => void;
}

/**
 * Initial UI State
 */
const initialState: UIState = {
  paymentModal: {
    isOpen: false,
    amount: null,
    purpose: null,
  },
  projectDetailsModal: {
    isOpen: false,
    projectId: null,
  },
  contactModal: {
    isOpen: false,
  },
  themeMode: "system",
  primaryColor: "#3B82F6",
  activeSection: null,
  isMenuOpen: false,
  isScrolled: false,
  selectedCategory: null,
  selectedTechnology: null,
  searchQuery: "",
  sortBy: "featured",
  sortOrder: "desc",
  isLoading: false,
  loadingMessage: null,
  notifications: [],
};

/**
 * UI Store with Zustand
 */
export const useUIStore = create<UIState & UIActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Modal Actions
      openPaymentModal: (amount, purpose) =>
        set({
          paymentModal: {
            isOpen: true,
            amount,
            purpose: purpose || null,
          },
        }),

      closePaymentModal: () =>
        set({
          paymentModal: {
            isOpen: false,
            amount: null,
            purpose: null,
          },
        }),

      openProjectDetailsModal: (projectId) =>
        set({
          projectDetailsModal: {
            isOpen: true,
            projectId,
          },
        }),

      closeProjectDetailsModal: () =>
        set({
          projectDetailsModal: {
            isOpen: false,
            projectId: null,
          },
        }),

      openContactModal: () =>
        set({
          contactModal: {
            isOpen: true,
          },
        }),

      closeContactModal: () =>
        set({
          contactModal: {
            isOpen: false,
          },
        }),

      closeAllModals: () =>
        set({
          paymentModal: { isOpen: false, amount: null, purpose: null },
          projectDetailsModal: { isOpen: false, projectId: null },
          contactModal: { isOpen: false },
        }),

      // Theme Actions
      setThemeMode: (mode) => set({ themeMode: mode }),
      setPrimaryColor: (color) => set({ primaryColor: color }),
      toggleTheme: () => {
        const currentMode = get().themeMode;
        const newMode = currentMode === "light" ? "dark" : "light";
        set({ themeMode: newMode });
      },

      // Navigation Actions
      setActiveSection: (section) => set({ activeSection: section }),
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      closeMenu: () => set({ isMenuOpen: false }),
      setScrolled: (isScrolled) => set({ isScrolled }),

      // Filter Actions
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedTechnology: (technology) => set({ selectedTechnology: technology }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (order) => set({ sortOrder: order }),
      clearFilters: () =>
        set({
          selectedCategory: null,
          selectedTechnology: null,
          searchQuery: "",
          sortBy: "featured",
          sortOrder: "desc",
        }),

      // UI State Actions
      setLoading: (isLoading, message) =>
        set({
          isLoading,
          loadingMessage: message || null,
        }),

      addNotification: (notification) => {
        const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id,
              timestamp: Date.now(),
            },
          ],
        }));
      },

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),

      // Bulk Actions
      resetUIState: () => set(initialState),
    }),
    {
      name: "portfolio-ui-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

/**
 * Selector hooks for specific UI state slices
 */
export const usePaymentModal = () => useUIStore((state) => state.paymentModal);
export const useProjectDetailsModal = () => useUIStore((state) => state.projectDetailsModal);
export const useContactModal = () => useUIStore((state) => state.contactModal);
export const useTheme = () =>
  useUIStore((state) => ({
    mode: state.themeMode,
    primaryColor: state.primaryColor,
  }));
export const useNavigation = () =>
  useUIStore((state) => ({
    activeSection: state.activeSection,
    isMenuOpen: state.isMenuOpen,
    isScrolled: state.isScrolled,
  }));
export const useFilters = () =>
  useUIStore((state) => ({
    selectedCategory: state.selectedCategory,
    selectedTechnology: state.selectedTechnology,
    searchQuery: state.searchQuery,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  }));
export const useUILoading = () =>
  useUIStore((state) => ({
    isLoading: state.isLoading,
    loadingMessage: state.loadingMessage,
  }));
export const useNotifications = () => useUIStore((state) => state.notifications);

/**
 * Action hooks for UI operations
 */
export const useModalActions = () =>
  useUIStore((state) => ({
    openPaymentModal: state.openPaymentModal,
    closePaymentModal: state.closePaymentModal,
    openProjectDetailsModal: state.openProjectDetailsModal,
    closeProjectDetailsModal: state.closeProjectDetailsModal,
    openContactModal: state.openContactModal,
    closeContactModal: state.closeContactModal,
    closeAllModals: state.closeAllModals,
  }));

export const useThemeActions = () =>
  useUIStore((state) => ({
    setThemeMode: state.setThemeMode,
    setPrimaryColor: state.setPrimaryColor,
    toggleTheme: state.toggleTheme,
  }));

export const useNavigationActions = () =>
  useUIStore((state) => ({
    setActiveSection: state.setActiveSection,
    toggleMenu: state.toggleMenu,
    closeMenu: state.closeMenu,
    setScrolled: state.setScrolled,
  }));

export const useFilterActions = () =>
  useUIStore((state) => ({
    setSelectedCategory: state.setSelectedCategory,
    setSelectedTechnology: state.setSelectedTechnology,
    setSearchQuery: state.setSearchQuery,
    setSortBy: state.setSortBy,
    setSortOrder: state.setSortOrder,
    clearFilters: state.clearFilters,
  }));

export const useUIActions = () =>
  useUIStore((state) => ({
    setLoading: state.setLoading,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications,
    resetUIState: state.resetUIState,
  }));
