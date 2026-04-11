import type { CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type CompanyData = {
  companyName: string;
  brandName: string;
  businessType: string;
  gstNumber: string;
  reraNumber: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  currency?: string;
};

type CompanySettingsCardProps = {
  mode?: ThemeMode;
  company: CompanyData;
  onChange: (field: keyof CompanyData, value: string) => void;
  onSave?: () => void;
  onUploadLogo?: () => void;
};

export default function CompanySettingsCard({
  mode = "light",
  company,
  onChange,
  onSave,
  onUploadLogo,
}: CompanySettingsCardProps) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          Company Settings
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.5,
            color: theme.subText,
          }}
        >
          Manage organization identity, contact information, compliance details,
          and brand configuration.
        </div>
      </div>

      <div style={grid2Style}>
        <Field
          label="Company Name"
          value={company.companyName}
          onChange={(value) => onChange("companyName", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Brand Name"
          value={company.brandName}
          onChange={(value) => onChange("brandName", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Business Type"
          value={company.businessType}
          onChange={(value) => onChange("businessType", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="GST Number"
          value={company.gstNumber}
          onChange={(value) => onChange("gstNumber", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="RERA Number"
          value={company.reraNumber}
          onChange={(value) => onChange("reraNumber", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Business Email"
          value={company.email}
          onChange={(value) => onChange("email", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Business Phone"
          value={company.phone}
          onChange={(value) => onChange("phone", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Website"
          value={company.website}
          onChange={(value) => onChange("website", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Address"
          value={company.address}
          onChange={(value) => onChange("address", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="City"
          value={company.city}
          onChange={(value) => onChange("city", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="State"
          value={company.state}
          onChange={(value) => onChange("state", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Pincode"
          value={company.pincode}
          onChange={(value) => onChange("pincode", value)}
          theme={theme}
          mode={mode}
        />

        <Field
          label="Default Currency"
          value={company.currency ?? ""}
          onChange={(value) => onChange("currency", value)}
          theme={theme}
          mode={mode}
        />
      </div>

      <div style={infoGridStyle}>
        <InfoCard title="Compliance Status" value="Active" theme={theme} />
        <InfoCard title="Invoice Currency" value={company.currency || "INR"} theme={theme} />
        <InfoCard title="Business Region" value={company.state || "Tamil Nadu"} theme={theme} />
      </div>

      <div style={actionsRowStyle}>
        <button type="button" onClick={onSave} style={primaryButtonStyle(theme)}>
          Save Company Details
        </button>

        <button
          type="button"
          onClick={onUploadLogo}
          style={secondaryButtonStyle(theme)}
        >
          Upload Logo
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  theme,
  mode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  theme: ReturnType<typeof getTheme>;
  mode: ThemeMode;
}) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: theme.subText,
        }}
      >
        {label}
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle(theme, mode)}
      />
    </label>
  );
}

function InfoCard({
  title,
  value,
  theme,
}: {
  title: string;
  value: string;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        padding: 16,
        background: theme.cardBgSoft,
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: theme.subText,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 18,
          fontWeight: 800,
          color: theme.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const grid2Style: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
};

const infoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginTop: 20,
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 18,
};

function inputStyle(
  theme: ReturnType<typeof getTheme>,
  mode: ThemeMode
): CSSProperties {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${theme.border}`,
    outline: "none",
    background: theme.inputBg,
    color: theme.text,
    fontSize: 14,
    boxSizing: "border-box",
    boxShadow:
      mode === "dark"
        ? "inset 0 1px 0 rgba(255,255,255,0.02)"
        : "inset 0 1px 0 rgba(255,255,255,0.6)",
  };
}

function primaryButtonStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: "none",
    borderRadius: 12,
    padding: "11px 16px",
    background: theme.primary,
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function secondaryButtonStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: "11px 16px",
    background: theme.cardBgSoft,
    color: theme.text,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}