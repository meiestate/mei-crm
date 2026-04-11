import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ThemeMode = "light" | "dark";
export type TableDensity = "compact" | "comfortable" | "spacious";
export type ViewMode = "grid" | "list" | "table" | "kanban";

type UiState = {
  isSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;
  isCommandPaletteOpen: boolean;
  isNotificationsPanelOpen: boolean;
  isProfileMenuOpen: boolean;

  pageLoading: boolean;
  globalSearch: string;

  tableDensity: TableDensity;
  defaultViewMode: ViewMode;

  themeMode: ThemeMode;

  setSidebarOpen: (value: boolean) => void;
  toggleSidebar: () => void;

  setMobileSidebarOpen: (value: boolean) => void;
  toggleMobileSidebar: () => void;
  closeAllSidebars: () => void;

  setCommandPaletteOpen: (value: boolean) => void;
  toggleCommandPalette: () => void;

  setNotificationsPanelOpen: (value: boolean) => void;
  toggleNotificationsPanel: () => void;

  setProfileMenuOpen: (value: boolean) => void;
  toggleProfileMenu: () => void;

  setPageLoading: (value: boolean) => void;

  setGlobalSearch: (value: string) => void;
  clearGlobalSearch: () => void;

  setTableDensity: (value: TableDensity) => void;
  setDefaultViewMode: (value: ViewMode) => void;

  setThemeMode: (value: ThemeMode) => void;
  toggleThemeMode: () => void;

  resetUiState: () => void;
};

type UiPersistedState = Pick<
  UiState,
  "tableDensity" | "defaultViewMode" | "themeMode" | "isSidebarOpen"
>;

export const UI_STORAGE_KEY = "mei-crm-ui";

const initialState: Omit<
  UiState,
  | "setSidebarOpen"
  | "toggleSidebar"
  | "setMobileSidebarOpen"
  | "toggleMobileSidebar"
  | "closeAllSidebars"
  | "setCommandPaletteOpen"
  | "toggleCommandPalette"
  | "setNotificationsPanelOpen"
  | "toggleNotificationsPanel"
  | "setProfileMenuOpen"
  | "toggleProfileMenu"
  | "setPageLoading"
  | "setGlobalSearch"
  | "clearGlobalSearch"
  | "setTableDensity"
  | "setDefaultViewMode"
  | "setThemeMode"
  | "toggleThemeMode"
  | "resetUiState"
> = {
  isSidebarOpen: true,
  isMobileSidebarOpen: false,
  isCommandPaletteOpen: false,
  isNotificationsPanelOpen: false,
  isProfileMenuOpen: false,

  pageLoading: false,
  globalSearch: "",

  tableDensity: "comfortable",
  defaultViewMode: "table",

  themeMode: "light",
};

const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      ...initialState,

      setSidebarOpen: (value: boolean) => {
        set({ isSidebarOpen: value });
      },

      toggleSidebar: () => {
        set((state: UiState) => ({
          isSidebarOpen: !state.isSidebarOpen,
        }));
      },

      setMobileSidebarOpen: (value: boolean) => {
        set({ isMobileSidebarOpen: value });
      },

      toggleMobileSidebar: () => {
        set((state: UiState) => ({
          isMobileSidebarOpen: !state.isMobileSidebarOpen,
        }));
      },

      closeAllSidebars: () => {
        set({
          isSidebarOpen: false,
          isMobileSidebarOpen: false,
        });
      },

      setCommandPaletteOpen: (value: boolean) => {
        set({ isCommandPaletteOpen: value });
      },

      toggleCommandPalette: () => {
        set((state: UiState) => ({
          isCommandPaletteOpen: !state.isCommandPaletteOpen,
        }));
      },

      setNotificationsPanelOpen: (value: boolean) => {
        set({ isNotificationsPanelOpen: value });
      },

      toggleNotificationsPanel: () => {
        set((state: UiState) => ({
          isNotificationsPanelOpen: !state.isNotificationsPanelOpen,
        }));
      },

      setProfileMenuOpen: (value: boolean) => {
        set({ isProfileMenuOpen: value });
      },

      toggleProfileMenu: () => {
        set((state: UiState) => ({
          isProfileMenuOpen: !state.isProfileMenuOpen,
        }));
      },

      setPageLoading: (value: boolean) => {
        set({ pageLoading: value });
      },

      setGlobalSearch: (value: string) => {
        set({ globalSearch: value });
      },

      clearGlobalSearch: () => {
        set({ globalSearch: "" });
      },

      setTableDensity: (value: TableDensity) => {
        set({ tableDensity: value });
      },

      setDefaultViewMode: (value: ViewMode) => {
        set({ defaultViewMode: value });
      },

      setThemeMode: (value: ThemeMode) => {
        set({ themeMode: value });
      },

      toggleThemeMode: () => {
        set((state: UiState) => ({
          themeMode: state.themeMode === "dark" ? "light" : "dark",
        }));
      },

      resetUiState: () => {
        set({
          ...initialState,
        });
      },
    }),
    {
      name: UI_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state: UiState): UiPersistedState => ({
        isSidebarOpen: state.isSidebarOpen,
        tableDensity: state.tableDensity,
        defaultViewMode: state.defaultViewMode,
        themeMode: state.themeMode,
      }),
    },
  ),
);

export default useUiStore;