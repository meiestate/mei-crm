import {
  forwardRef,
  useId,
  useMemo,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type InputSize = "sm" | "md" | "lg";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputSize?: InputSize;
  fullWidth?: boolean;
  containerStyle?: CSSProperties;
  inputWrapperStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  hintStyle?: CSSProperties;
};

const sizeStyles: Record<
  InputSize,
  {
    minHeight: number;
    paddingX: number;
    fontSize: number;
    radius: number;
    iconSize: number;
  }
> = {
  sm: {
    minHeight: 38,
    paddingX: 12,
    fontSize: 13,
    radius: 12,
    iconSize: 16,
  },
  md: {
    minHeight: 44,
    paddingX: 14,
    fontSize: 14,
    radius: 14,
    iconSize: 18,
  },
  lg: {
    minHeight: 50,
    paddingX: 16,
    fontSize: 15,
    radius: 16,
    iconSize: 18,
  },
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    hint,
    error,
    leftIcon,
    rightIcon,
    inputSize = "md",
    fullWidth = true,
    disabled,
    containerStyle,
    inputWrapperStyle,
    inputStyle,
    labelStyle,
    hintStyle,
    style,
    ...props
  },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  const hasError = Boolean(error);
  const sizes = sizeStyles[inputSize];

  const wrapperStyles = useMemo<CSSProperties>(
    () => ({
      width: fullWidth ? "100%" : undefined,
      ...containerStyle,
    }),
    [fullWidth, containerStyle]
  );

  return (
    <div style={wrapperStyles}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: "inline-block",
            marginBottom: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#0f172a",
            lineHeight: 1.4,
            ...labelStyle,
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          minHeight: sizes.minHeight,
          borderRadius: sizes.radius,
          border: hasError ? "1.5px solid #ef4444" : "1px solid #cbd5e1",
          background: disabled ? "#f8fafc" : "#ffffff",
          boxShadow: hasError
            ? "0 0 0 3px rgba(239, 68, 68, 0.10)"
            : "0 1px 2px rgba(15, 23, 42, 0.04)",
          transition: "all 0.2s ease",
          overflow: "hidden",
          ...inputWrapperStyle,
        }}
      >
        {leftIcon && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: sizes.minHeight,
              minWidth: sizes.minHeight,
              height: sizes.minHeight,
              color: hasError ? "#ef4444" : "#64748b",
              fontSize: sizes.iconSize,
              pointerEvents: "none",
            }}
          >
            {leftIcon}
          </span>
        )}

        <input
          {...props}
          {...(style ? { style: undefined } : {})}
          id={inputId}
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={
            hint || error ? `${inputId}-description` : undefined
          }
          style={{
            flex: 1,
            width: "100%",
            minWidth: 0,
            minHeight: sizes.minHeight,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#0f172a",
            fontSize: sizes.fontSize,
            fontWeight: 500,
            paddingLeft: leftIcon ? 0 : sizes.paddingX,
            paddingRight: rightIcon ? 0 : sizes.paddingX,
            ...(leftIcon || rightIcon ? { paddingTop: 0, paddingBottom: 0 } : {}),
            "::placeholder": undefined as never,
            ...inputStyle,
            ...style,
          }}
        />

        {rightIcon && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: sizes.minHeight,
              minWidth: sizes.minHeight,
              height: sizes.minHeight,
              color: hasError ? "#ef4444" : "#64748b",
              fontSize: sizes.iconSize,
            }}
          >
            {rightIcon}
          </span>
        )}
      </div>

      {(hint || error) && (
        <div
          id={`${inputId}-description`}
          style={{
            marginTop: 8,
            fontSize: 12,
            lineHeight: 1.5,
            color: hasError ? "#dc2626" : "#64748b",
            ...hintStyle,
          }}
        >
          {error || hint}
        </div>
      )}
    </div>
  );
});

export default Input;