import { useRef, useState } from "react";

const OTP_LENGTH = 6;
const DEMO_OTP = "123456";

export default function OtpInputDemo() {
  const [otpValues, setOtpValues] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const joinedOtp = otpValues.join("");

  const clearAlerts = () => {
    if (message) setMessage("");
    if (error) setError("");
  };

  const handleOtpChange = (index: number, value: string) => {
    const onlyDigit = value.replace(/\D/g, "").slice(-1);

    setOtpValues((prev) => {
      const updated = [...prev];
      updated[index] = onlyDigit;
      return updated;
    });

    clearAlerts();

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

      clearAlerts();
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
    clearAlerts();

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleReset = () => {
    setOtpValues(Array(OTP_LENGTH).fill(""));
    setMessage("");
    setError("");
    inputRefs.current[0]?.focus();
  };

  const handleVerifyDemoOtp = () => {
    if (joinedOtp.length !== OTP_LENGTH) {
      setError("Please enter the full 6-digit OTP.");
      setMessage("");
      return;
    }

    if (joinedOtp !== DEMO_OTP) {
      setError("Invalid OTP. Try demo OTP: 123456");
      setMessage("");
      return;
    }

    setError("");
    setMessage("OTP verified successfully.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
          padding: 28,
        }}
      >
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <h2
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: 0.3,
            }}
          >
            OTP Input Screen
          </h2>

          <p
            style={{
              marginTop: 10,
              marginBottom: 0,
              fontSize: 14,
              lineHeight: 1.7,
              color: "#64748b",
            }}
          >
            Enter the 6-digit OTP below. Demo OTP is{" "}
            <strong style={{ color: "#0f172a" }}>{DEMO_OTP}</strong>
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 20,
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
                border: digit ? "1px solid #2563eb" : "1px solid #cbd5e1",
                background: "#ffffff",
                outline: "none",
                fontSize: 24,
                fontWeight: 700,
                textAlign: "center",
                boxSizing: "border-box",
                color: "#0f172a",
              }}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 14,
            color: "#475569",
          }}
        >
          Current OTP: <strong style={{ color: "#0f172a" }}>{joinedOtp || "-"}</strong>
        </div>

        {error && (
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
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.25)",
              color: "#16a34a",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gap: 12,
            marginTop: 20,
          }}
        >
          <button
            type="button"
            onClick={handleVerifyDemoOtp}
            style={{
              width: "100%",
              padding: "13px 16px",
              borderRadius: 12,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Verify OTP
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              width: "100%",
              padding: "13px 16px",
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#0f172a",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Reset OTP
          </button>
        </div>
      </div>
    </div>
  );
}