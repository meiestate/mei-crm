import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type ForgotPasswordPageProps = {
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

export default function ForgotPasswordPage({
  mode,
}: ForgotPasswordPageProps) {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 480,
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

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const rawUsers = localStorage.getItem("mei_crm_users");
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];

      const existingUser = users.find(
        (user) => user.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!existingUser) {
        setError("No account found with this email address");
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem(
        "mei_crm_reset_request",
        JSON.stringify({
          email: email.trim().toLowerCase(),
          requestedAt: new Date().toISOString(),
        })
      );

      setSuccessMessage(
        "Reset request verified. Redirecting to reset password page..."
      );
      setError("");
      setEmail("");

      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Something went wrong. Please try again.");
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
            Forgot Password
          </div>

          <div
            style={{
              color: theme.textSecondary,
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Enter your registered email address. We’ll help you reset your
            password and get back into <strong>MEI CRM</strong>.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              style={inputStyle}
            />
            {error && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: 12,
                  marginTop: 6,
                }}
              >
                {error}
              </div>
            )}
          </div>

          {successMessage && (
            <div
              style={{
                marginBottom: 16,
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
            {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
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
          This is currently a demo reset flow using localStorage. Later we can
          connect real email reset with Supabase / Firebase / backend API.
        </div>
      </div>
    </div>
  );
}