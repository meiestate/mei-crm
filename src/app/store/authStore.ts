import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
};

export type AuthTokens = {
  accessToken?: string;
  refreshToken?: string;
};

type AuthStatus = "idle" | "authenticated" | "unauthenticated";

type LoginPayload = {
  user: AuthUser;
  tokens?: AuthTokens | null;
};

type AuthState = {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  isHydrated: boolean;

  login: (payload: LoginPayload) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  markHydrated: () => void;
  resetAuth: () => void;
};

export const AUTH_STORAGE_KEY = "mei-crm-auth";

const initialState: Pick<
  AuthState,
  "user" | "tokens" | "isAuthenticated" | "status" | "isHydrated"
> = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  status: "unauthenticated",
  isHydrated: false,
};

const isBrowser = typeof window !== "undefined";

const removePersistedAuth = () => {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore localStorage errors
  }
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      login: ({ user, tokens = null }: LoginPayload) =>
        set({
          user,
          tokens,
          isAuthenticated: true,
          status: "authenticated",
        }),

      logout: () => {
        removePersistedAuth();

        set({
          ...initialState,
          isHydrated: true,
        });
      },

      setUser: (user: AuthUser | null) =>
        set((state: AuthState) => ({
          user,
          isAuthenticated: !!user,
          status: user ? "authenticated" : "unauthenticated",
          tokens: user ? state.tokens : null,
        })),

      setTokens: (tokens: AuthTokens | null) =>
        set((state: AuthState) => ({
          tokens,
          isAuthenticated: !!state.user,
          status: state.user ? "authenticated" : "unauthenticated",
        })),

      updateUser: (updates: Partial<AuthUser>) =>
        set((state: AuthState) => {
          if (!state.user) {
            return {};
          }

          return {
            user: {
              ...state.user,
              ...updates,
            },
          };
        }),

      markHydrated: () =>
        set({
          isHydrated: true,
        }),

      resetAuth: () =>
        set({
          ...initialState,
          isHydrated: true,
        }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state: AuthState) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        status: state.status,
      }),
      onRehydrateStorage: () => (state?: AuthState, error?: unknown) => {
        if (error) {
          state?.resetAuth();
          return;
        }

        state?.markHydrated();
      },
    },
  ),
);

export default useAuthStore;