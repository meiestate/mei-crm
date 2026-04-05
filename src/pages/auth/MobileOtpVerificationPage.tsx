import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type MobileOtpVerificationPageProps = {
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
  isMobileVerified?: boolean;
};

type PendingMobileVerification = {
  phone: string;
  requestedAt: string;
};

const OTP_LENGTH = 6;
const DEMO_OTP = "123456";
const RESEND_SECONDS = 30;

export default function MobileOtpVerificationPage({
  mode,
}: MobileOtpVerificationPageProps) {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    try {
      const rawPending = localStorage.getItem(
        "mei_crm_pending_mobile_verification"
      );
      const pending: PendingMobileVerification | null = rawPending
        ? JSON.parse(rawPending)
        : null;

      if (pending?.phone) {
        setPhone(pending.phone);
        return;
      }

      const rawCurrentUser = localStorage.getItem("mei_crm_current_user");
      const currentUser = rawCurrentUser ? JSON.parse(rawCurrentUser) : null;

      if (currentUser?.phone) {
        setPhone(currentUser.phone);
        return;
      }

      setError("Mobile verification session not found. Please sign up again.");
    } catch (err) {
      console.error("Failed to load mobile verification session:", err);
      setError("Something went wrong while loading verification details.");
    }
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = window.setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [secondsLeft]);

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 560,
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

  const maskedPhone = phone
    ? `${phone.slice(0, 2)}******${phone.slice(-2)}`
    : "No mobile number found";

  const joinedOtp = otpValues.join("");

  const clearMessages = () => {
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleOtpChange = (index: number, value: string) => {
    const onlyDigit = value.replace(/\D/g, "").slice(-1);

    setOtpValues((prev) => {
      const updated = [...prev];
      updated[index] = onlyDigit;
      return updated;
    });

    clearMessages();

    if (onlyDigit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      if (otpValues[index]) {
        setOtpValues((prev) => {
          const updated = [...prev];
          updated[index] = "";
          return updated;
        });
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setOtpValues((prev) => {
          const updated = [...prev];
          updated[index - 1] = "";
          return updated;
        });
      }

      clearMessages();
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      return;
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      return;
    }

    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const updated = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((digit, idx) => {
      updated[idx] = digit;
    });

    setOtpValues(updated);
    clearMessages();

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResendOtp = () => {
    if (!phone) {
      setError("Mobile number not found. Please sign up again.");
      return;
    }

    try {
      setIsResending(true);
      setError("");
      setSuccessMessage("");

      localStorage.setItem(
        "mei_crm_pending_mobile_verification",
        JSON.stringify({
          phone,
          requestedAt: new Date().toISOString(),
        })
      );

      setSecondsLeft(RESEND_SECONDS);
      setOtpValues(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();

      setSuccessMessage(
        `OTP has been sent again successfully. Demo OTP is ${DEMO_OTP}`
      );
    } catch (err) {
      console.error("Resend OTP failed:", err);
      setError("Unable to resend OTP right now.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = () => {
    if (!phone) {
      setError("Mobile number not found. Please sign up again.");
      return;
    }

    if (joinedOtp.length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    if (joinedOtp !== DEMO_OTP) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    try {
      setIsVerifying(true);
      setError("");
      setSuccessMessage("");

      const rawUsers = localStorage.getItem("mei_crm_users");
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];

      const matchedIndex = users.findIndex((user) => user.phone === phone);

      if (matchedIndex === -1) {
        setError("User account not found. Please sign up again.");
        setIsVerifying(false);
        return;
      }

      const updatedUsers = [...users];
      updatedUsers[matchedIndex] = {
        ...updatedUsers[matchedIndex],
        isMobileVerified: true,
      };

      localStorage.setItem("mei_crm_users", JSON.stringify(updatedUsers));
      localStorage.removeItem("mei_crm_pending_mobile_verification");

      setSuccessMessage(
        "Mobile number verified successfully. Redirecting to login page..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError("Something went wrong while verifying OTP.");
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
            Mobile OTP Verification
          </div>

          <div
            style={{
              color: theme.textSecondary,
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Enter the 6-digit OTP sent to your registered mobile number to verify
            your <strong>MEI CRM</strong> account.
          </div>
        </div>

        <div
          style={{
            marginBottom: 18,
            padding: "14px 16px",
            borderRadius: 12,
            background:
              mode === "dark"
                ? "rgba(37,99,235,0.12)"
                : "rgba(37,99,235,0.08)",
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
            Registered Mobile Number
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: theme.text,
              wordBreak: "break-word",
            }}
          >
            {maskedPhone}
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: theme.textSecondary,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Enter OTP
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {otpValues.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={handleOtpPaste}
                onFocus={(e) => e.target.select()}
                style={{
                  width: 52,
                  height: 56,
                  borderRadius: 14,
                  border: digit
                    ? `1px solid ${theme.primary}`
                    : `1px solid ${theme.border}`,
                  background: theme.inputBg ?? theme.card,
                  color: theme.text,
                  outline: "none",
                  fontSize: 24,
                  fontWeight: 700,
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            marginBottom: 16,
            textAlign: "center",
            fontSize: 13,
            color: theme.textSecondary,
          }}
        >
          {secondsLeft > 0 ? (
            <>Resend OTP in {secondsLeft}s</>
          ) : (
            <>Didn&apos;t receive the OTP?</>
          )}
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
            onClick={handleVerifyOtp}
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
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={secondsLeft > 0 || isResending}
            style={{
              ...buttonBaseStyle,
              border: `1px solid ${theme.border}`,
              background: theme.card,
              color: theme.text,
              opacity: secondsLeft > 0 || isResending ? 0.6 : 1,
              cursor:
                secondsLeft > 0 || isResending ? "not-allowed" : "pointer",
            }}
          >
            {isResending ? "Resending..." : "Resend OTP"}
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
            Change Mobile Number / Sign Up Again
          </Link>
        </div>

        <div style={{ marginTop: 18, ...helperTextStyle, textAlign: "center" }}>
          Demo mode: use <strong>{DEMO_OTP}</strong> as the OTP. Later we can
          connect real SMS OTP services like Firebase Phone Auth, Twilio, MSG91,
          or your backend API.
        </div>
      </div>
    </div>
  );
}