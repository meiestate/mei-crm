import { useMemo, useState } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type BillingSubscriptionPageProps = {
  mode: ThemeMode;
};

type PlanName = "Starter" | "Growth" | "Pro" | "Enterprise";
type BillingCycle = "Monthly" | "Yearly";
type SubscriptionStatus =
  | "Trialing"
  | "Active"
  | "Past Due"
  | "Cancelled"
  | "Expired"
  | "Suspended";
type InvoiceStatus = "Paid" | "Pending" | "Failed" | "Refunded" | "Overdue";

type PlanFeature = {
  label: string;
  included: boolean;
};

type Plan = {
  id: string;
  name: PlanName;
  monthlyPrice: number;
  yearlyPrice: number;
  recommended?: boolean;
  features: PlanFeature[];
};

type Invoice = {
  id: string;
  invoiceNo: string;
  date: string;
  amount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
};

type UsageItem = {
  label: string;
  used: number;
  limit: number;
  unit?: string;
};

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 999,
    yearlyPrice: 9990,
    features: [
      { label: "Up to 3 team members", included: true },
      { label: "1,000 leads", included: true },
      { label: "Basic pipeline management", included: true },
      { label: "Email support", included: true },
      { label: "Advanced automation", included: false },
      { label: "API access", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 2499,
    yearlyPrice: 24990,
    recommended: true,
    features: [
      { label: "Up to 10 team members", included: true },
      { label: "10,000 leads", included: true },
      { label: "Advanced pipeline + tasks", included: true },
      { label: 'WhatsApp + email integration', included: true },
      { label: "Basic automation workflows", included: true },
      { label: "API access", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 4999,
    yearlyPrice: 49990,
    features: [
      { label: "Up to 25 team members", included: true },
      { label: "Unlimited leads", included: true },
      { label: "Advanced automation", included: true },
      { label: "Role-based access control", included: true },
      { label: "API access", included: true },
      { label: "Priority support", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { label: "Custom seats & scale", included: true },
      { label: "Custom onboarding", included: true },
      { label: "Advanced security controls", included: true },
      { label: "Dedicated success manager", included: true },
      { label: "Custom integrations", included: true },
      { label: "SLA support", included: true },
    ],
  },
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv_001",
    invoiceNo: "MEI-2026-0012",
    date: "2026-04-01",
    amount: 2499,
    tax: 450,
    total: 2949,
    status: "Paid",
  },
  {
    id: "inv_002",
    invoiceNo: "MEI-2026-0011",
    date: "2026-03-01",
    amount: 2499,
    tax: 450,
    total: 2949,
    status: "Paid",
  },
  {
    id: "inv_003",
    invoiceNo: "MEI-2026-0010",
    date: "2026-02-01",
    amount: 2499,
    tax: 450,
    total: 2949,
    status: "Paid",
  },
  {
    id: "inv_004",
    invoiceNo: "MEI-2026-0009",
    date: "2026-01-01",
    amount: 2499,
    tax: 450,
    total: 2949,
    status: "Pending",
  },
];

const USAGE_ITEMS: UsageItem[] = [
  { label: "Team Members", used: 7, limit: 10 },
  { label: "Leads", used: 6480, limit: 10000 },
  { label: "Storage", used: 18, limit: 50, unit: "GB" },
  { label: "Automation Runs", used: 820, limit: 1000 },
  { label: "WhatsApp Credits", used: 1900, limit: 2500 },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusColors(
  status: SubscriptionStatus | InvoiceStatus,
  mode: ThemeMode
) {
  const dark = mode === "dark";

  const map: Record<string, { bg: string; text: string; border: string }> = {
    Active: {
      bg: dark ? "rgba(34,197,94,0.16)" : "rgba(34,197,94,0.12)",
      text: dark ? "#86efac" : "#166534",
      border: dark ? "rgba(34,197,94,0.35)" : "rgba(34,197,94,0.28)",
    },
    Paid: {
      bg: dark ? "rgba(34,197,94,0.16)" : "rgba(34,197,94,0.12)",
      text: dark ? "#86efac" : "#166534",
      border: dark ? "rgba(34,197,94,0.35)" : "rgba(34,197,94,0.28)",
    },
    Trialing: {
      bg: dark ? "rgba(59,130,246,0.16)" : "rgba(59,130,246,0.12)",
      text: dark ? "#93c5fd" : "#1d4ed8",
      border: dark ? "rgba(59,130,246,0.35)" : "rgba(59,130,246,0.28)",
    },
    Pending: {
      bg: dark ? "rgba(245,158,11,0.16)" : "rgba(245,158,11,0.12)",
      text: dark ? "#fcd34d" : "#92400e",
      border: dark ? "rgba(245,158,11,0.35)" : "rgba(245,158,11,0.28)",
    },
    "Past Due": {
      bg: dark ? "rgba(239,68,68,0.16)" : "rgba(239,68,68,0.12)",
      text: dark ? "#fca5a5" : "#b91c1c",
      border: dark ? "rgba(239,68,68,0.35)" : "rgba(239,68,68,0.28)",
    },
    Failed: {
      bg: dark ? "rgba(239,68,68,0.16)" : "rgba(239,68,68,0.12)",
      text: dark ? "#fca5a5" : "#b91c1c",
      border: dark ? "rgba(239,68,68,0.35)" : "rgba(239,68,68,0.28)",
    },
    Overdue: {
      bg: dark ? "rgba(239,68,68,0.16)" : "rgba(239,68,68,0.12)",
      text: dark ? "#fca5a5" : "#b91c1c",
      border: dark ? "rgba(239,68,68,0.35)" : "rgba(239,68,68,0.28)",
    },
    Cancelled: {
      bg: dark ? "rgba(107,114,128,0.18)" : "rgba(107,114,128,0.12)",
      text: dark ? "#d1d5db" : "#374151",
      border: dark ? "rgba(107,114,128,0.35)" : "rgba(107,114,128,0.25)",
    },
    Refunded: {
      bg: dark ? "rgba(107,114,128,0.18)" : "rgba(107,114,128,0.12)",
      text: dark ? "#d1d5db" : "#374151",
      border: dark ? "rgba(107,114,128,0.35)" : "rgba(107,114,128,0.25)",
    },
    Expired: {
      bg: dark ? "rgba(107,114,128,0.18)" : "rgba(107,114,128,0.12)",
      text: dark ? "#d1d5db" : "#374151",
      border: dark ? "rgba(107,114,128,0.35)" : "rgba(107,114,128,0.25)",
    },
    Suspended: {
      bg: dark ? "rgba(239,68,68,0.16)" : "rgba(239,68,68,0.12)",
      text: dark ? "#fca5a5" : "#b91c1c",
      border: dark ? "rgba(239,68,68,0.35)" : "rgba(239,68,68,0.28)",
    },
  };

  return (
    map[status] || {
      bg: dark ? "rgba(107,114,128,0.18)" : "rgba(107,114,128,0.12)",
      text: dark ? "#d1d5db" : "#374151",
      border: dark ? "rgba(107,114,128,0.35)" : "rgba(107,114,128,0.25)",
    }
  );
}

export default function BillingSubscriptionPage({
  mode,
}: BillingSubscriptionPageProps) {
  const theme = getTheme(mode);

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("Monthly");
  const [currentPlan] = useState<PlanName>("Growth");
  const [subscriptionStatus] = useState<SubscriptionStatus>("Active");
  const [autoRenew, setAutoRenew] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");

  const activePlan = useMemo(
    () => PLANS.find((plan) => plan.name === currentPlan) || PLANS[1],
    [currentPlan]
  );

  const planAmount =
    billingCycle === "Monthly"
      ? activePlan.name === "Enterprise"
        ? 0
        : activePlan.monthlyPrice
      : activePlan.name === "Enterprise"
      ? 0
      : activePlan.yearlyPrice;

  const addOnCost = 799;
  const discount = couponCode.trim().toUpperCase() === "MEI100" ? 100 : 0;
  const taxableAmount = Math.max(planAmount + addOnCost - discount, 0);
  const gst = Math.round(taxableAmount * 0.18);
  const total = taxableAmount + gst;

  const filteredInvoices = useMemo(() => {
    const keyword = invoiceSearch.trim().toLowerCase();
    if (!keyword) return MOCK_INVOICES;

    return MOCK_INVOICES.filter(
      (invoice) =>
        invoice.invoiceNo.toLowerCase().includes(keyword) ||
        invoice.status.toLowerCase().includes(keyword) ||
        formatDate(invoice.date).toLowerCase().includes(keyword)
    );
  }, [invoiceSearch]);

  const cardStyle: React.CSSProperties = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 20,
    padding: 20,
    boxShadow:
      mode === "dark"
        ? "0 10px 30px rgba(0,0,0,0.24)"
        : "0 10px 30px rgba(15,23,42,0.06)",
  };

  const subtleCardStyle: React.CSSProperties = {
    background: theme.sectionBg,
    border: `1px solid ${theme.borderSoft ?? theme.border}`,
    borderRadius: 18,
    padding: 16,
  };

  const buttonBase: React.CSSProperties = {
    border: "none",
    borderRadius: 12,
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "0.2s ease",
  };

  const primaryButton: React.CSSProperties = {
    ...buttonBase,
    background: theme.primary,
    color: theme.inverseText,
  };

  const secondaryButton: React.CSSProperties = {
    ...buttonBase,
    background: theme.cardBgSoft ?? theme.sectionBg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: theme.inputBg ?? theme.sectionBg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    outline: "none",
    fontSize: 14,
  };

  const tableCellStyle: React.CSSProperties = {
    padding: "14px 12px",
    borderBottom: `1px solid ${theme.borderSoft ?? theme.border}`,
    fontSize: 14,
    color: theme.text,
    textAlign: "left",
    verticalAlign: "middle",
  };

  const statusTone = getStatusColors(subscriptionStatus, mode);

  return (
    <div
      style={{
        minHeight: "100%",
        background: theme.pageBg,
        color: theme.text,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
              color: theme.text,
              letterSpacing: -0.4,
            }}
          >
            Billing & Subscription
          </h1>
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              color: theme.subText,
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: 760,
            }}
          >
            Manage your current plan, payment method, usage limits, invoices,
            GST billing details, and subscription actions from one place.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button style={secondaryButton}>Download Latest Invoice</button>
          <button style={secondaryButton}>Update Payment Method</button>
          <button style={primaryButton}>Upgrade Plan</button>
        </div>
      </div>

      <div
        style={{
          ...subtleCardStyle,
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          border: `1px solid ${statusTone.border}`,
          background: statusTone.bg,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: statusTone.text,
              marginBottom: 4,
            }}
          >
            Subscription Healthy
          </div>
          <div style={{ fontSize: 14, color: theme.text }}>
            Your plan is active. Next renewal is scheduled for{" "}
            <strong>15 Apr 2026</strong>.
          </div>
        </div>

        <div
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            border: `1px solid ${statusTone.border}`,
            background: theme.cardBg,
            color: statusTone.text,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {subscriptionStatus}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle}>
          <div style={{ color: theme.subText, fontSize: 13, marginBottom: 8 }}>
            Current Plan
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: -0.3,
                color: theme.text,
              }}
            >
              {currentPlan}
            </div>
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                border: `1px solid ${statusTone.border}`,
                background: statusTone.bg,
                color: statusTone.text,
              }}
            >
              {subscriptionStatus}
            </div>
          </div>
          <div style={{ fontSize: 14, color: theme.subText, marginBottom: 8 }}>
            Billing cycle: <strong style={{ color: theme.text }}>{billingCycle}</strong>
          </div>
          <div style={{ fontSize: 14, color: theme.subText }}>
            Renewal date: <strong style={{ color: theme.text }}>15 Apr 2026</strong>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ color: theme.subText, fontSize: 13, marginBottom: 8 }}>
            Next Billing
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: -0.3,
              color: theme.text,
              marginBottom: 10,
            }}
          >
            {formatCurrency(total)}
          </div>
          <div style={{ fontSize: 14, color: theme.subText, marginBottom: 8 }}>
            Includes plan + add-ons + GST
          </div>
          <div style={{ fontSize: 14, color: theme.subText }}>
            Auto-renew:{" "}
            <strong style={{ color: autoRenew ? theme.success : theme.warning }}>
              {autoRenew ? "Enabled" : "Disabled"}
            </strong>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ color: theme.subText, fontSize: 13, marginBottom: 8 }}>
            Payment Method
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 8,
            }}
          >
            Visa ending in 4242
          </div>
          <div style={{ fontSize: 14, color: theme.subText, marginBottom: 12 }}>
            Expiry: 09 / 2028
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 14,
              color: theme.text,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={autoRenew}
              onChange={() => setAutoRenew((prev) => !prev)}
            />
            Enable auto-renewal
          </label>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 800,
                  color: theme.text,
                }}
              >
                Plan Comparison
              </h2>
              <p
                style={{
                  marginTop: 6,
                  marginBottom: 0,
                  fontSize: 14,
                  color: theme.subText,
                }}
              >
                Compare features and switch to the right growth tier for your
                CRM.
              </p>
            </div>

            <div
              style={{
                display: "inline-flex",
                background: theme.sectionBg,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: 4,
                gap: 4,
              }}
            >
              <button
                onClick={() => setBillingCycle("Monthly")}
                style={{
                  ...buttonBase,
                  padding: "8px 12px",
                  background:
                    billingCycle === "Monthly" ? theme.primary : "transparent",
                  color:
                    billingCycle === "Monthly"
                      ? theme.inverseText
                      : theme.text,
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("Yearly")}
                style={{
                  ...buttonBase,
                  padding: "8px 12px",
                  background:
                    billingCycle === "Yearly" ? theme.primary : "transparent",
                  color:
                    billingCycle === "Yearly" ? theme.inverseText : theme.text,
                }}
              >
                Yearly
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            {PLANS.map((plan) => {
              const isCurrent = plan.name === currentPlan;
              const price =
                billingCycle === "Monthly"
                  ? plan.monthlyPrice
                  : plan.yearlyPrice;

              return (
                <div
                  key={plan.id}
                  style={{
                    border: `1px solid ${
                      isCurrent ? theme.primary : theme.border
                    }`,
                    background: isCurrent ? theme.cardBgSoft : theme.cardBg,
                    borderRadius: 18,
                    padding: 16,
                    position: "relative",
                  }}
                >
                  {plan.recommended && (
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "6px 8px",
                        borderRadius: 999,
                        background: theme.primary,
                        color: theme.inverseText,
                      }}
                    >
                      Recommended
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: theme.text,
                      marginBottom: 8,
                    }}
                  >
                    {plan.name}
                  </div>

                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 900,
                      color: theme.text,
                      marginBottom: 4,
                    }}
                  >
                    {plan.name === "Enterprise"
                      ? "Custom"
                      : formatCurrency(price)}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: theme.subText,
                      marginBottom: 16,
                    }}
                  >
                    {plan.name === "Enterprise"
                      ? "Custom quotation for advanced teams"
                      : `per ${billingCycle === "Monthly" ? "month" : "year"}`}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginBottom: 18,
                    }}
                  >
                    {plan.features.map((feature) => (
                      <div
                        key={feature.label}
                        style={{
                          fontSize: 13,
                          color: feature.included ? theme.text : theme.mutedText,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span>{feature.included ? "✓" : "—"}</span>
                        <span>{feature.label}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    style={
                      isCurrent
                        ? secondaryButton
                        : plan.name === "Enterprise"
                        ? secondaryButton
                        : primaryButton
                    }
                  >
                    {isCurrent
                      ? "Current Plan"
                      : plan.name === "Enterprise"
                      ? "Contact Sales"
                      : "Choose Plan"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div style={cardStyle}>
            <h2
              style={{
                marginTop: 0,
                marginBottom: 16,
                fontSize: 18,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Usage Overview
            </h2>

            <div style={{ display: "grid", gap: 14 }}>
              {USAGE_ITEMS.map((item) => {
                const percent = Math.min((item.used / item.limit) * 100, 100);
                const labelRight = `${item.used}/${item.limit}${
                  item.unit ? ` ${item.unit}` : ""
                }`;

                return (
                  <div key={item.label} style={subtleCardStyle}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: 8,
                        fontSize: 14,
                      }}
                    >
                      <span style={{ color: theme.text, fontWeight: 700 }}>
                        {item.label}
                      </span>
                      <span style={{ color: theme.subText }}>{labelRight}</span>
                    </div>

                    <div
                      style={{
                        height: 10,
                        borderRadius: 999,
                        background: theme.borderSoft ?? theme.border,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: theme.primary,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 12,
                        color: percent >= 85 ? theme.warning : theme.subText,
                        fontWeight: 600,
                      }}
                    >
                      {percent >= 85
                        ? "Usage nearing limit"
                        : "Healthy usage range"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                marginTop: 0,
                marginBottom: 14,
                fontSize: 18,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Billing Summary
            </h2>

            <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: theme.subText,
                }}
              >
                <span>Plan Amount</span>
                <span style={{ color: theme.text }}>{formatCurrency(planAmount)}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: theme.subText,
                }}
              >
                <span>Add-ons</span>
                <span style={{ color: theme.text }}>{formatCurrency(addOnCost)}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: theme.subText,
                }}
              >
                <span>Discount</span>
                <span style={{ color: discount > 0 ? theme.success : theme.text }}>
                  - {formatCurrency(discount)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: theme.subText,
                }}
              >
                <span>GST (18%)</span>
                <span style={{ color: theme.text }}>{formatCurrency(gst)}</span>
              </div>

              <div
                style={{
                  height: 1,
                  background: theme.borderSoft ?? theme.border,
                  margin: "2px 0",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 16,
                  fontWeight: 800,
                  color: theme.text,
                }}
              >
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: theme.subText,
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Coupon Code
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  style={inputStyle}
                />
                <button style={secondaryButton}>Apply</button>
              </div>
            </div>

            <div
              style={{
                fontSize: 12,
                color: theme.subText,
                lineHeight: 1.6,
              }}
            >
              Try <strong>MEI100</strong> for a sample discount preview in this UI.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.55fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 800,
                  color: theme.text,
                }}
              >
                Invoice History
              </h2>
              <p
                style={{
                  marginTop: 6,
                  marginBottom: 0,
                  fontSize: 14,
                  color: theme.subText,
                }}
              >
                Search, review, and download your previous billing records.
              </p>
            </div>

            <div style={{ width: 240 }}>
              <input
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                placeholder="Search invoice"
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              overflowX: "auto",
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: theme.cardBg,
              }}
            >
              <thead
                style={{
                  background: theme.tableHeadBg ?? theme.sectionBg,
                }}
              >
                <tr>
                  <th style={tableCellStyle}>Invoice No</th>
                  <th style={tableCellStyle}>Date</th>
                  <th style={tableCellStyle}>Amount</th>
                  <th style={tableCellStyle}>Status</th>
                  <th style={tableCellStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        ...tableCellStyle,
                        textAlign: "center",
                        color: theme.subText,
                        padding: 24,
                      }}
                    >
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => {
                    const invoiceTone = getStatusColors(invoice.status, mode);

                    return (
                      <tr
                        key={invoice.id}
                        style={{
                          background: theme.rowBg ?? theme.cardBg,
                        }}
                      >
                        <td style={tableCellStyle}>
                          <div style={{ fontWeight: 700 }}>{invoice.invoiceNo}</div>
                        </td>
                        <td style={tableCellStyle}>{formatDate(invoice.date)}</td>
                        <td style={tableCellStyle}>
                          <div style={{ fontWeight: 700 }}>
                            {formatCurrency(invoice.total)}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: theme.subText,
                              marginTop: 4,
                            }}
                          >
                            Base {formatCurrency(invoice.amount)} + Tax{" "}
                            {formatCurrency(invoice.tax)}
                          </div>
                        </td>
                        <td style={tableCellStyle}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "6px 10px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 700,
                              background: invoiceTone.bg,
                              color: invoiceTone.text,
                              border: `1px solid ${invoiceTone.border}`,
                            }}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td style={tableCellStyle}>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button style={secondaryButton}>View</button>
                            <button style={secondaryButton}>Download PDF</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div style={cardStyle}>
            <h2
              style={{
                marginTop: 0,
                marginBottom: 14,
                fontSize: 18,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Billing Address & GST
            </h2>

            <div style={{ display: "grid", gap: 12 }}>
              <div style={subtleCardStyle}>
                <div
                  style={{
                    fontSize: 12,
                    color: theme.subText,
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Company
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>
                  MEI CRM Technologies Pvt Ltd
                </div>
              </div>

              <div style={subtleCardStyle}>
                <div
                  style={{
                    fontSize: 12,
                    color: theme.subText,
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Billing Address
                </div>
                <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.6 }}>
                  No. 24, Anna Salai,
                  <br />
                  Teynampet, Chennai,
                  <br />
                  Tamil Nadu, India - 600018
                </div>
              </div>

              <div style={subtleCardStyle}>
                <div
                  style={{
                    fontSize: 12,
                    color: theme.subText,
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  GSTIN
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>
                  33ABCDE1234F1Z9
                </div>
              </div>

              <button style={secondaryButton}>Edit Billing Details</button>
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              border: `1px solid ${
                mode === "dark" ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.2)"
              }`,
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 10,
                fontSize: 18,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Subscription Actions
            </h2>

            <p
              style={{
                marginTop: 0,
                marginBottom: 16,
                fontSize: 14,
                color: theme.subText,
                lineHeight: 1.6,
              }}
            >
              Need to change direction? You can pause renewal, downgrade your
              plan, or request account cancellation.
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <button style={secondaryButton}>Pause Subscription</button>
              <button style={secondaryButton}>Downgrade Plan</button>
              <button
                style={{
                  ...buttonBase,
                  background:
                    mode === "dark"
                      ? "rgba(239,68,68,0.16)"
                      : "rgba(239,68,68,0.10)",
                  color: mode === "dark" ? "#fca5a5" : "#b91c1c",
                  border: `1px solid ${
                    mode === "dark"
                      ? "rgba(239,68,68,0.30)"
                      : "rgba(239,68,68,0.22)"
                  }`,
                }}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}