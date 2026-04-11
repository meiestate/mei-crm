import type { CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type BillingData = {
  currentPlan: string;
  renewalDate: string;
  seatUsage: string;
  monthlyBill: string;
  paymentMethod?: string;
  billingEmail?: string;
};

type BillingCardProps = {
  mode?: ThemeMode;
  billing: BillingData;
  onUpgradePlan?: () => void;
  onDownloadInvoice?: () => void;
  onManagePaymentMethod?: () => void;
  onViewBillingHistory?: () => void;
};

export default function BillingCard({
  mode = "light",
  billing,
  onUpgradePlan,
  onDownloadInvoice,
  onManagePaymentMethod,
  onViewBillingHistory,
}: BillingCardProps) {
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
          Billing & Subscription
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.5,
            color: theme.subText,
          }}
        >
          Monitor your plan, renewal schedule, payment method, invoices, and seat usage.
        </div>
      </div>

      <div style={statsGridStyle}>
        <InfoCard title="Current Plan" value={billing.currentPlan} theme={theme} />
        <InfoCard title="Renewal Date" value={billing.renewalDate} theme={theme} />
        <InfoCard title="Seat Usage" value={billing.seatUsage} theme={theme} />
        <InfoCard title="Monthly Bill" value={billing.monthlyBill} theme={theme} />
      </div>

      <div style={detailsGridStyle}>
        <DetailRow
          label="Payment Method"
          value={billing.paymentMethod || "No payment method added"}
          theme={theme}
        />
        <DetailRow
          label="Billing Email"
          value={billing.billingEmail || "No billing email configured"}
          theme={theme}
        />
      </div>

      <div style={actionsRowStyle}>
        <button
          type="button"
          onClick={onUpgradePlan}
          style={primaryButtonStyle(theme)}
        >
          Upgrade Plan
        </button>

        <button
          type="button"
          onClick={onDownloadInvoice}
          style={secondaryButtonStyle(theme)}
        >
          Download Invoice
        </button>

        <button
          type="button"
          onClick={onManagePaymentMethod}
          style={secondaryButtonStyle(theme)}
        >
          Manage Payment Method
        </button>

        <button
          type="button"
          onClick={onViewBillingHistory}
          style={secondaryButtonStyle(theme)}
        >
          Billing History
        </button>
      </div>
    </div>
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
          fontSize: 20,
          fontWeight: 800,
          color: theme.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        padding: "14px 16px",
        border: `1px solid ${theme.border}`,
        borderRadius: 14,
        background: theme.cardBgSoft,
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
        {label}
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: 14,
          fontWeight: 700,
          color: theme.text,
          lineHeight: 1.5,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
};

const detailsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
  marginTop: 20,
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 18,
};

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