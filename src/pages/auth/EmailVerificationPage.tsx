import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type EmailVerificationPageProps = {
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
  isVerified?: boolean;
};

type PendingVerification = {
  email: string;
  requestedAt: string;
};

export default function EmailVerificationPage({
  mode,
}: EmailVerificationPageProps) {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    try {
      const rawPending = localStorage.getItem("mei_crm_pending_verification");
      const pending: PendingVerification | null = rawPending
        ? JSON.parse(rawPending)
        : null;

      if (pending?.email) {
        setEmail(pending.email);
        return;
      }

      const rawCurrentUser = localStorage.getItem("mei_crm_current_user");
      const currentUser = rawCurrentUser ? JSON.parse(rawCurrentUser) : null;

      if (currentUser?.email) {
        setEmail(currentUser.email);
        return;
      }

      setError("Verification session not found. Please sign up again.");
    } catch (err) {
      console.error("Failed to load verification session:", err);
      setError("Something went wrong while loading verification details.");
    }
  }, []);

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 520,
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: 20,
    boxShadow:
      mode === "dark"
        ? "0 18px 50px rgba(0,0,0,0.35)"
        : "0 18px 40px rgba(15, 23, 42, 0.08)",
    padding: 28,
  };

  const helperTextStyle: React.CSSProperties = {
    fontSize: 12,
    color: theme.textSecondary,
    lineHeight: 1.6,
  };

  const buttonBaseStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "0.2s ease",
  };

  const handleResend = () => {
    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    try {
      setIsResending(true);
      setError("");
      setSuccessMessage("");

      localStorage.setItem(
        "mei_crm_pending_verification",
        JSON.stringify({
          email,
          requestedAt: new Date().toISOString(),
        })
      );

      setSuccessMessage(
        "Verification email sent again successfully. Please check your inbox. (Demo mode)"
      );
    } catch (err) {
      console.error("Resend verification failed:", err);
      setError("Unable to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  const handleMarkVerified = () => {
    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    try {
      setIsVerifying(true);
      setError("");
      setSuccessMessage("");

      const rawUsers = localStorage.getItem("mei_crm_users");
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];

      const updatedUsers = users.map((user) =>
        user.email.toLowerCase() === email.toLowerCase()
          ? { ...user, isVerified: true }
          : user
      );

      const userExists = updatedUsers.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (!userExists) {
        setError("User account not found. Please sign up again.");
        setIsVerifying(false);
        return;
      }

      localStorage.setItem("mei_crm_users", JSON.stringify(updatedUsers));
      localStorage.removeItem("mei_crm_pending_verification");

      setSuccessMessage(
        "Email verified successfully. Redirecting to login page..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Email verification failed:", err);
      setError("Something went wrong while verifying email.");
    } finally {
      setIsVerifying(false);
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
            Verify Your Email
          </div>

          <div
            style={{
              color: theme.textSecondary,
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            We sent a verification link to your registered email address. Please
            verify your account before logging into <strong>MEI CRM</strong>.
          </div>
        </div>

        <div
          style={{
            marginBottom: 18,
            padding: "14px 16px",
            borderRadius: 12,
            background: theme.mode === "dark" ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.08)",
            border: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: theme.textSecondary,
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            Registered Email
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: theme.text,
              wordBreak: "break-word",
            }}
          >
            {email || "No email found"}
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#ef4444",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {error}
          </div>
        )}

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

        <div style={{ display: "grid", gap: 12 }}>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            style={{
              ...buttonBaseStyle,
              border: `1px solid ${theme.border}`,
              background: theme.card,
              color: theme.text,
              opacity: isResending ? 0.7 : 1,
              cursor: isResending ? "not-allowed" : "pointer",
            }}
          >
            {isResending ? "Resending..." : "Resend Verification Email"}
          </button>

          <button
            type="button"
            onClick={handleMarkVerified}
            disabled={isVerifying}
            style={{
              ...buttonBaseStyle,
              border: "none",
              background: theme.primary,
              color: "#fff",
              opacity: isVerifying ? 0.7 : 1,
              cursor: isVerifying ? "not-allowed" : "pointer",
            }}
          >
            {isVerifying ? "Verifying..." : "I Have Verified"}
          </button>
        </div>

        <div style={{ marginTop: 18, textAlign: "center" }}>
          <Link
            to="/signup"
            style={{
              color: theme.primary,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Change Email / Sign Up Again
          </Link>
        </div>

        <div style={{ marginTop: 18, ...helperTextStyle, textAlign: "center" }}>
          Demo mode: this page simulates email verification using localStorage.
          Later we can connect real verification links with Supabase, Firebase,
          or your backend API.
        </div>
      </div>
    </div>
  );
}