import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Moon, Sun } from "lucide-react";
import { getTheme, type ThemeMode } from "../../theme";

type LoginPageProps = {
  mode: ThemeMode;
  onToggleTheme: () => void;
};

type LoginFormState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function LoginPage({
  mode,
  onToggleTheme,
}: LoginPageProps) {
  const navigate = useNavigate();
  const theme = useMemo(() => getTheme(mode), [mode]);

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof LoginFormState,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      general: undefined,
    }));
  };

  const validateForm = () => {
    const nextErrors: LoginErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (form.password.trim().length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const demoEmail = "admin@mei.com";
      const demoPassword = "123456";

      if (
        form.email.trim().toLowerCase() === demoEmail &&
        form.password === demoPassword
      ) {
        const storage = form.rememberMe ? localStorage : sessionStorage;

        storage.setItem("mei-crm-auth", "true");
        storage.setItem("mei-crm-user", form.email.trim().toLowerCase());

        navigate("/dashboard");
        return;
      }

      setErrors({
        general: "Invalid email or password.",
      });
    } catch (error) {
      setErrors({
        general: "Unable to sign in right now. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        background: theme.pageBg,
      }}
    >
      <div
        style={{
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: `1px solid ${theme.border}`,
          background:
            mode === "dark"
              ? "linear-gradient(135deg, #020617 0%, #0F172A 50%, #111827 100%)"
              : "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 45%, #EEF2FF 100%)",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: theme.radius.pill,
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadowSoft,
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: theme.primary,
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              M
            </div>

            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: theme.text,
                }}
              >
                MEI CRM
              </div>
              <div
                style={{
                  fontSize: theme.typography.bodySm.fontSize,
                  fontWeight: theme.typography.bodySm.fontWeight,
                  lineHeight: theme.typography.bodySm.lineHeight,
                  color: theme.subText,
                }}
              >
                Real Estate Business OS
              </div>
            </div>
          </div>

          <div style={{ marginTop: "56px", maxWidth: "560px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "44px",
                lineHeight: 1.1,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: theme.text,
              }}
            >
              Welcome to a cleaner way to manage your real estate growth.
            </h1>

            <p
              style={{
                marginTop: "18px",
                fontSize: theme.typography.bodyLg.fontSize,
                fontWeight: theme.typography.bodyLg.fontWeight,
                lineHeight: theme.typography.bodyLg.lineHeight,
                color: theme.subText,
              }}
            >
              Track leads, monitor deals, manage follow-ups, and keep your team
              aligned from one powerful workspace.
            </p>
          </div>

          <div
            style={{
              marginTop: "36px",
              display: "grid",
              gap: "14px",
              maxWidth: "500px",
            }}
          >
            {[
              "Lead management built for fast-moving sales teams",
              "Clean dashboards with action-first visibility",
              "Structured pipeline flow for better deal closure",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 16px",
                  borderRadius: theme.radius.lg,
                  background: theme.cardBg,
                  border: `1px solid ${theme.border}`,
                  boxShadow: theme.shadowSoft,
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    background: theme.primary,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: theme.typography.bodyMd.fontSize,
                    fontWeight: 500,
                    lineHeight: theme.typography.bodyMd.lineHeight,
                    color: theme.subText,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            fontSize: theme.typography.bodySm.fontSize,
            color: theme.mutedText,
          }}
        >
          © 2026 MEI CRM. Built for focused growth.
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          background: theme.pageBg,
        }}
      >
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            width: "46px",
            height: "46px",
            borderRadius: "999px",
            border: `1px solid ${theme.border}`,
            background: theme.cardBg,
            color: theme.text,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            boxShadow: theme.shadowSoft,
          }}
        >
          {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.radius.xl,
            padding: "32px",
            boxShadow: theme.shadowCard,
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: theme.typography.sectionTitle.fontSize,
                fontWeight: theme.typography.sectionTitle.fontWeight,
                lineHeight: theme.typography.sectionTitle.lineHeight,
                color: theme.text,
              }}
            >
              Welcome Back
            </h2>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: theme.typography.bodyMd.fontSize,
                fontWeight: theme.typography.bodyMd.fontWeight,
                lineHeight: theme.typography.bodyMd.lineHeight,
                color: theme.subText,
              }}
            >
              Sign in to continue to your MEI CRM workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: theme.typography.label.fontSize,
                  fontWeight: theme.typography.label.fontWeight,
                  lineHeight: theme.typography.label.lineHeight,
                  color: theme.text,
                }}
              >
                Email Address
              </label>

              <div
                style={{
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "0 14px",
                  borderRadius: theme.radius.md,
                  border: `1px solid ${errors.email ? theme.danger : theme.border}`,
                  background: theme.inputBg,
                }}
              >
                <Mail size={18} color={theme.subText} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="admin@mei.com"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: theme.text,
                    fontSize: theme.typography.input.fontSize,
                    fontWeight: theme.typography.input.fontWeight,
                    lineHeight: theme.typography.input.lineHeight,
                    fontFamily: theme.typography.fontFamily,
                  }}
                />
              </div>

              {errors.email && (
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: theme.typography.bodySm.fontSize,
                    color: theme.danger,
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: theme.typography.label.fontSize,
                  fontWeight: theme.typography.label.fontWeight,
                  lineHeight: theme.typography.label.lineHeight,
                  color: theme.text,
                }}
              >
                Password
              </label>

              <div
                style={{
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "0 14px",
                  borderRadius: theme.radius.md,
                  border: `1px solid ${errors.password ? theme.danger : theme.border}`,
                  background: theme.inputBg,
                }}
              >
                <Lock size={18} color={theme.subText} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: theme.text,
                    fontSize: theme.typography.input.fontSize,
                    fontWeight: theme.typography.input.fontWeight,
                    lineHeight: theme.typography.input.lineHeight,
                    fontFamily: theme.typography.fontFamily,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: theme.subText,
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: theme.typography.bodySm.fontSize,
                    color: theme.danger,
                  }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: theme.typography.bodySm.fontSize,
                  color: theme.subText,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) =>
                    handleInputChange("rememberMe", e.target.checked)
                  }
                />
                Remember me
              </label>

              <button
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  color: theme.primary,
                  fontSize: theme.typography.bodySm.fontSize,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>

            {errors.general && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: theme.radius.md,
                  background: theme.dangerBg,
                  color: theme.danger,
                  border: `1px solid ${theme.border}`,
                  fontSize: theme.typography.bodySm.fontSize,
                }}
              >
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                height: "50px",
                border: "none",
                borderRadius: theme.radius.md,
                background: theme.primary,
                color: "#FFFFFF",
                fontSize: theme.typography.button.fontSize,
                fontWeight: theme.typography.button.fontWeight,
                lineHeight: theme.typography.button.lineHeight,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.8 : 1,
                boxShadow: theme.shadowSoft,
              }}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div
            style={{
              marginTop: "18px",
              paddingTop: "18px",
              borderTop: `1px solid ${theme.borderSoft}`,
              fontSize: theme.typography.bodySm.fontSize,
              color: theme.mutedText,
            }}
          >
            Demo login:{" "}
            <strong style={{ color: theme.text }}>admin@mei.com</strong> /{" "}
            <strong style={{ color: theme.text }}>123456</strong>
          </div>
        </div>
      </div>
    </div>
  );
}