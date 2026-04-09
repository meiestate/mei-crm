import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Card from "./Card";
import Input from "./Input";
import Button from "./Button";

type OtpLoginFormProps = {
  title?: string;
  subtitle?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  otpLength?: number;
  loading?: boolean;
  error?: string;
  initialPhone?: string;
  resendCooldownSeconds?: number;
  onSendOtp: (phone: string) => void | Promise<void>;
  onVerifyOtp: (values: { phone: string; otp: string }) => void | Promise<void>;
  onBack?: () => void;
};

export default function OtpLoginForm({
  title = "Login with OTP",
  subtitle = "Enter your mobile number and verify with one-time password",
  phoneLabel = "Mobile Number",
  phonePlaceholder = "Enter mobile number",
  otpLength = 6,
  loading = false,
  error,
  initialPhone = "",
  resendCooldownSeconds = 30,
  onSendOtp,
  onVerifyOtp,
  onBack,
}: OtpLoginFormProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [otpValues, setOtpValues] = useState<string[]>(
    Array(otpLength).fill("")
  );
  const [step, setStep] = useState<"phone" | "otp">(initialPhone ? "otp" : "phone");
  const [localError, setLocalError] = useState("");
  const [touchedPhone, setTouchedPhone] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (step !== "otp" || cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [step, cooldown]);

  const phoneError = useMemo(() => {
    const trimmed = phone.trim();

    if (!touchedPhone) return "";
    if (!trimmed) return "Mobile number is required";
    if (!/^\d{10}$/.test(trimmed)) return "Enter a valid 10-digit mobile number";
    return "";
  }, [phone, touchedPhone]);

  const otp = otpValues.join("");
  const otpError =
    step === "otp" && localError
      ? localError
      : "";

  const handleSendOtp = async (event?: FormEvent) => {
    event?.preventDefault();
    setTouchedPhone(true);
    setLocalError("");

    const trimmed = phone.trim();

    if (!trimmed) {
      setLocalError("Please enter your mobile number.");
      return;
    }

    if (!/^\d{10}$/.test(trimmed)) {
      setLocalError("Please enter a valid 10-digit mobile number.");
      return;
    }

    await onSendOtp(trimmed);
    setStep("otp");
    setOtpValues(Array(otpLength).fill(""));
    setCooldown(resendCooldownSeconds);

    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 0);
  };

  const handleVerifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError("");

    if (otp.length !== otpLength || otpValues.some((digit) => !digit)) {
      setLocalError(`Please enter the ${otpLength}-digit OTP.`);
      return;
    }

    await onVerifyOtp({
      phone: phone.trim(),
      otp,
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setOtpValues((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < otpLength - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      if (otpValues[index]) {
        setOtpValues((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
        setOtpValues((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < otpLength - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, otpLength);

    if (!pasted) return;

    event.preventDefault();

    const next = Array(otpLength).fill("");
    pasted.split("").forEach((digit, index) => {
      next[index] = digit;
    });

    setOtpValues(next);

    const focusIndex = Math.min(pasted.length, otpLength - 1);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleEditPhone = () => {
    setStep("phone");
    setOtpValues(Array(otpLength).fill(""));
    setLocalError("");
  };

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: 460,
        margin: "0 auto",
      }}
      bodyStyle={{
        padding: 28,
      }}
    >
      <div style={{ marginBottom: 24 }}>
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

      {step === "phone" ? (
        <form onSubmit={handleSendOtp}>
          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            <Input
              label={phoneLabel}
              type="tel"
              inputMode="numeric"
              placeholder={phonePlaceholder}
              value={phone}
              maxLength={10}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(next);
              }}
              onBlur={() => setTouchedPhone(true)}
              error={phoneError}
              autoComplete="tel"
            />

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
              Send OTP
            </Button>

            {onBack && (
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={onBack}
              >
                Back
              </Button>
            )}
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  OTP sent to
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  +91 {phone}
                </div>
              </div>

              <button
                type="button"
                onClick={handleEditPhone}
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
                Change
              </button>
            </div>

            <div>
              <div
                style={{
                  marginBottom: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0f172a",
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
                    ref={(element) => {
                      otpRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    style={{
                      height: 52,
                      borderRadius: 14,
                      border: otpError
                        ? "1.5px solid #ef4444"
                        : "1px solid #cbd5e1",
                      background: "#ffffff",
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#0f172a",
                      outline: "none",
                      boxShadow: otpError
                        ? "0 0 0 3px rgba(239, 68, 68, 0.10)"
                        : "0 1px 2px rgba(15, 23, 42, 0.04)",
                    }}
                  />
                ))}
              </div>

              {(error || otpError) && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "#dc2626",
                    fontWeight: 600,
                  }}
                >
                  {error || otpError}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  lineHeight: 1.5,
                }}
              >
                Didn&apos;t receive the code?
              </div>

              <button
                type="button"
                disabled={cooldown > 0 || loading}
                onClick={() => handleSendOtp()}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  color: cooldown > 0 ? "#94a3b8" : "#2563eb",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: cooldown > 0 || loading ? "not-allowed" : "pointer",
                }}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              Verify OTP
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}