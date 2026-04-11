import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

type ThemeMode = "light" | "dark";

export type SignupWizardValues = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

type SignupWizardSubmitPayload = Omit<SignupWizardValues, "confirmPassword">;

type SignupWizardProps = {
  mode?: ThemeMode;
  loading?: boolean;
  errorMessage?: string;
  successMessage?: string;
  initialValues?: Partial<SignupWizardValues>;
  onSubmit?: (values: SignupWizardSubmitPayload) => void | Promise<void>;
  onBackToLogin?: () => void;
};

const TOTAL_STEPS = 3;

export default function SignupWizard({
  mode = "light",
  loading = false,
  errorMessage,
  successMessage,
  initialValues,
  onSubmit,
  onBackToLogin,
}: SignupWizardProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [values, setValues] = useState<SignupWizardValues>({
    fullName: initialValues?.fullName ?? "",
    email: initialValues?.email ?? "",
    phone: initialValues?.phone ?? "",
    companyName: initialValues?.companyName ?? "",
    password: initialValues?.password ?? "",
    confirmPassword: initialValues?.confirmPassword ?? "",
    acceptTerms: initialValues?.acceptTerms ?? false,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isDark = mode === "dark";

  const theme = {
    cardBg: isDark ? "#0f172a" : "#ffffff",
    cardSoft: isDark ? "#111827" : "#f8fafc",
    text: isDark ? "#e5e7eb" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "rgba(148,163,184,0.18)" : "rgba(15,23,42,0.10)",
    inputBg: isDark ? "#111827" : "#ffffff",
    inputBorder: isDark ? "rgba(148,163,184,0.20)" : "rgba(15,23,42,0.12)",
    primary: "#2563eb",
    primarySoft: isDark ? "rgba(37,99,235,0.18)" : "rgba(37,99,235,0.10)",
    dangerBg: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)",
    dangerText: isDark ? "#fca5a5" : "#b91c1c",
    successBg: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.10)",
    successText: isDark ? "#86efac" : "#166534",
  };

  const normalizedPhone = useMemo(() => values.phone.replace(/\D/g, ""), [values.phone]);

  const errors = {
    fullName:
      touched.fullName && values.fullName.trim().length === 0
        ? "Full name is required."
        : "",
    email:
      touched.email && values.email.trim().length === 0
        ? "Email is required."
        : touched.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
          ? "Enter a valid email address."
          : "",
    phone:
      touched.phone && normalizedPhone.length === 0
        ? "Phone number is required."
        : touched.phone && normalizedPhone.length < 10
          ? "Enter a valid phone number."
          : "",
    companyName:
      touched.companyName && values.companyName.trim().length === 0
        ? "Company name is required."
        : "",
    password:
      touched.password && values.password.trim().length === 0
        ? "Password is required."
        : touched.password && values.password.trim().length < 6
          ? "Password must be at least 6 characters."
          : "",
    confirmPassword:
      touched.confirmPassword && values.confirmPassword.trim().length === 0
        ? "Confirm your password."
        : touched.confirmPassword && values.confirmPassword !== values.password
          ? "Passwords do not match."
          : "",
    acceptTerms:
      touched.acceptTerms && !values.acceptTerms
        ? "You must accept the terms to continue."
        : "",
  };

  const updateField = <K extends keyof SignupWizardValues>(
    field: K,
    value: SignupWizardValues[K],
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const markTouched = (...fields: Array<keyof SignupWizardValues>) => {
    setTouched((prev) => {
      const next = { ...prev };
      fields.forEach((field) => {
        next[field] = true;
      });
      return next;
    });
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      markTouched("fullName", "email", "phone");
      return (
        values.fullName.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) &&
        normalizedPhone.length >= 10
      );
    }

    if (currentStep === 2) {
      markTouched("companyName", "password", "confirmPassword");
      return (
        values.companyName.trim().length > 0 &&
        values.password.trim().length >= 6 &&
        values.confirmPassword === values.password
      );
    }

    if (currentStep === 3) {
      markTouched("acceptTerms");
      return values.acceptTerms;
    }

    return true;
  };

  const handleTextChange =
    (field: keyof SignupWizardValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "acceptTerms"
          ? event.target.checked
          : event.target.value;

      updateField(field as never, value as never);
    };

  const handleNext = () => {
    if (!validateStep(step)) {
      return;
    }

    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    const step3Valid = validateStep(3);

    if (!step1Valid) {
      setStep(1);
      return;
    }

    if (!step2Valid) {
      setStep(2);
      return;
    }

    if (!step3Valid) {
      setStep(3);
      return;
    }

    await onSubmit?.({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: normalizedPhone,
      companyName: values.companyName.trim(),
      password: values.password,
      acceptTerms: values.acceptTerms,
    });
  };

  const stepTitle =
    step === 1
      ? "Your details"
      : step === 2
        ? "Workspace setup"
        : "Confirmation";

  const progressPercent = (step / TOTAL_STEPS) * 100;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 640,
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: theme.text,
              }}
            >
              Create your account
            </h2>

            <p
              style={{
                margin: "10px 0 0",
                fontSize: 14,
                lineHeight: 1.7,
                color: theme.subText,
              }}
            >
              Build your workspace, invite your team later, and start managing
              everything from one clean system.
            </p>
          </div>

          <div
            style={{
              minWidth: 88,
              textAlign: "right",
              fontSize: 13,
              fontWeight: 700,
              color: theme.primary,
            }}
          >
            Step {step}/{TOTAL_STEPS}
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: 10,
            borderRadius: 999,
            background: theme.cardSoft,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: theme.primary,
              borderRadius: 999,
              transition: "width 0.25s ease",
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: theme.text,
              marginBottom: 6,
            }}
          >
            {stepTitle}
          </div>

          <div
            style={{
              fontSize: 14,
              color: theme.subText,
              lineHeight: 1.7,
            }}
          >
            {step === 1 &&
              "Tell us who you are so we can create your login and contact profile."}
            {step === 2 &&
              "Set up the company and password details for your workspace."}
            {step === 3 &&
              "Review and confirm that you agree to continue."}
          </div>
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          {step === 1 && (
            <>
              <Field
                label="Full name"
                error={errors.fullName}
                theme={theme}
              >
                <input
                  type="text"
                  value={values.fullName}
                  onChange={handleTextChange("fullName")}
                  onBlur={() => markTouched("fullName")}
                  placeholder="Enter your full name"
                  style={getInputStyle(theme, !!errors.fullName)}
                />
              </Field>

              <Field
                label="Email"
                error={errors.email}
                theme={theme}
              >
                <input
                  type="email"
                  value={values.email}
                  onChange={handleTextChange("email")}
                  onBlur={() => markTouched("email")}
                  placeholder="Enter your email"
                  style={getInputStyle(theme, !!errors.email)}
                />
              </Field>

              <Field
                label="Phone number"
                error={errors.phone}
                theme={theme}
              >
                <input
                  type="tel"
                  inputMode="numeric"
                  value={values.phone}
                  onChange={handleTextChange("phone")}
                  onBlur={() => markTouched("phone")}
                  placeholder="Enter your mobile number"
                  style={getInputStyle(theme, !!errors.phone)}
                />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field
                label="Company / Workspace name"
                error={errors.companyName}
                theme={theme}
              >
                <input
                  type="text"
                  value={values.companyName}
                  onChange={handleTextChange("companyName")}
                  onBlur={() => markTouched("companyName")}
                  placeholder="Enter your company name"
                  style={getInputStyle(theme, !!errors.companyName)}
                />
              </Field>

              <Field
                label="Password"
                error={errors.password}
                theme={theme}
              >
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleTextChange("password")}
                    onBlur={() => markTouched("password")}
                    placeholder="Create a strong password"
                    style={getInputStyle(theme, !!errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={getGhostButtonStyle(theme)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>

              <Field
                label="Confirm password"
                error={errors.confirmPassword}
                theme={theme}
              >
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={handleTextChange("confirmPassword")}
                    onBlur={() => markTouched("confirmPassword")}
                    placeholder="Re-enter your password"
                    style={getInputStyle(theme, !!errors.confirmPassword)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    style={getGhostButtonStyle(theme)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <div
                style={{
                  border: `1px solid ${theme.border}`,
                  borderRadius: 18,
                  background: theme.cardSoft,
                  padding: 18,
                  display: "grid",
                  gap: 12,
                }}
              >
                <SummaryRow label="Full name" value={values.fullName} theme={theme} />
                <SummaryRow label="Email" value={values.email} theme={theme} />
                <SummaryRow label="Phone" value={normalizedPhone} theme={theme} />
                <SummaryRow label="Company" value={values.companyName} theme={theme} />
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  cursor: "pointer",
                  color: theme.text,
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                <input
                  type="checkbox"
                  checked={values.acceptTerms}
                  onChange={handleTextChange("acceptTerms")}
                  onBlur={() => markTouched("acceptTerms")}
                  style={{
                    marginTop: 3,
                    width: 16,
                    height: 16,
                    accentColor: theme.primary,
                    flexShrink: 0,
                  }}
                />
                <span>
                  I agree to the terms, privacy policy, and workspace usage rules.
                </span>
              </label>

              {errors.acceptTerms ? (
                <div
                  style={{
                    fontSize: 12,
                    color: "#ef4444",
                    marginTop: -8,
                  }}
                >
                  {errors.acceptTerms}
                </div>
              ) : null}
            </>
          )}

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

          {successMessage ? (
            <div
              style={{
                borderRadius: 14,
                padding: "12px 14px",
                background: theme.primarySoft,
                color: theme.primary,
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {successMessage}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 4,
            }}
          >
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    height: 46,
                    padding: "0 18px",
                    borderRadius: 14,
                    border: `1px solid ${theme.border}`,
                    background: theme.cardSoft,
                    color: theme.text,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
              ) : null}

              <button
                type="button"
                onClick={onBackToLogin}
                style={{
                  height: 46,
                  padding: "0 18px",
                  borderRadius: 14,
                  border: "none",
                  background: "transparent",
                  color: theme.subText,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Back to login
              </button>
            </div>

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  height: 48,
                  padding: "0 20px",
                  borderRadius: 14,
                  border: "none",
                  background: theme.primary,
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                style={{
                  height: 48,
                  padding: "0 20px",
                  borderRadius: 14,
                  border: "none",
                  background: loading ? "rgba(37,99,235,0.55)" : theme.primary,
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  theme: {
    text: string;
  };
  children: React.ReactNode;
};

function Field({ label, error, theme, children }: FieldProps) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontSize: 14,
          fontWeight: 600,
          color: theme.text,
        }}
      >
        {label}
      </label>

      {children}

      {error ? (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: {
    text: string;
    subText: string;
  };
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: theme.subText,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: theme.text,
        }}
      >
        {value || "-"}
      </span>
    </div>
  );
}

function getInputStyle(
  theme: {
    inputBg: string;
    text: string;
    inputBorder: string;
  },
  hasError: boolean,
): React.CSSProperties {
  return {
    width: "100%",
    height: 48,
    borderRadius: 14,
    border: `1px solid ${hasError ? "#ef4444" : theme.inputBorder}`,
    background: theme.inputBg,
    color: theme.text,
    padding: "0 14px",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  };
}

function getGhostButtonStyle(theme: {
  subText: string;
}): React.CSSProperties {
  return {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: theme.subText,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  };
}