import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  content: ReactNode;
  children: ReactElement;
  placement?: TooltipPlacement;
  maxWidth?: number | string;
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
  showArrow?: boolean;
  offset?: number;
  zIndex?: number;
  style?: CSSProperties;
};

export default function Tooltip({
  content,
  children,
  placement = "top",
  maxWidth = 240,
  openDelay = 120,
  closeDelay = 80,
  disabled = false,
  showArrow = true,
  offset = 10,
  zIndex = 1500,
  style,
}: TooltipProps) {
  const tooltipId = useId();
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
      }
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const clearTimers = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const showTooltip = () => {
    if (disabled) return;
    clearTimers();

    openTimerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, openDelay);
  };

  const hideTooltip = () => {
    clearTimers();

    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, closeDelay);
  };

  const getPositionStyle = (): CSSProperties => {
    switch (placement) {
      case "bottom":
        return {
          top: `calc(100% + ${offset}px)`,
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          top: "50%",
          right: `calc(100% + ${offset}px)`,
          transform: "translateY(-50%)",
        };
      case "right":
        return {
          top: "50%",
          left: `calc(100% + ${offset}px)`,
          transform: "translateY(-50%)",
        };
      case "top":
      default:
        return {
          bottom: `calc(100% + ${offset}px)`,
          left: "50%",
          transform: "translateX(-50%)",
        };
    }
  };

  const getArrowStyle = (): CSSProperties => {
    const base: CSSProperties = {
      position: "absolute",
      width: 10,
      height: 10,
      background: "#0f172a",
      transform: "rotate(45deg)",
      borderRadius: 2,
    };

    switch (placement) {
      case "bottom":
        return {
          ...base,
          top: -5,
          left: "50%",
          marginLeft: -5,
        };
      case "left":
        return {
          ...base,
          right: -5,
          top: "50%",
          marginTop: -5,
        };
      case "right":
        return {
          ...base,
          left: -5,
          top: "50%",
          marginTop: -5,
        };
      case "top":
      default:
        return {
          ...base,
          bottom: -5,
          left: "50%",
          marginLeft: -5,
        };
    }
  };

  const child = children;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        width: "fit-content",
        verticalAlign: "middle",
      }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children.props
        ? {
            ...children,
            props: {
              ...children.props,
              "aria-describedby": open ? tooltipId : undefined,
            },
          }
        : child}

      {open && !disabled && (
        <span
          id={tooltipId}
          role="tooltip"
          style={{
            position: "absolute",
            ...getPositionStyle(),
            maxWidth,
            minWidth: 36,
            padding: "10px 12px",
            borderRadius: 12,
            background: "#0f172a",
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.55,
            textAlign: "center",
            boxShadow: "0 14px 30px rgba(15, 23, 42, 0.22)",
            whiteSpace: "normal",
            wordBreak: "break-word",
            zIndex,
            animation: "meiTooltipFadeIn 0.16s ease",
            ...style,
          }}
        >
          {content}

          {showArrow && <span style={getArrowStyle()} />}
        </span>
      )}

      <style>
        {`
          @keyframes meiTooltipFadeIn {
            from {
              opacity: 0;
              transform: translateY(4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </span>
  );
}