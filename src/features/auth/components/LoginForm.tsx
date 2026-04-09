import { useState, type FormEvent } from "react";
import Card from "./Card";
import Input from "./Input";
import Checkbox from "./Checkbox";
import Button from "./Button";

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type LoginFormProps = {
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string;
  defaultValues?: Partial<LoginFormValues>;
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
};

export default function LoginForm({
  title = "Welcome back",
  subtitle = "Login to continue to your account",
  loading = false,
  error,
  defaultValues,
  onSubmit,
  onForgotPassword,
  onCreateAccount,
}: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({
    email: defaultValues?.email || "",
    password: defaultValues?.password || "",
    rememberMe: defaultValues?.rememberMe || false,
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [localError, setLocalError] = useState("");

  const emailError =
    touched.email && !values.email.trim()
      ? "Email is required"
      : touched.email &&
        values.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
      ? "Enter a valid email address"
      : "";

  const passwordError =
    touched.password && !values.password.trim()
      ? "Password is required"
      : "";

  const handleChange = <K extends keyof LoginFormValues>(
    key: K,
    value: LoginFormValues[K]
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    setLocalError("");

    const isEmailValid =
      values.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());
    const isPasswordValid = Boolean(values.password.trim());

    if (!isEmailValid || !isPasswordValid) {
      setLocalError("Please fill in the required fields correctly.");
      return;
    }

    await onSubmit({
      email: values.email.trim(),
      password: values.password,
      rememberMe: values.rememberMe,
    });
  };

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: 440,
        margin: "0 auto",
      }}
      bodyStyle={{
        padding: 28,
      }}
    >
      <div
        style={{
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.2,
            letterSpacing: -0.4,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() =>
              setTouched((prev) => ({
                ...prev,
                email: true,
              }))
            }
            error={emailError}
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() =>
              setTouched((prev) => ({
                ...prev,
                password: true,
              }))
            }
            error={passwordError}
            autoComplete="current-password"
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Checkbox
              id="rememberMe"
              label="Remember me"
              checked={values.rememberMe}
              onChange={(e) => handleChange("rememberMe", e.target.checked)}
            />

            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  color: "#2563eb",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </button>
            )}
          </div>

          {(error || localError) && (
            <div
              style={{
                borderRadius: 14,
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#b91c1c",
                padding: "12px 14px",
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {error || localError}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg">
            Sign In
          </Button>
        </div>
      </form>

      {onCreateAccount && (
        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: "1px solid #e2e8f0",
            textAlign: "center",
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onCreateAccount}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              color: "#2563eb",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Create account
          </button>
        </div>
      )}
    </Card>
  );
}