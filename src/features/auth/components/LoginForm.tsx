import { useState, type ChangeEvent, type FormEvent } from "react";

type ThemeMode = "light" | "dark";

export type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type LoginFormProps = {
  mode?: ThemeMode;
  isLoading?: boolean;
  errorMessage?: string;
  defaultValues?: Partial<LoginFormValues>;
  onSubmit?: (values: LoginFormValues) => void | Promise<void>;
  onForgotPassword?: () => void;
  onUseOtpLogin?: () => void;
};

export default function LoginForm({
  mode = "light",
  isLoading = false,
  errorMessage,
  defaultValues,
  onSubmit,
  onForgotPassword,
  onUseOtpLogin,
}: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({
    email: defaultValues?.email ?? "",
    password: defaultValues?.password ?? "",
    rememberMe: defaultValues?.rememberMe ?? false,
  });

  const [touched, setTouched] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false,
  });

  const isDark = mode === "dark";

  const theme = {
    pageBg: isDark ? "#020617" : "#f8fafc",
    cardBg: isDark ? "#0f172a" : "#ffffff",
    cardSoft: isDark ? "#111827" : "#f8fafc",
    text: isDark ? "#e5e7eb" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "rgba(148,163,184,0.18)" : "rgba(15,23,42,0.10)",
    inputBg: isDark ? "#111827" : "#ffffff",
    inputBorder: isDark ? "rgba(148,163,184,0.20)" : "rgba(15,23,42,0.12)",
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    dangerBg: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)",
    dangerText: isDark ? "#fca5a5" : "#b91c1c",
  };

  const emailError =
    touched.email && values.email.trim().length === 0
      ? "Email is required."
      : touched.email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
        ? "Enter a valid email address."
        : "";

  const passwordError =
    touched.password && values.password.trim().length === 0
      ? "Password is required."
      : touched.password && values.password.trim().length < 6
        ? "Password must be at least 6 characters."
        : "";

  const hasValidationError = Boolean(emailError || passwordError);

  const updateField = (
    field: keyof LoginFormValues,
    value: string | boolean,
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateField("email", event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateField("password", event.target.value);
  };

  const handleRememberMeChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateField("rememberMe", event.target.checked);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    const email = values.email.trim();
    const password = values.password.trim();

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 6;

    if (!email || !password || !isEmailValid || !isPasswordValid) {
      return;
    }

    await onSubmit?.({
      email,
      password,
      rememberMe: values.rememberMe,
    });
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        padding: 28,
        boxShadow: isDark
          ? "0 22px 48px rgba(0,0,0,0.34)"
          : "0 18px 40px rgba(15,23,42,0.08)",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: theme.text,
          }}
        >
          Welcome back
        </h2>

        <p
          style={{
            margin: "10px 0 0",
            fontSize: 14,
            lineHeight: 1.7,
            color: theme.subText,
          }}
        >
          Sign in to continue managing leads, deals, tasks, and your team from
          one clean workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "grid", gap: 18 }}>
          <div>
            <label
              htmlFor="login-email"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: theme.text,
              }}
            >
              Email
            </label>

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleEmailChange}
              onBlur={() =>
                setTouched((prev) => ({
                  ...prev,
                  email: true,
                }))
              }
              placeholder="Enter your email"
              style={{
                width: "100%",
                height: 48,
                borderRadius: 14,
                border: `1px solid ${emailError ? "#ef4444" : theme.inputBorder}`,
                background: theme.inputBg,
                color: theme.text,
                padding: "0 14px",
                outline: "none",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />

            {emailError ? (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: "#ef4444",
                }}
              >
                {emailError}
              </div>
            ) : null}
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <label
                htmlFor="login-password"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: theme.text,
                }}
              >
                Password
              </label>

              <button
                type="button"
                onClick={onForgotPassword}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: theme.primary,
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </button>
            </div>

            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={handlePasswordChange}
              onBlur={() =>
                setTouched((prev) => ({
                  ...prev,
                  password: true,
                }))
              }
              placeholder="Enter your password"
              style={{
                width: "100%",
                height: 48,
                borderRadius: 14,
                border: `1px solid ${passwordError ? "#ef4444" : theme.inputBorder}`,
                background: theme.inputBg,
                color: theme.text,
                padding: "0 14px",
                outline: "none",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />

            {passwordError ? (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: "#ef4444",
                }}
              >
                {passwordError}
              </div>
            ) : null}
          </div>

          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              userSelect: "none",
              color: theme.subText,
              fontSize: 14,
            }}
          >
            <input
              type="checkbox"
              checked={values.rememberMe}
              onChange={handleRememberMeChange}
              style={{
                width: 16,
                height: 16,
                accentColor: theme.primary,
              }}
            />
            Remember me
          </label>

          {errorMessage ? (
            <div
              style={{
                borderRadius: 14,
                padding: "12px 14px",
                background: theme.dangerBg,
                color: theme.dangerText,
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading || hasValidationError}
            style={{
              height: 48,
              borderRadius: 14,
              border: "none",
              background:
                isLoading || hasValidationError
                  ? "rgba(37,99,235,0.55)"
                  : theme.primary,
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 700,
              cursor:
                isLoading || hasValidationError ? "not-allowed" : "pointer",
              transition: "background 0.2s ease",
            }}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            onClick={onUseOtpLogin}
            style={{
              height: 46,
              borderRadius: 14,
              border: `1px solid ${theme.border}`,
              background: theme.cardSoft,
              color: theme.text,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Use OTP login
          </button>
        </div>
      </form>
    </div>
  );
}