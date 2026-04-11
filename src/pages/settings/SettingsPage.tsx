// src/pages/settings/SettingsPage.tsx

import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../../layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";


type SettingsPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

const settingsNavItems = [
  {
    label: "Company",
    path: "/settings/company",
    description: "Brand, company info, and business identity",
  },
  {
    label: "Workspace",
    path: "/settings/workspace",
    description: "Workspace preferences and default behavior",
  },
  {
    label: "Team Roles",
    path: "/settings/team-roles",
    description: "Roles, permissions, and user access control",
  },
  {
    label: "Pipelines",
    path: "/settings/pipelines",
    description: "Deal and lead pipeline configuration",
  },
  {
    label: "Lead Sources",
    path: "/settings/lead-sources",
    description: "Manage source channels and attribution",
  },
  {
    label: "Notifications",
    path: "/settings/notifications",
    description: "Alerts, reminders, and activity updates",
  },
  {
    label: "Security",
    path: "/settings/security",
    description: "Authentication, sessions, and protection",
  },
  {
    label: "Billing",
    path: "/settings/billing",
    description: "Plan, invoices, seats, and subscription",
  },
  {
    label: "Integrations",
    path: "/settings/integrations",
    description: "External apps, API hooks, and sync tools",
  },
  {
    label: "Data Backup",
    path: "/settings/data-backup",
    description: "Exports, restore points, and backup controls",
  },
  {
    label: "Audit Logs",
    path: "/settings/audit-logs",
    description: "System history, admin activity, and logs",
  },
] as const;

export default function SettingsPage({
  mode,
  onToggleTheme,
}: SettingsPageProps) {
  const colors = getTheme(mode);
  const navigate = useNavigate();
  const location = useLocation();

  const activeItem =
    settingsNavItems.find((item) => location.pathname.startsWith(item.path)) ??
    settingsNavItems[0];

  const handleLogout = () => {
    try {
      localStorage.removeItem("mei-crm-auth");
      sessionStorage.removeItem("mei-crm-auth");
      localStorage.removeItem("mei_crm_current_user");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Something went wrong while logging out.");
    }
  };

  return (
    <AppLayout title="Settings" mode={mode} onToggleTheme={onToggleTheme}>
      <div style={{ display: "grid", gap: 20 }}>
        <HeaderSection colors={colors} activeLabel={activeItem.label} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px minmax(0, 1fr)",
            gap: 20,
            alignItems: "start",
          }}
        >
          <aside
            style={{
              display: "grid",
              gap: 16,
              position: "sticky",
              top: 20,
            }}
          >
            <SectionCard title="Settings Menu" colors={colors}>
              <div style={{ display: "grid", gap: 10 }}>
                {settingsNavItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <div
                        style={{
                          border: `1px solid ${
                            isActive ? colors.primary : colors.border
                          }`,
                          background: isActive
                            ? colors.cardBgSoft
                            : colors.cardBg,
                          borderRadius: 16,
                          padding: 14,
                          display: "grid",
                          gap: 6,
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                          }}
                        >
                          <span
                            style={{
                              color: isActive ? colors.primary : colors.text,
                              fontWeight: 800,
                              fontSize: 15,
                            }}
                          >
                            {item.label}
                          </span>

                          {isActive ? (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 800,
                                padding: "5px 8px",
                                borderRadius: 999,
                                background: colors.primary,
                                color: "#ffffff",
                              }}
                            >
                              OPEN
                            </span>
                          ) : null}
                        </div>

                        <span
                          style={{
                            color: colors.subText,
                            fontSize: 12.5,
                            lineHeight: 1.45,
                          }}
                        >
                          {item.description}
                        </span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="Appearance" colors={colors}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <AppearanceCard
                  title="Light"
                  description="Bright and clean"
                  active={mode === "light"}
                  colors={colors}
                />
                <AppearanceCard
                  title="Dark Navy"
                  description="Premium dark UI"
                  active={mode === "dark"}
                  colors={colors}
                />
              </div>

              <button
                onClick={onToggleTheme}
                style={{
                  border: "none",
                  background: colors.primary,
                  color: "#ffffff",
                  padding: "12px 16px",
                  borderRadius: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Toggle Theme
              </button>
            </SectionCard>

            <SectionCard title="Account Actions" colors={colors}>
              <div
                style={{
                  color: colors.subText,
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                Sign out safely from the current workspace session.
              </div>

              <button
                onClick={handleLogout}
                style={{
                  border: `1px solid ${colors.danger}`,
                  background: colors.dangerBg,
                  color: colors.danger,
                  padding: "12px 16px",
                  borderRadius: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  justifySelf: "start",
                }}
              >
                Logout
              </button>
            </SectionCard>
          </aside>

          <main
            style={{
              minWidth: 0,
              display: "grid",
              gap: 20,
            }}
          >
            <SectionCard title={`${activeItem.label} Settings`} colors={colors}>
              <div
                style={{
                  color: colors.subText,
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                Open and manage your <strong style={{ color: colors.text }}>
                  {activeItem.label}
                </strong>{" "}
                configuration from this panel.
              </div>
            </SectionCard>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}

function HeaderSection({
  colors,
  activeLabel,
}: {
  colors: ReturnType<typeof getTheme>;
  activeLabel: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 30,
              color: colors.text,
              lineHeight: 1.1,
            }}
          >
            Settings
          </h2>

          <p
            style={{
              margin: 0,
              color: colors.subText,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Manage workspace controls, preferences, team access, security, and
            system-level configuration.
          </p>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: 999,
            border: `1px solid ${colors.border}`,
            background: colors.cardBg,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: colors.primary,
              display: "inline-block",
            }}
          />
          <span
            style={{
              color: colors.text,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Current Section: {activeLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  colors,
  children,
}: {
  title: string;
  colors: ReturnType<typeof getTheme>;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 20,
        padding: 24,
        boxShadow: colors.shadowSoft,
        display: "grid",
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: colors.text,
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>

      {children}
    </div>
  );
}

function AppearanceCard({
  title,
  description,
  active,
  colors,
}: {
  title: string;
  description: string;
  active: boolean;
  colors: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        border: `1px solid ${active ? colors.primary : colors.border}`,
        background: active ? colors.cardBgSoft : colors.cardBg,
        borderRadius: 16,
        padding: 14,
        display: "grid",
        gap: 8,
      }}
    >
      <div
        style={{
          color: colors.text,
          fontSize: 15,
          fontWeight: 800,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: colors.subText,
          fontSize: 12.5,
          lineHeight: 1.45,
        }}
      >
        {description}
      </div>

      <span
        style={{
          display: "inline-block",
          width: "fit-content",
          padding: "5px 9px",
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 800,
          color: "#ffffff",
          background: active ? colors.primary : colors.subText,
        }}
      >
        {active ? "Active" : "Available"}
      </span>
    </div>
  );
}