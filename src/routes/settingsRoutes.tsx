// src/routes/settingsRoutes.tsx

import { Navigate, type RouteObject } from "react-router-dom";
import type { ThemeMode } from "../theme";

import SettingsPage from "../pages/settings/SettingsPage";
import BillingSubscriptionPage from "../pages/settings/BillingSubscriptionPage";
import RolesPage from "../pages/settings/RolesPage";
import UsersPage from "../pages/settings/UsersPage";

type CreateSettingsRoutesProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

export function createSettingsRoutes({
  mode,
  onToggleTheme,
}: CreateSettingsRoutesProps): RouteObject[] {
  return [
    {
      path: "/settings",
      element: <SettingsPage mode={mode} onToggleTheme={onToggleTheme} />,
      children: [
        {
          index: true,
          element: <Navigate to="users" replace />,
        },
        {
          path: "company",
          element: (
            <SettingsSectionPlaceholder
              title="Company Settings"
              description="Add company profile, brand identity, office details, GST, and business configuration here."
            />
          ),
        },
        {
          path: "workspace",
          element: (
            <SettingsSectionPlaceholder
              title="Workspace Preferences"
              description="Manage workspace defaults, regional formats, timezone behavior, and productivity preferences here."
            />
          ),
        },
        {
          path: "team-roles",
          element: <RolesPage mode={mode} onToggleTheme={onToggleTheme} />,
        },
        {
          path: "users",
          element: <UsersPage mode={mode} onToggleTheme={onToggleTheme} />,
        },
        {
          path: "pipelines",
          element: (
            <SettingsSectionPlaceholder
              title="Pipelines"
              description="Configure lead stages, deal stages, probability, color tags, and workflow logic here."
            />
          ),
        },
        {
          path: "lead-sources",
          element: (
            <SettingsSectionPlaceholder
              title="Lead Sources"
              description="Manage campaign sources, inbound channels, tracking labels, and attribution source lists here."
            />
          ),
        },
        {
          path: "notifications",
          element: (
            <SettingsSectionPlaceholder
              title="Notifications"
              description="Control email alerts, reminders, follow-up notices, and team notification preferences here."
            />
          ),
        },
        {
          path: "security",
          element: (
            <SettingsSectionPlaceholder
              title="Security"
              description="Manage login alerts, session timeout, password rules, and two-factor authentication here."
            />
          ),
        },
        {
          path: "billing",
          element: (
            <BillingSubscriptionPage
              mode={mode}
              onToggleTheme={onToggleTheme}
            />
          ),
        },
        {
          path: "integrations",
          element: (
            <SettingsSectionPlaceholder
              title="Integrations"
              description="Connect APIs, WhatsApp tools, email services, lead forms, and external platforms here."
            />
          ),
        },
        {
          path: "data-backup",
          element: (
            <SettingsSectionPlaceholder
              title="Data Backup"
              description="Manage export, backup history, restore points, and long-term data protection settings here."
            />
          ),
        },
        {
          path: "audit-logs",
          element: (
            <SettingsSectionPlaceholder
              title="Audit Logs"
              description="Review admin changes, user activity, permission edits, and system actions here."
            />
          ),
        },
        {
          path: "*",
          element: <Navigate to="/settings/users" replace />,
        },
      ],
    },
  ];
}

type SettingsSectionPlaceholderProps = {
  title: string;
  description: string;
};

function SettingsSectionPlaceholder({
  title,
  description,
}: SettingsSectionPlaceholderProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 20,
        padding: 24,
        display: "grid",
        gap: 12,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 800,
          color: "#111827",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.7,
          color: "#6b7280",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default createSettingsRoutes;