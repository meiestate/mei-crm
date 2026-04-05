import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type LoginPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
  onLoginSuccess: () => void;
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

export default function LoginPage({
  mode,
  onToggleTheme,
  onLoginSuccess,
}: LoginPageProps) {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
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

  const clearError = (field: "email" | "password" | "general") => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: {
      email?: string;
      password?: string;
      general?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const rawUsers = localStorage.getItem("mei_crm_users");
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];

      const matchedUser = users.find(
        (user) =>
          user.email.toLowerCase() === email.trim().toLowerCase() &&
          user.password === password
      );

      if (!matchedUser) {
        setErrors({
          general: "Invalid email or password",
        });
        setIsSubmitting(false);
        return;
      }

      const currentUser = {
        id: matchedUser.id,
        fullName: matchedUser.fullName,
        email: matchedUser.email,
        company: matchedUser.company,
        phone: matchedUser.phone,
      };

      localStorage.setItem("mei_crm_current_user", JSON.stringify(currentUser));
      localStorage.setItem("mei_crm_is_authenticated", "true");

      if (rememberMe) {
        localStorage.setItem("mei_crm_remembered_email", matchedUser.email);
      } else {
        localStorage.removeItem("mei_crm_remembered_email");
      }

      onLoginSuccess();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({
        general: "Something went wrong while logging in.",
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
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: theme.text,
                marginBottom: 8,
                letterSpacing: 0.3,
              }}
            >
              Welcome Back
            </div>

            <div
              style={{
                color: theme.textSecondary,
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              Login to <strong>MEI CRM</strong> and continue managing your leads,
              pipeline, tasks, and growth from one clean workspace.
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.card,
              color: theme.text,
              borderRadius: 12,
              padding: "10px 12px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 12,
              whiteSpace: "nowrap",
            }}
          >
            {mode === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                  clearError("general");
                }}
                style={inputStyle}
              />
              {errors.email && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: 12,
                    marginTop: 6,
                  }}
                >
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                    clearError("general");
                  }}
                  style={{ ...inputStyle, paddingRight: 90 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
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
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: 12,
                    marginTop: 6,
                  }}
                >
                  {errors.password}
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: theme.textSecondary,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              style={{
                color: theme.primary,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
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
            {isSubmitting ? "Signing In..." : "Login"}
          </button>
        </form>

        <div
          style={{
            marginTop: 18,
            textAlign: "center",
            fontSize: 13,
            color: theme.textSecondary,
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: theme.primary,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Create Account
          </Link>
        </div>

        <div
          style={{
            marginTop: 18,
            ...helperTextStyle,
            textAlign: "center",
          }}
        >
          Demo mode: login checks your account from localStorage. Later we can
          connect secure authentication using Supabase or your backend API.
        </div>
      </div>
    </div>
  );
}