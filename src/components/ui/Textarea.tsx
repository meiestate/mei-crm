import {
  forwardRef,
  useId,
  type CSSProperties,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

type TextareaSize = "sm" | "md" | "lg";

type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  textareaSize?: TextareaSize;
  fullWidth?: boolean;
  resize?: "none" | "both" | "horizontal" | "vertical";
  containerStyle?: CSSProperties;
  textareaStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  hintStyle?: CSSProperties;
};

const sizeMap: Record<
  TextareaSize,
  {
    minHeight: number;
    padding: string;
    fontSize: number;
    radius: number;
  }
> = {
  sm: {
    minHeight: 88,
    padding: "10px 12px",
    fontSize: 13,
    radius: 12,
  },
  md: {
    minHeight: 110,
    padding: "12px 14px",
    fontSize: 14,
    radius: 14,
  },
  lg: {
    minHeight: 140,
    padding: "14px 16px",
    fontSize: 15,
    radius: 16,
  },
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      id,
      label,
      hint,
      error,
      disabled,
      textareaSize = "md",
      fullWidth = true,
      resize = "vertical",
      containerStyle,
      textareaStyle,
      labelStyle,
      hintStyle,
      style,
      ...props
    },
    ref
  ) {
    const autoId = useId();
    const textareaId = id || autoId;
    const hasError = Boolean(error);
    const sizes = sizeMap[textareaSize];

    return (
      <div
        style={{
          width: fullWidth ? "100%" : undefined,
          ...containerStyle,
        }}
      >
        {label && (
          <label
            htmlFor={textareaId}
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

        <textarea
          {...props}
          id={textareaId}
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={
            hint || error ? `${textareaId}-description` : undefined
          }
          style={{
            width: "100%",
            minHeight: sizes.minHeight,
            padding: sizes.padding,
            borderRadius: sizes.radius,
            border: hasError ? "1.5px solid #ef4444" : "1px solid #cbd5e1",
            background: disabled ? "#f8fafc" : "#ffffff",
            color: "#0f172a",
            fontSize: sizes.fontSize,
            fontWeight: 500,
            lineHeight: 1.6,
            outline: "none",
            resize,
            boxSizing: "border-box",
            boxShadow: hasError
              ? "0 0 0 3px rgba(239, 68, 68, 0.10)"
              : "0 1px 2px rgba(15, 23, 42, 0.04)",
            transition: "all 0.2s ease",
            ...textareaStyle,
            ...style,
          }}
        />

        {(hint || error) && (
          <div
            id={`${textareaId}-description`}
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
  }
);

export default Textarea;