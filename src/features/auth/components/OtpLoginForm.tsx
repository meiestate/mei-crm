import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

type ThemeMode = "light" | "dark";

type OtpLoginFormSubmitPayload = {
  phone: string;
  otp: string;
};

type OtpLoginFormSendOtpPayload = {
  phone: string;
};

type OtpLoginFormProps = {
  mode?: ThemeMode;
  title?: string;
  subtitle?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  otpLength?: number;
  loading?: boolean;
  sendOtpLoading?: boolean;
  errorMessage?: string;
  successMessage?: string;
  initialPhone?: string;
  resendCooldownSeconds?: number;
  onSendOtp?: (payload: OtpLoginFormSendOtpPayload) => void | Promise<void>;
  onSubmit?: (payload: OtpLoginFormSubmitPayload) => void | Promise<void>;
  onBackToPasswordLogin?: () => void;
  onResendOtp?: (payload: OtpLoginFormSendOtpPayload) => void | Promise<void>;
};

export default function OtpLoginForm({
  mode = "light",
  title = "Login with OTP",
  subtitle = "Enter your mobile number, receive a one-time password, and sign in securely.",
  phoneLabel = "Mobile number",
  phonePlaceholder = "Enter your mobile number",
  otpLength = 6,
  loading = false,
  sendOtpLoading = false,
  errorMessage,
  successMessage,
  initialPhone = "",
  resendCooldownSeconds = 30,
  onSendOtp,
  onSubmit,
  onBackToPasswordLogin,
  onResendOtp,
}: OtpLoginFormProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [otpValues, setOtpValues] = useState<string[]>(
    Array.from({ length: otpLength }, () => ""),
  );
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [touchedPhone, setTouchedPhone] = useState(false);

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

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
    dangerBg: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)",
    dangerText: isDark ? "#fca5a5" : "#b91c1c",
    successBg: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.10)",
    successText: isDark ? "#86efac" : "#166534",
  };

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [cooldown]);

  const normalizedPhone = useMemo(() => phone.replace(/\D/g, ""), [phone]);

  const phoneError =
    touchedPhone && normalizedPhone.length === 0
      ? "Mobile number is required."
      : touchedPhone && normalizedPhone.length < 10
        ? "Enter a valid mobile number."
        : "";

  const otpValue = otpValues.join("");
  const otpError =
    otpSent && otpValue.length > 0 && otpValue.length < otpLength
      ? `Enter the full ${otpLength}-digit OTP.`
      : "";

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const cleaned = event.target.value.replace(/[^\d+ ]/g, "");
    setPhone(cleaned);
  };

  const focusOtpInput = (index: number) => {
    const target = otpRefs.current[index];
    if (target) {
      target.focus();
      target.select();
    }
  };

  const handleOtpChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const raw = event.target.value;
    const digit = raw.replace(/\D/g, "").slice(-1);

    setOtpValues((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < otpLength - 1) {
      focusOtpInput(index + 1);
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      if (otpValues[index]) {
        setOtpValues((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
        return;
      }

      if (index > 0) {
        focusOtpInput(index - 1);
        setOtpValues((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusOtpInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < otpLength - 1) {
      event.preventDefault();
      focusOtpInput(index + 1);
    }
  };

  const handleOtpPaste = async (
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) {
      return;
    }

    const next = Array.from({ length: otpLength }, (_, index) => pasted[index] ?? "");
    setOtpValues(next);

    const nextFocusIndex = Math.min(pasted.length, otpLength - 1);
    focusOtpInput(nextFocusIndex);
  };

  const handleSendOtp = async () => {
    setTouchedPhone(true);

    if (!normalizedPhone || normalizedPhone.length < 10) {
      return;
    }

    await onSendOtp?.({
      phone: normalizedPhone,
    });

    setOtpSent(true);
    setCooldown(resendCooldownSeconds);

    window.setTimeout(() => {
      focusOtpInput(0);
    }, 50);
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || !normalizedPhone) {
      return;
    }

    await onResendOtp?.({
      phone: normalizedPhone,
    });

    setOtpValues(Array.from({ length: otpLength }, () => ""));
    setCooldown(resendCooldownSeconds);

    window.setTimeout(() => {
      focusOtpInput(0);
    }, 50);
  };

  const handleVerifyOtp = async () => {
    setTouchedPhone(true);

    if (!normalizedPhone || normalizedPhone.length < 10) {
      return;
    }

    if (otpValue.length !== otpLength) {
      return;
    }

    await onSubmit?.({
      phone: normalizedPhone,
      otp: otpValue,
    });
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
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
          {title}
        </h2>

        <p
          style={{
            margin: "10px 0 0",
            fontSize: 14,
            lineHeight: 1.7,
            color: theme.subText,
          }}
        >
          {subtitle}
        </p>
      </div>

      <div style={{ display: "grid", gap: 18 }}>
        <div>
          <label
            htmlFor="otp-phone"
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 600,
              color: theme.text,
            }}
          >
            {phoneLabel}
          </label>

          <input
            id="otp-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={handlePhoneChange}
            onBlur={() => setTouchedPhone(true)}
            placeholder={phonePlaceholder}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 14,
              border: `1px solid ${phoneError ? "#ef4444" : theme.inputBorder}`,
              background: theme.inputBg,
              color: theme.text,
              padding: "0 14px",
              outline: "none",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />

          {phoneError ? (
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#ef4444",
              }}
            >
              {phoneError}
            </div>
          ) : null}
        </div>

        {!otpSent ? (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={sendOtpLoading}
            style={{
              height: 48,
              borderRadius: 14,
              border: "none",
              background: sendOtpLoading ? "rgba(37,99,235,0.55)" : theme.primary,
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 700,
              cursor: sendOtpLoading ? "not-allowed" : "pointer",
            }}
          >
            {sendOtpLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <>
            <div>
              <div
                style={{
                  marginBottom: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: theme.text,
                }}
              >
                Enter OTP
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${otpLength}, minmax(0, 1fr))`,
                  gap: 10,
                }}
              >
                {otpValues.map((digit, index) => (
                  <input
                    key={index}
                    ref={(node) => {
                      otpRefs.current[index] = node;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    onPaste={handleOtpPaste}
                    style={{
                      width: "100%",
                      height: 52,
                      textAlign: "center",
                      borderRadius: 14,
                      border: `1px solid ${otpError ? "#ef4444" : theme.inputBorder}`,
                      background: theme.inputBg,
                      color: theme.text,
                      outline: "none",
                      fontSize: 20,
                      fontWeight: 700,
                      boxSizing: "border-box",
                    }}
                  />
                ))}
              </div>

              {otpError ? (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: "#ef4444",
                  }}
                >
                  {otpError}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              style={{
                height: 48,
                borderRadius: 14,
                border: "none",
                background: loading ? "rgba(37,99,235,0.55)" : theme.primary,
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: cooldown > 0 ? theme.subText : theme.primary,
                  cursor: cooldown > 0 ? "not-allowed" : "pointer",
                }}
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtpValues(Array.from({ length: otpLength }, () => ""));
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: theme.subText,
                  cursor: "pointer",
                }}
              >
                Change mobile number
              </button>
            </div>
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
              background: theme.successBg,
              color: theme.successText,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {successMessage}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onBackToPasswordLogin}
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
          Back to password login
        </button>
      </div>
    </div>
  );
}