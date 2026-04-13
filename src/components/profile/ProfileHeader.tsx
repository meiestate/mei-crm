import type { CSSProperties } from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

type ProfileHeaderProps = {
  mode?: ThemeMode;
  title?: string;
  subtitle?: string;
  breadcrumb?: string;
  onUploadPhoto?: () => void;
  onChangePassword?: () => void;
  onEditProfile?: () => void;
  uploadPhotoLabel?: string;
  changePasswordLabel?: string;
  editProfileLabel?: string;
};

export default function ProfileHeader({
  mode = "light",
  title = "My Profile",
  subtitle = "Manage your identity, work details, permissions, security, and preferences from one place.",
  breadcrumb = "Settings / Profile",
  onUploadPhoto,
  onChangePassword,
  onEditProfile,
  uploadPhotoLabel = "Upload Photo",
  changePasswordLabel = "Change Password",
  editProfileLabel = "Edit Profile",
}: ProfileHeaderProps) {
  const theme = getTheme(mode);

  const wrapperStyle: CSSProperties = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 20,
    boxShadow:
      mode === "dark"
        ? "0 10px 30px rgba(0,0,0,0.28)"
        : "0 10px 30px rgba(15, 23, 42, 0.08)",
    padding: 24,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  };

  const breadcrumbStyle: CSSProperties = {
    margin: 0,
    color: theme.primary,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  };

  const titleStyle: CSSProperties = {
    margin: "8px 0 0",
    color: theme.text,
    fontSize: 30,
    fontWeight: 900,
    lineHeight: 1.2,
  };

  const subtitleStyle: CSSProperties = {
    margin: "10px 0 0",
    color: theme.subText,
    fontSize: 15,
    lineHeight: 1.7,
    maxWidth: 760,
  };

  const actionsWrapStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
    justifyContent: "flex-end",
  };

  const secondaryButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    height: 40,
    padding: "0 14px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const primaryButtonStyle: CSSProperties = {
    ...secondaryButtonStyle,
    background: theme.primary,
    border: `1px solid ${theme.primary}`,
    color: theme.inverseText,
  };

  return (
    <section style={wrapperStyle}>
      <div style={{ minWidth: 0, flex: "1 1 420px" }}>
        <p style={breadcrumbStyle}>{breadcrumb}</p>
        <h1 style={titleStyle}>{title}</h1>
        <p style={subtitleStyle}>{subtitle}</p>
      </div>

      <div style={actionsWrapStyle}>
        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={onUploadPhoto}
        >
          {uploadPhotoLabel}
        </button>

        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={onChangePassword}
        >
          {changePasswordLabel}
        </button>

        <button
          type="button"
          style={primaryButtonStyle}
          onClick={onEditProfile}
        >
          {editProfileLabel}
        </button>
      </div>
    </section>
  );
}