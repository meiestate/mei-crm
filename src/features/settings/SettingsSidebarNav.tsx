import type { CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type SettingsSectionKey =
  | "profile"
  | "company"
  | "preferences"
  | "team"
  | "pipelines"
  | "sources"
  | "notifications"
  | "security"
  | "billing"
  | "integrations"
  | "data"
  | "audit";

export type SettingsSectionItem = {
  key: SettingsSectionKey;
  label: string;
  description: string;
};

type SettingsSidebarNavProps = {
  mode?: ThemeMode;
  sections: SettingsSectionItem[];
  activeSection: SettingsSectionKey;
  onSectionChange: (section: SettingsSectionKey) => void;
};

export default function SettingsSidebarNav({
  mode = "light",
  sections,
  activeSection,
  onSectionChange,
}: SettingsSidebarNavProps) {
  const theme = getTheme(mode);

  return (
    <aside
      style={{
        position: "sticky",
        top: 20,
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 14,
        boxShadow:
          mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.22)"
            : "0 10px 30px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: theme.mutedText,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          padding: "8px 10px 14px",
        }}
      >
        Settings Menu
      </div>

      <div style={navListStyle}>
        {sections.map((section) => {
          const isActive = activeSection === section.key;

          return (
            <button
              key={section.key}
              type="button"
              onClick={() => onSectionChange(section.key)}
              style={{
                ...navButtonStyle,
                background: isActive ? theme.navActiveBg : "transparent",
                color: isActive ? theme.navActiveText : theme.text,
                border: `1px solid ${
                  isActive ? theme.primary : theme.borderSoft
                }`,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {section.label}
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: isActive ? theme.navActiveText : theme.subText,
                  opacity: 0.92,
                }}
              >
                {section.description}
              </div>
            </button>
          );
        })}

        {sections.length === 0 && (
          <div
            style={{
              padding: 16,
              borderRadius: 14,
              border: `1px dashed ${theme.border}`,
              color: theme.subText,
              fontSize: 13,
            }}
          >
            No settings sections found.
          </div>
        )}
      </div>
    </aside>
  );
}

const navListStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const navButtonStyle: CSSProperties = {
  textAlign: "left",
  borderRadius: 14,
  padding: "12px 14px",
  cursor: "pointer",
  transition: "0.2s ease",
  width: "100%",
};