import type { ChangeEvent, KeyboardEvent } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type SearchInputProps = {
  mode: ThemeMode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean;
  autoFocus?: boolean;
  width?: number | string;
};

export default function SearchInput({
  mode,
  value,
  onChange,
  placeholder = "Search...",
  onSearch,
  disabled = false,
  loading = false,
  compact = false,
  autoFocus = false,
  width = "100%",
}: SearchInputProps) {
  const theme = getTheme(mode);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled || loading) return;
    onChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch?.(value.trim());
    }
  };

  const handleClear = () => {
    if (disabled || loading) return;
    onChange("");
    onSearch?.("");
  };

  const height = compact ? 40 : 46;
  const iconSize = compact ? 14 : 15;

  return (
    <div
      style={{
        width,
        minWidth: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 14,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.mutedText,
            fontSize: iconSize,
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {loading ? "◌" : "⌕"}
        </span>

        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          style={{
            width: "100%",
            height,
            borderRadius: 14,
            border: `1px solid ${theme.border}`,
            outline: "none",
            background: theme.inputBg ?? theme.cardBg,
            color: theme.text,
            paddingLeft: 40,
            paddingRight: value ? 42 : 14,
            fontSize: 14,
            fontWeight: 500,
            transition: "all 0.2s ease",
            boxSizing: "border-box",
          }}
        />

        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            style={{
              position: "absolute",
              right: 10,
              width: 24,
              height: 24,
              border: "none",
              outline: "none",
              borderRadius: 999,
              background:
                mode === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(15,23,42,0.08)",
              color: theme.subText,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 12,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}