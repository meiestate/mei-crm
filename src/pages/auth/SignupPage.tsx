import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type SignupPageProps = {
  mode: ThemeMode;
};

type SignupForm = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  password: string;
  confirmPassword: string;
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

const initialForm: SignupForm = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage({ mode }: SignupPageProps) {
  const navigate = useNavigate();
  const theme = useMemo(() => getTheme(mode), [mode]);

  const [form, setForm] = useState<SignupForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupForm, string>>>(
    {}
  );
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const smallTextStyle: React.CSSProperties = {
    fontSize: 12,
    color: theme.textSecondary,
  };

  const handleChange = (field: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    if (generalError) {
      setGeneralError("");
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof SignupForm, string>> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    if (!form.company.trim()) {
      newErrors.company = "Company / Business name is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setGeneralError("");

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const rawUsers = localStorage.getItem("mei_crm_users");
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];

      const emailExists = users.some(
        (user) => user.email.toLowerCase() === form.email.trim().toLowerCase()
      );

      if (emailExists) {
        setGeneralError("This email is already registered. Please login.");
        setIsSubmitting(false);
        return;
      }

      const newUser: StoredUser = {
        id: `user_${Date.now()}`,
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        password: form.password,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem("mei_crm_users", JSON.stringify(updatedUsers));

      localStorage.setItem(
        "mei_crm_current_user",
        JSON.stringify({
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          company: newUser.company,
          phone: newUser.phone,
        })
      );

      setSuccessMessage("Signup successful! Redirecting to login...");
      setForm(initialForm);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Signup failed:", error);
      setGeneralError("Something went wrong while creating account.");
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
              marginBottom: 6,
              letterSpacing: 0.3,
            }}
          >
            Create your account
          </div>

          <div
            style={{
              color: theme.textSecondary,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Welcome to <strong>MEI CRM</strong>. Start building your leads,
            contacts, deals, and growth engine from one place.
          </div>
        </div>

        <form onSubmit={handleSignup}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                style={inputStyle}
              />
              {errors.fullName && (
                <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
                  {errors.fullName}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={inputStyle}
              />
              {errors.email && (
                <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                style={inputStyle}
              />
              {errors.phone && (
                <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
                  {errors.phone}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Company / Business Name</label>
              <input
                type="text"
                placeholder="Enter company name"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                style={inputStyle}
              />
              {errors.company && (
                <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
                  {errors.company}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
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
                <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
                  {errors.password}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
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
                <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {generalError && (
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
              {generalError}
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
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div
          style={{
            marginTop: 18,
            textAlign: "center",
            ...smallTextStyle,
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: theme.primary,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}