import React, {
  useMemo,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { getTheme } from "../../theme";

type ThemeMode = "light" | "dark";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  mode?: ThemeMode;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
  size?: "sm" | "md" | "lg";
  showSearchButton?: boolean;
  showClearButton?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Search by name, phone, email, tag, or keyword...",
  mode = "light",
  disabled = false,
  className,
  autoFocus = false,
  size = "md",
  showSearchButton = true,
  showClearButton = true,
}) => {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const [focused, setFocused] = useState(false);

  const hasValue = value.trim().length > 0;

  const sizing = useMemo(() => {
    switch (size) {
      case "sm":
        return {
          height: 40,
          fontSize: 13,
          iconSize: 15,
          buttonPadding: "0 12px",
          inputPadding: "0 14px 0 40px",
        };
      case "lg":
        return {
          height: 50,
          fontSize: 15,
          iconSize: 18,
          buttonPadding: "0 16px",
          inputPadding: "0 16px 0 46px",
        };
      case "md":
      default:
        return {
          height: 44,
          fontSize: 14,
          iconSize: 16,
          buttonPadding: "0 14px",
          inputPadding: "0 14px 0 42px",
        };
    }
  }, [size]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch?.(value.trim());
    }

    if (event.key === "Escape" && hasValue) {
      onChange("");
      onClear?.();
    }
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <div
      className={className}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: sizing.iconSize,
            color: focused ? theme.primary : theme.subText,
            pointerEvents: "none",
            transition: "color 0.2s ease",
          }}
        >
          🔍
        </span>

        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            height: sizing.height,
            padding: sizing.inputPadding,
            borderRadius: 14,
            border: `1px solid ${focused ? theme.primary : theme.border}`,
            background: disabled
              ? theme.cardBgSoft ?? theme.sectionBg ?? theme.cardBg
              : theme.inputBg ?? theme.cardBg,
            color: theme.text,
            fontSize: sizing.fontSize,
            fontWeight: 500,
            outline: "none",
            transition: "all 0.2s ease",
            boxShadow: focused
              ? `0 0 0 3px ${theme.primary}18`
              : "none",
          }}
        />

        {showClearButton && hasValue ? (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear search"
            style={{
              position: "absolute",
              right: showSearchButton ? 92 : 10,
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              color: theme.subText,
              fontSize: 16,
              fontWeight: 700,
              cursor: disabled ? "not-allowed" : "pointer",
              padding: 4,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        ) : null}
      </div>

      {showSearchButton ? (
        <button
          type="button"
          onClick={() => onSearch?.(value.trim())}
          disabled={disabled}
          style={{
            height: sizing.height,
            padding: sizing.buttonPadding,
            borderRadius: 14,
            border: `1px solid ${theme.primary}`,
            background: theme.primary,
            color: theme.inverseText ?? "#ffffff",
            fontSize: sizing.fontSize,
            fontWeight: 700,
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            boxShadow:
              mode === "dark"
                ? "0 8px 18px rgba(0,0,0,0.24)"
                : "0 10px 24px rgba(37,99,235,0.20)",
            whiteSpace: "nowrap",
          }}
        >
          Search
        </button>
      ) : null}
    </div>
  );
};

export default SearchInput;