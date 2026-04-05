import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type ResetPasswordPageProps = {
  mode: ThemeMode;
};

type StoredUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  password: string;
  createdAt: string;
};

type ResetRequest = {
  email: string;
  requestedAt: string;
};

export default function ResetPasswordPage({
  mode,
}: ResetPasswordPageProps) {
  const navigate = useNavigate();
  const theme = useMemo(() => getTheme(mode), [mode]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 500,
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: 20,
    boxShadow:
      mode === "dark"
        ? "0 18px 50px rgba(0,0,0,0.35)"
        : "0 18px 40px rgba(15, 23, 42, 0.08)",
    padding: 28,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.inputBg ?? theme.card,
    color: theme.text,
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: theme.textSecondary,
    marginBottom: 8,
  };

  const helperTextStyle: React.CSSProperties = {
    fontSize: 12,
    color: theme.textSecondary,
    lineHeight: 1.6,
  };

  const clearFieldError = (
    field: "newPassword" | "confirmPassword" | "general"
  ) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: {
      newPassword?: string;
      confirmPassword?: string;
      general?: string;
    } = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    const rawResetRequest = localStorage.getItem("mei_crm_reset_request");

    if (!rawResetRequest) {
      newErrors.general =
        "Reset session not found. Please go back and request password reset again.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const rawResetRequest = localStorage.getItem("mei_crm_reset_request");
      const rawUsers = localStorage.getItem("mei_crm_users");

      if (!rawResetRequest) {
        setErrors({
          general:
            "Reset request not available. Please use Forgot Password again.",
        });
        setIsSubmitting(false);
        return;
      }

      const resetRequest: ResetRequest = JSON.parse(rawResetRequest);
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];

      const userIndex = users.findIndex(
        (user) => user.email.toLowerCase() === resetRequest.email.toLowerCase()
      );

      if (userIndex === -1) {
        setErrors({
          general: "User account not found for this reset request.",
        });
        setIsSubmitting(false);
        return;
      }

      const updatedUsers = [...users];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        password: newPassword,
      };

      localStorage.setItem("mei_crm_users", JSON.stringify(updatedUsers));
      localStorage.removeItem("mei_crm_reset_request");

      setSuccessMessage(
        "Your password has been reset successfully. You can now login with your new password."
      );

      setNewPassword("");
      setConfirmPassword("");
      setErrors({});

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Reset password failed:", error);
      setErrors({
        general: "Something went wrong while resetting the password.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.background,
        color: theme.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={cardStyle}>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 8,
              letterSpacing: 0.3,
            }}
          >
            Reset Password
          </div>

          <div
            style={{
              color: theme.textSecondary,
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Create a strong new password for your <strong>MEI CRM</strong>{" "}
            account and step back into your workflow.
          </div>
        </div>

        <form onSubmit={handleResetPassword}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={labelStyle}>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    clearFieldError("newPassword");
                    clearFieldError("general");
                  }}
                  style={{ ...inputStyle, paddingRight: 90 }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 10,
                    border: "none",
                    background: "transparent",
                    color: theme.primary,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.newPassword && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: 12,
                    marginTop: 6,
                  }}
                >
                  {errors.newPassword}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearFieldError("confirmPassword");
                    clearFieldError("general");
                  }}
                  style={{ ...inputStyle, paddingRight: 90 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 10,
                    border: "none",
                    background: "transparent",
                    color: theme.primary,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: 12,
                    marginTop: 6,
                  }}
                >
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {errors.general && (
            <div
              style={{
                marginTop: 16,
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#ef4444",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {errors.general}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                marginTop: 16,
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.25)",
                color: "#22c55e",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              marginTop: 20,
              padding: "13px 16px",
              borderRadius: 12,
              border: "none",
              background: theme.primary,
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <div style={{ marginTop: 18, textAlign: "center" }}>
          <Link
            to="/login"
            style={{
              color: theme.primary,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Back to Login
          </Link>
        </div>

        <div style={{ marginTop: 18, ...helperTextStyle, textAlign: "center" }}>
          Demo mode: this screen updates password inside localStorage. Later we
          can connect secure token-based reset with Supabase or your backend API.
        </div>
      </div>
    </div>
  );
}