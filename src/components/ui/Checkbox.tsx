import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  containerStyle?: CSSProperties;
  labelStyle?: CSSProperties;
};

export default function Checkbox({
  label,
  description,
  error,
  disabled,
  checked,
  containerStyle,
  labelStyle,
  id,
  ...props
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
        userSelect: "none",
        ...containerStyle,
      }}
    >
      <span
        style={{
          position: "relative",
          width: 18,
          height: 18,
          minWidth: 18,
          marginTop: 2,
        }}
      >
        <input
          {...props}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            margin: 0,
            opacity: 0,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        />

        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 6,
            border: error
              ? "1.5px solid #ef4444"
              : checked
              ? "1.5px solid #2563eb"
              : "1.5px solid #cbd5e1",
            background: checked ? "#2563eb" : "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            boxShadow: checked
              ? "0 0 0 3px rgba(37, 99, 235, 0.12)"
              : "none",
          }}
        >
          {checked && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 10.5L8.5 14L15 7.5"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </span>

      <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {label && (
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#0f172a",
              lineHeight: 1.4,
              ...labelStyle,
            }}
          >
            {label}
          </span>
        )}

        {description && (
          <span
            style={{
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            {description}
          </span>
        )}

        {error && (
          <span
            style={{
              fontSize: 12,
              color: "#dc2626",
              lineHeight: 1.4,
            }}
          >
            {error}
          </span>
        )}
      </span>
    </label>
  );
}