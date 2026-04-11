import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type WorkspacePlan = "free" | "starter" | "growth" | "enterprise";
export type WorkspaceStatus = "active" | "inactive" | "suspended";
export type CurrencyCode = "INR" | "USD" | "AED" | "EUR";
export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
export type TimeFormat = "12h" | "24h";

export type WorkspaceAddress = {
  line1?: string;
  line2?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

export type WorkspaceBranding = {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  accentColor?: string;
};

export type WorkspaceProfile = {
  id: string;
  name: string;
  slug: string;
  legalName?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  plan: WorkspacePlan;
  status: WorkspaceStatus;
  currency: CurrencyCode;
  timezone: string;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  address?: WorkspaceAddress;
  branding?: WorkspaceBranding;
  taxId?: string;
  gstNumber?: string;
};

export type WorkspaceFeatureFlags = {
  leads: boolean;
  contacts: boolean;
  deals: boolean;
  tasks: boolean;
  calls: boolean;
  billing: boolean;
  automation: boolean;
  reports: boolean;
  integrations: boolean;
  auditLogs: boolean;
};

export type WorkspacePreferences = {
  defaultLeadOwnerId?: string;
  defaultCity?: string;
  defaultCountry?: string;
  defaultLanguage?: string;
  allowTeamInvites: boolean;
  requireTwoFactorForAdmins: boolean;
  autoAssignNewLeads: boolean;
  enableActivityTracking: boolean;
};

type WorkspaceState = {
  currentWorkspace: WorkspaceProfile | null;
  availableWorkspaces: WorkspaceProfile[];
  featureFlags: WorkspaceFeatureFlags;
  preferences: WorkspacePreferences;

  selectedBranchId: string | null;
  selectedTeamId: string | null;

  onboardingCompleted: boolean;
  isWorkspaceHydrated: boolean;

  setCurrentWorkspace: (workspace: WorkspaceProfile | null) => void;
  setAvailableWorkspaces: (workspaces: WorkspaceProfile[]) => void;
  addWorkspace: (workspace: WorkspaceProfile) => void;
  updateWorkspace: (
    workspaceId: string,
    updates: Partial<WorkspaceProfile>,
  ) => void;
  removeWorkspace: (workspaceId: string) => void;

  setFeatureFlags: (flags: Partial<WorkspaceFeatureFlags>) => void;
  resetFeatureFlags: () => void;

  setPreferences: (updates: Partial<WorkspacePreferences>) => void;
  resetPreferences: () => void;

  setSelectedBranchId: (branchId: string | null) => void;
  setSelectedTeamId: (teamId: string | null) => void;

  setOnboardingCompleted: (value: boolean) => void;
  markWorkspaceHydrated: () => void;
  resetWorkspaceStore: () => void;
};

type WorkspacePersistedState = Pick<
  WorkspaceState,
  | "currentWorkspace"
  | "availableWorkspaces"
  | "featureFlags"
  | "preferences"
  | "selectedBranchId"
  | "selectedTeamId"
  | "onboardingCompleted"
>;

export const WORKSPACE_STORAGE_KEY = "mei-crm-workspace";

const defaultFeatureFlags: WorkspaceFeatureFlags = {
  leads: true,
  contacts: true,
  deals: true,
  tasks: true,
  calls: true,
  billing: true,
  automation: false,
  reports: true,
  integrations: false,
  auditLogs: true,
};

const defaultPreferences: WorkspacePreferences = {
  defaultLeadOwnerId: undefined,
  defaultCity: "Chennai",
  defaultCountry: "India",
  defaultLanguage: "en",
  allowTeamInvites: true,
  requireTwoFactorForAdmins: false,
  autoAssignNewLeads: false,
  enableActivityTracking: true,
};

const defaultWorkspace: WorkspaceProfile = {
  id: "workspace-1",
  name: "MEI CRM",
  slug: "mei-crm",
  legalName: "MEI Business OS",
  email: "admin@mei.local",
  phone: "+91 00000 00000",
  website: "https://mei.local",
  industry: "Real Estate",
  plan: "growth",
  status: "active",
  currency: "INR",
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12h",
  address: {
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
  },
  branding: {
    primaryColor: "#2563eb",
    accentColor: "#0f172a",
  },
  gstNumber: "",
};

const initialState: Omit<
  WorkspaceState,
  | "setCurrentWorkspace"
  | "setAvailableWorkspaces"
  | "addWorkspace"
  | "updateWorkspace"
  | "removeWorkspace"
  | "setFeatureFlags"
  | "resetFeatureFlags"
  | "setPreferences"
  | "resetPreferences"
  | "setSelectedBranchId"
  | "setSelectedTeamId"
  | "setOnboardingCompleted"
  | "markWorkspaceHydrated"
  | "resetWorkspaceStore"
> = {
  currentWorkspace: defaultWorkspace,
  availableWorkspaces: [defaultWorkspace],
  featureFlags: defaultFeatureFlags,
  preferences: defaultPreferences,
  selectedBranchId: null,
  selectedTeamId: null,
  onboardingCompleted: false,
  isWorkspaceHydrated: false,
};

const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentWorkspace: (workspace: WorkspaceProfile | null) => {
        set({ currentWorkspace: workspace });
      },

      setAvailableWorkspaces: (workspaces: WorkspaceProfile[]) => {
        set({ availableWorkspaces: workspaces });
      },

      addWorkspace: (workspace: WorkspaceProfile) => {
        set((state: WorkspaceState) => ({
          availableWorkspaces: [
            ...state.availableWorkspaces.filter(
              (item) => item.id !== workspace.id,
            ),
            workspace,
          ],
        }));
      },

      updateWorkspace: (
        workspaceId: string,
        updates: Partial<WorkspaceProfile>,
      ) => {
        set((state: WorkspaceState) => {
          const updatedWorkspaces = state.availableWorkspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  ...updates,
                  address: {
                    ...workspace.address,
                    ...updates.address,
                  },
                  branding: {
                    ...workspace.branding,
                    ...updates.branding,
                  },
                }
              : workspace,
          );

          const nextCurrentWorkspace =
            state.currentWorkspace?.id === workspaceId
              ? updatedWorkspaces.find((workspace) => workspace.id === workspaceId) ??
                state.currentWorkspace
              : state.currentWorkspace;

          return {
            availableWorkspaces: updatedWorkspaces,
            currentWorkspace: nextCurrentWorkspace,
          };
        });
      },

      removeWorkspace: (workspaceId: string) => {
        set((state: WorkspaceState) => {
          const filteredWorkspaces = state.availableWorkspaces.filter(
            (workspace) => workspace.id !== workspaceId,
          );

          const nextCurrentWorkspace =
            state.currentWorkspace?.id === workspaceId
              ? filteredWorkspaces[0] ?? null
              : state.currentWorkspace;

          return {
            availableWorkspaces: filteredWorkspaces,
            currentWorkspace: nextCurrentWorkspace,
          };
        });
      },

      setFeatureFlags: (flags: Partial<WorkspaceFeatureFlags>) => {
        set((state: WorkspaceState) => ({
          featureFlags: {
            ...state.featureFlags,
            ...flags,
          },
        }));
      },

      resetFeatureFlags: () => {
        set({ featureFlags: defaultFeatureFlags });
      },

      setPreferences: (updates: Partial<WorkspacePreferences>) => {
        set((state: WorkspaceState) => ({
          preferences: {
            ...state.preferences,
            ...updates,
          },
        }));
      },

      resetPreferences: () => {
        set({ preferences: defaultPreferences });
      },

      setSelectedBranchId: (branchId: string | null) => {
        set({ selectedBranchId: branchId });
      },

      setSelectedTeamId: (teamId: string | null) => {
        set({ selectedTeamId: teamId });
      },

      setOnboardingCompleted: (value: boolean) => {
        set({ onboardingCompleted: value });
      },

      markWorkspaceHydrated: () => {
        set({ isWorkspaceHydrated: true });
      },

      resetWorkspaceStore: () => {
        set({
          ...initialState,
          isWorkspaceHydrated: true,
        });
      },
    }),
    {
      name: WORKSPACE_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state: WorkspaceState): WorkspacePersistedState => ({
        currentWorkspace: state.currentWorkspace,
        availableWorkspaces: state.availableWorkspaces,
        featureFlags: state.featureFlags,
        preferences: state.preferences,
        selectedBranchId: state.selectedBranchId,
        selectedTeamId: state.selectedTeamId,
        onboardingCompleted: state.onboardingCompleted,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          state?.resetWorkspaceStore();
          return;
        }

        state?.markWorkspaceHydrated();
      },
    },
  ),
);

export default useWorkspaceStore;