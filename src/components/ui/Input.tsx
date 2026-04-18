import {
  forwardRef,
  useId,
  useMemo,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { getTheme } from "../../theme";

type ThemeMode = "light" | "dark";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  mode?: ThemeMode;
  inputSize?: "sm" | "md" | "lg";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      hint,
      error,
      mode = "light",
      inputSize = "md",
      leftIcon,
      rightIcon,
      disabled = false,
      required = false,
      containerStyle,
      inputStyle,
      fullWidth = true,
      style,
      ...rest
    },
    ref
  ) => {
    const theme = useMemo(() => getTheme(mode), [mode]);
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const sizing = useMemo(() => {
      switch (inputSize) {
        case "sm":
          return {
            height: 38,
            fontSize: 13,
            px: 12,
            iconSize: 16,
          };
        case "lg":
          return {
            height: 50,
            fontSize: 15,
            px: 16,
            iconSize: 18,
          };
        case "md":
        default:
          return {
            height: 44,
            fontSize: 14,
            px: 14,
            iconSize: 17,
          };
      }
    }, [inputSize]);

    const hasError = Boolean(error);

    return (
      <div
        style={{
          width: fullWidth ? "100%" : undefined,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          ...containerStyle,
        }}
      >
        {label ? (
          <label
            htmlFor={inputId}
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.text,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>{label}</span>
            {required ? (
              <span style={{ color: "#dc2626" }} aria-hidden="true">
                *
              </span>
            ) : null}
          </label>
        ) : null}

        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {leftIcon ? (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 14,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: sizing.iconSize,
                color: disabled ? theme.mutedText : theme.subText,
                pointerEvents: "none",
              }}
            >
              {leftIcon}
            </span>
          ) : null}

          <input
            {...rest}
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            style={{
              ...style,
              width: "100%",
              height: sizing.height,
              borderRadius: 14,
              border: `1px solid ${hasError ? "#dc2626" : theme.border}`,
              background: disabled
                ? mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "#f8fafc"
                : theme.inputBg ?? theme.cardBg,
              color: theme.text,
              fontSize: sizing.fontSize,
              fontWeight: 500,
              outline: "none",
              transition: "all 0.2s ease",
              paddingLeft: leftIcon ? 42 : sizing.px,
              paddingRight: rightIcon ? 42 : sizing.px,
              boxSizing: "border-box",
              boxShadow:
                mode === "dark"
                  ? "0 6px 16px rgba(0,0,0,0.18)"
                  : "0 6px 16px rgba(15,23,42,0.06)",
              opacity: disabled ? 0.7 : 1,
              ...inputStyle,
            }}
            onFocus={(event) => {
              event.currentTarget.style.borderColor = hasError
                ? "#dc2626"
                : theme.primary;
              event.currentTarget.style.boxShadow =
                mode === "dark"
                  ? "0 0 0 3px rgba(59,130,246,0.22)"
                  : "0 0 0 3px rgba(37,99,235,0.14)";

              rest.onFocus?.(event);
            }}
            onBlur={(event) => {
              event.currentTarget.style.borderColor = hasError
                ? "#dc2626"
                : theme.border;
              event.currentTarget.style.boxShadow =
                mode === "dark"
                  ? "0 6px 16px rgba(0,0,0,0.18)"
                  : "0 6px 16px rgba(15,23,42,0.06)";

              rest.onBlur?.(event);
            }}
          />

          {rightIcon ? (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: 14,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: sizing.iconSize,
                color: disabled ? theme.mutedText : theme.subText,
              }}
            >
              {rightIcon}
            </span>
          ) : null}
        </div>

        {error ? (
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#dc2626",
            }}
          >
            {error}
          </span>
        ) : hint ? (
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: theme.subText,
            }}
          >
            {hint}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;