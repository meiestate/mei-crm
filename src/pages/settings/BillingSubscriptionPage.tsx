// src/pages/settings/BillingSubscriptionPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type BillingSubscriptionPageProps = {
  mode: ThemeMode;
  onToggleTheme?: () => void;
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
type BillingProvider = "Razorpay" | "Stripe";

type PlanFeature = {
  label: string;
  included: boolean;
};

type Plan = {
  id: string;
  name: PlanName;
  monthlyPrice: number;
  yearlyPrice: number;
  seatPriceMonthly?: number;
  seatPriceYearly?: number;
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
  planName: PlanName;
  billingCycle: BillingCycle;
  paidVia: BillingProvider;
  description?: string;
};

type UsageItem = {
  label: string;
  used: number;
  limit: number;
  unit?: string;
};

type AddOnKey =
  | "whatsappCredits"
  | "extraStorage"
  | "advancedAutomation"
  | "prioritySupport";

type AddOn = {
  key: AddOnKey;
  label: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  selected: boolean;
};

type BillingState = {
  billingCycle: BillingCycle;
  currentPlan: PlanName;
  subscriptionStatus: SubscriptionStatus;
  autoRenew: boolean;
  provider: BillingProvider;
  renewalDate: string;
  teamSeats: number;
  baseIncludedSeats: number;
  paymentMethodLabel: string;
  paymentMethodExpiry: string;
  couponCode: string;
  billingAddress: {
    companyName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    gstin: string;
    billingEmail: string;
  };
  usageItems: UsageItem[];
  addOns: AddOn[];
  invoices: Invoice[];
};

const STORAGE_KEY = "mei-crm-billing-subscription";

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 999,
    yearlyPrice: 9990,
    seatPriceMonthly: 199,
    seatPriceYearly: 1990,
    features: [
      { label: "Up to 3 included seats", included: true },
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
    seatPriceMonthly: 299,
    seatPriceYearly: 2990,
    recommended: true,
    features: [
      { label: "Up to 10 included seats", included: true },
      { label: "10,000 leads", included: true },
      { label: "Advanced pipeline + tasks", included: true },
      { label: "WhatsApp + email integration", included: true },
      { label: "Basic automation workflows", included: true },
      { label: "API access", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 4999,
    yearlyPrice: 49990,
    seatPriceMonthly: 399,
    seatPriceYearly: 3990,
    features: [
      { label: "Up to 25 included seats", included: true },
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
    seatPriceMonthly: 0,
    seatPriceYearly: 0,
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

const DEFAULT_STATE: BillingState = {
  billingCycle: "Monthly",
  currentPlan: "Growth",
  subscriptionStatus: "Past Due",
  autoRenew: true,
  provider: "Razorpay",
  renewalDate: "2026-04-15",
  teamSeats: 12,
  baseIncludedSeats: 10,
  paymentMethodLabel: "Visa ending in 4242",
  paymentMethodExpiry: "09 / 2028",
  couponCode: "",
  billingAddress: {
    companyName: "MEI CRM Technologies Pvt Ltd",
    addressLine1: "No. 24, Anna Salai",
    addressLine2: "Teynampet",
    city: "Chennai",
    state: "Tamil Nadu",
    postalCode: "600018",
    country: "India",
    gstin: "33ABCDE1234F1Z9",
    billingEmail: "billing@meicrm.com",
  },
  usageItems: [
    { label: "Team Members", used: 12, limit: 15 },
    { label: "Leads", used: 6480, limit: 10000 },
    { label: "Storage", used: 18, limit: 50, unit: "GB" },
    { label: "Automation Runs", used: 820, limit: 1000 },
    { label: "WhatsApp Credits", used: 1900, limit: 2500 },
  ],
  addOns: [
    {
      key: "whatsappCredits",
      label: "WhatsApp Credits Pack",
      description: "Extra monthly outbound conversation credits",
      monthlyPrice: 499,
      yearlyPrice: 4990,
      selected: true,
    },
    {
      key: "extraStorage",
      label: "Extra Storage (100 GB)",
      description: "For documents, recordings, and media uploads",
      monthlyPrice: 299,
      yearlyPrice: 2990,
      selected: false,
    },
    {
      key: "advancedAutomation",
      label: "Advanced Automation Bundle",
      description: "Extra workflow runs and premium automation actions",
      monthlyPrice: 799,
      yearlyPrice: 7990,
      selected: true,
    },
    {
      key: "prioritySupport",
      label: "Priority Support",
      description: "Faster response SLAs and premium support queue",
      monthlyPrice: 999,
      yearlyPrice: 9990,
      selected: false,
    },
  ],
  invoices: [
    {
      id: "inv_001",
      invoiceNo: "MEI-2026-0012",
      date: "2026-04-01",
      amount: 3597,
      tax: 647,
      total: 4244,
      status: "Failed",
      planName: "Growth",
      billingCycle: "Monthly",
      paidVia: "Razorpay",
      description: "Growth monthly subscription + selected add-ons + extra seats",
    },
    {
      id: "inv_002",
      invoiceNo: "MEI-2026-0011",
      date: "2026-03-01",
      amount: 3597,
      tax: 647,
      total: 4244,
      status: "Paid",
      planName: "Growth",
      billingCycle: "Monthly",
      paidVia: "Razorpay",
      description: "Growth monthly subscription + selected add-ons + extra seats",
    },
    {
      id: "inv_003",
      invoiceNo: "MEI-2026-0010",
      date: "2026-02-01",
      amount: 3597,
      tax: 647,
      total: 4244,
      status: "Paid",
      planName: "Growth",
      billingCycle: "Monthly",
      paidVia: "Stripe",
      description: "Growth monthly subscription + selected add-ons + extra seats",
    },
    {
      id: "inv_004",
      invoiceNo: "MEI-2026-0009",
      date: "2026-01-01",
      amount: 3597,
      tax: 647,
      total: 4244,
      status: "Refunded",
      planName: "Growth",
      billingCycle: "Monthly",
      paidVia: "Stripe",
      description: "Growth monthly subscription + selected add-ons + extra seats",
    },
  ],
};

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

function getSafeBillingState(): BillingState {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;

    const parsed = JSON.parse(raw) as Partial<BillingState>;

    return {
      ...DEFAULT_STATE,
      ...parsed,
      billingAddress: {
        ...DEFAULT_STATE.billingAddress,
        ...parsed.billingAddress,
      },
      usageItems: parsed.usageItems ?? DEFAULT_STATE.usageItems,
      addOns: parsed.addOns ?? DEFAULT_STATE.addOns,
      invoices: parsed.invoices ?? DEFAULT_STATE.invoices,
    };
  } catch {
    return DEFAULT_STATE;
  }
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
    map[status] ?? {
      bg: dark ? "rgba(107,114,128,0.18)" : "rgba(107,114,128,0.12)",
      text: dark ? "#d1d5db" : "#374151",
      border: dark ? "rgba(107,114,128,0.35)" : "rgba(107,114,128,0.25)",
    }
  );
}

function useViewport() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    width,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1100,
    isDesktop: width >= 1100,
  };
}

export default function BillingSubscriptionPage({
  mode,
}: BillingSubscriptionPageProps) {
  const theme = getTheme(mode);
  const { isMobile, isTablet } = useViewport();

  const [billingData, setBillingData] = useState<BillingState>(DEFAULT_STATE);
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<PlanName>("Pro");
  const [selectedProvider, setSelectedProvider] =
    useState<BillingProvider>("Razorpay");
  const [toast, setToast] = useState("");

  useEffect(() => {
    setBillingData(getSafeBillingState());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(billingData));
  }, [billingData]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const activePlan = useMemo(
    () => PLANS.find((plan) => plan.name === billingData.currentPlan) ?? PLANS[1],
    [billingData.currentPlan]
  );

  const selectedUpgradePlanData = useMemo(
    () => PLANS.find((plan) => plan.name === selectedUpgradePlan) ?? PLANS[2],
    [selectedUpgradePlan]
  );

  const extraSeatCount = Math.max(
    billingData.teamSeats - billingData.baseIncludedSeats,
    0
  );

  const planAmount =
    billingData.billingCycle === "Monthly"
      ? activePlan.name === "Enterprise"
        ? 0
        : activePlan.monthlyPrice
      : activePlan.name === "Enterprise"
        ? 0
        : activePlan.yearlyPrice;

  const seatPrice =
    billingData.billingCycle === "Monthly"
      ? activePlan.seatPriceMonthly ?? 0
      : activePlan.seatPriceYearly ?? 0;

  const seatsCost = extraSeatCount * seatPrice;

  const addOnCost = billingData.addOns
    .filter((item) => item.selected)
    .reduce(
      (sum, item) =>
        sum +
        (billingData.billingCycle === "Monthly"
          ? item.monthlyPrice
          : item.yearlyPrice),
      0
    );

  const discount =
    billingData.couponCode.trim().toUpperCase() === "MEI100"
      ? 100
      : billingData.couponCode.trim().toUpperCase() === "MEIPRO500"
        ? 500
        : 0;

  const taxableAmount = Math.max(planAmount + seatsCost + addOnCost - discount, 0);
  const gst = Math.round(taxableAmount * 0.18);
  const total = taxableAmount + gst;

  const filteredInvoices = useMemo(() => {
    const keyword = invoiceSearch.trim().toLowerCase();
    if (!keyword) return billingData.invoices;

    return billingData.invoices.filter(
      (invoice) =>
        invoice.invoiceNo.toLowerCase().includes(keyword) ||
        invoice.status.toLowerCase().includes(keyword) ||
        invoice.planName.toLowerCase().includes(keyword) ||
        invoice.paidVia.toLowerCase().includes(keyword) ||
        formatDate(invoice.date).toLowerCase().includes(keyword)
    );
  }, [invoiceSearch, billingData.invoices]);

  const failedInvoice = billingData.invoices.find(
    (invoice) => invoice.status === "Failed" || invoice.status === "Overdue"
  );

  const statusTone = getStatusColors(billingData.subscriptionStatus, mode);

  const pagePadding = isMobile ? 14 : isTablet ? 18 : 24;
  const summaryGridColumns = isMobile
    ? "1fr"
    : isTablet
      ? "repeat(2, minmax(0, 1fr))"
      : "repeat(3, minmax(0, 1fr))";
  const mainTwoColGrid = isMobile ? "1fr" : isTablet ? "1fr" : "1.6fr 1fr";
  const bottomGrid = isMobile ? "1fr" : isTablet ? "1fr" : "1.55fr 1fr";
  const planGridColumns = isMobile
    ? "1fr"
    : isTablet
      ? "repeat(2, minmax(0, 1fr))"
      : "repeat(4, minmax(0, 1fr))";

  const cardStyle: React.CSSProperties = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: isMobile ? 16 : 20,
    padding: isMobile ? 14 : 20,
    boxShadow:
      mode === "dark"
        ? "0 10px 30px rgba(0,0,0,0.24)"
        : "0 10px 30px rgba(15,23,42,0.06)",
    minWidth: 0,
  };

  const subtleCardStyle: React.CSSProperties = {
    background: theme.sectionBg,
    border: `1px solid ${theme.borderSoft ?? theme.border}`,
    borderRadius: isMobile ? 14 : 18,
    padding: isMobile ? 12 : 16,
    minWidth: 0,
  };

  const buttonBase: React.CSSProperties = {
    borderRadius: 12,
    padding: isMobile ? "10px 12px" : "10px 16px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "0.2s ease",
    width: isMobile ? "100%" : undefined,
  };

  const primaryButton: React.CSSProperties = {
    ...buttonBase,
    background: theme.primary,
    color: theme.inverseText,
    border: "none",
  };

  const secondaryButton: React.CSSProperties = {
    ...buttonBase,
    background: theme.cardBgSoft ?? theme.sectionBg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
  };

  const dangerButton: React.CSSProperties = {
    ...buttonBase,
    background:
      mode === "dark" ? "rgba(239,68,68,0.16)" : "rgba(239,68,68,0.10)",
    color: mode === "dark" ? "#fca5a5" : "#b91c1c",
    border: `1px solid ${
      mode === "dark" ? "rgba(239,68,68,0.30)" : "rgba(239,68,68,0.22)"
    }`,
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
    boxSizing: "border-box",
  };

  const tableCellStyle: React.CSSProperties = {
    padding: "14px 12px",
    borderBottom: `1px solid ${theme.borderSoft ?? theme.border}`,
    fontSize: 14,
    color: theme.text,
    textAlign: "left",
    verticalAlign: "middle",
  };

  function updateBillingData<K extends keyof BillingState>(
    key: K,
    value: BillingState[K]
  ) {
    setBillingData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAddOn(addOnKey: AddOnKey) {
    setBillingData((prev) => ({
      ...prev,
      addOns: prev.addOns.map((item) =>
        item.key === addOnKey ? { ...item, selected: !item.selected } : item
      ),
    }));
  }

  function adjustSeats(type: "increment" | "decrement") {
    setBillingData((prev) => {
      const nextSeats =
        type === "increment"
          ? prev.teamSeats + 1
          : Math.max(prev.baseIncludedSeats, prev.teamSeats - 1);

      return {
        ...prev,
        teamSeats: nextSeats,
        usageItems: prev.usageItems.map((item) =>
          item.label === "Team Members"
            ? {
                ...item,
                used: nextSeats,
                limit: Math.max(prev.baseIncludedSeats + 5, nextSeats + 3),
              }
            : item
        ),
      };
    });
  }

  function applyCoupon() {
    const code = billingData.couponCode.trim().toUpperCase();
    if (!code) {
      setToast("Coupon code enter பண்ணு.");
      return;
    }

    if (code === "MEI100" || code === "MEIPRO500") {
      setToast(`Coupon ${code} applied.`);
      return;
    }

    setToast("Invalid coupon code.");
  }

  function openUpgradeModal(planName: PlanName) {
    setSelectedUpgradePlan(planName);
    setSelectedProvider(billingData.provider);
    setIsUpgradeModalOpen(true);
  }

  function confirmUpgradePlan() {
    if (selectedUpgradePlan === "Enterprise") {
      setToast("Enterprise plan-ku sales contact flow open பண்ணலாம்.");
      setIsUpgradeModalOpen(false);
      return;
    }

    const nextPlan = PLANS.find((plan) => plan.name === selectedUpgradePlan);
    if (!nextPlan) return;

    const includedSeatsMap: Record<PlanName, number> = {
      Starter: 3,
      Growth: 10,
      Pro: 25,
      Enterprise: billingData.teamSeats,
    };

    setBillingData((prev) => ({
      ...prev,
      currentPlan: selectedUpgradePlan,
      provider: selectedProvider,
      subscriptionStatus: "Active",
      baseIncludedSeats: includedSeatsMap[selectedUpgradePlan],
      renewalDate: "2026-05-15",
      invoices: [
        {
          id: `inv_${Date.now()}`,
          invoiceNo: `MEI-2026-${String(prev.invoices.length + 13).padStart(
            4,
            "0"
          )}`,
          date: new Date().toISOString().slice(0, 10),
          amount:
            prev.billingCycle === "Monthly"
              ? nextPlan.monthlyPrice
              : nextPlan.yearlyPrice,
          tax: Math.round(
            ((prev.billingCycle === "Monthly"
              ? nextPlan.monthlyPrice
              : nextPlan.yearlyPrice) || 0) * 0.18
          ),
          total: Math.round(
            ((prev.billingCycle === "Monthly"
              ? nextPlan.monthlyPrice
              : nextPlan.yearlyPrice) || 0) * 1.18
          ),
          status: "Pending",
          planName: selectedUpgradePlan,
          billingCycle: prev.billingCycle,
          paidVia: selectedProvider,
          description: `${selectedUpgradePlan} plan switch initiated`,
        },
        ...prev.invoices,
      ],
    }));

    setIsUpgradeModalOpen(false);
    setToast(`${selectedUpgradePlan} upgrade initiated via ${selectedProvider}.`);
  }

  function retryFailedPayment() {
    if (!failedInvoice) return;

    setBillingData((prev) => ({
      ...prev,
      subscriptionStatus: "Active",
      invoices: prev.invoices.map((invoice) =>
        invoice.id === failedInvoice.id
          ? { ...invoice, status: "Paid", paidVia: prev.provider }
          : invoice
      ),
    }));

    setToast("Failed payment retried successfully.");
  }

  function downloadInvoicePdf(invoice: Invoice) {
    const printable = `
MEI CRM TAX INVOICE
-----------------------------
Invoice No: ${invoice.invoiceNo}
Date: ${formatDate(invoice.date)}
Plan: ${invoice.planName}
Billing Cycle: ${invoice.billingCycle}
Payment Provider: ${invoice.paidVia}
Status: ${invoice.status}

Company:
${billingData.billingAddress.companyName}

Billing Address:
${billingData.billingAddress.addressLine1}
${billingData.billingAddress.addressLine2}
${billingData.billingAddress.city}, ${billingData.billingAddress.state} ${billingData.billingAddress.postalCode}
${billingData.billingAddress.country}

GSTIN: ${billingData.billingAddress.gstin}
Billing Email: ${billingData.billingAddress.billingEmail}

Base Amount: ${formatCurrency(invoice.amount)}
GST: ${formatCurrency(invoice.tax)}
Total: ${formatCurrency(invoice.total)}

Description:
${invoice.description ?? "Subscription invoice"}

This is a UI-side GST invoice preview export.
    `.trim();

    const blob = new Blob([printable], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${invoice.invoiceNo}-GST-Invoice.txt`;
    anchor.click();
    URL.revokeObjectURL(url);

    setToast(`${invoice.invoiceNo} GST invoice downloaded.`);
  }

  function downloadLatestInvoice() {
    if (!billingData.invoices.length) return;
    downloadInvoicePdf(billingData.invoices[0]);
  }

  function handleProviderCheckout(provider: BillingProvider) {
    const payload = {
      provider,
      amount: total,
      currency: "INR",
      billingCycle: billingData.billingCycle,
      plan: billingData.currentPlan,
      seats: billingData.teamSeats,
      addOns: billingData.addOns
        .filter((item) => item.selected)
        .map((item) => item.key),
      billingEmail: billingData.billingAddress.billingEmail,
      gstin: billingData.billingAddress.gstin,
      description: "MEI CRM subscription renewal",
    };

    console.log(`${provider} checkout payload`, payload);
    setToast(`${provider} checkout payload ready. Console-ல் பார்க்கலாம்.`);
  }

  return (
    <div
      style={{
        minHeight: "100%",
        background: theme.pageBg,
        color: theme.text,
        padding: pagePadding,
        position: "relative",
      }}
    >
      {toast ? (
        <div
          style={{
            position: "fixed",
            right: isMobile ? 12 : 20,
            left: isMobile ? 12 : "auto",
            bottom: isMobile ? 12 : 20,
            zIndex: 100,
            background: theme.cardBg,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: 14,
            padding: "12px 16px",
            boxShadow:
              mode === "dark"
                ? "0 12px 28px rgba(0,0,0,0.28)"
                : "0 12px 28px rgba(15,23,42,0.12)",
          }}
        >
          {toast}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          gap: 16,
          alignItems: isMobile ? "stretch" : "flex-start",
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? 24 : 28,
              fontWeight: 800,
              color: theme.text,
              letterSpacing: -0.4,
              lineHeight: 1.2,
            }}
          >
            Billing & Subscription
          </h1>
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              color: theme.subText,
              fontSize: isMobile ? 14 : 15,
              lineHeight: 1.6,
              maxWidth: 780,
            }}
          >
            Manage your live plan, seats, add-ons, payment retries, invoices,
            GST details, and backend-ready provider checkout actions from one place.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "stretch",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <button style={secondaryButton} onClick={downloadLatestInvoice}>
            Download Latest Invoice
          </button>
          <button
            style={secondaryButton}
            onClick={() =>
              updateBillingData(
                "provider",
                billingData.provider === "Razorpay" ? "Stripe" : "Razorpay"
              )
            }
          >
            Provider: {billingData.provider}
          </button>
          <button style={primaryButton} onClick={() => openUpgradeModal("Pro")}>
            Upgrade Plan
          </button>
        </div>
      </div>

      {failedInvoice ? (
        <div
          style={{
            ...cardStyle,
            marginBottom: 20,
            border: `1px solid ${
              mode === "dark" ? "rgba(239,68,68,0.35)" : "rgba(239,68,68,0.24)"
            }`,
            background:
              mode === "dark" ? "rgba(127,29,29,0.22)" : "rgba(254,242,242,1)",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: mode === "dark" ? "#fecaca" : "#991b1b",
                marginBottom: 6,
              }}
            >
              Payment Failed Alert
            </div>
            <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.6 }}>
              Invoice <strong>{failedInvoice.invoiceNo}</strong> failed on{" "}
              <strong>{formatDate(failedInvoice.date)}</strong>. Retry payment to
              keep the subscription active.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 10,
              flexWrap: "wrap",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <button
              style={secondaryButton}
              onClick={() => setSelectedInvoice(failedInvoice)}
            >
              View Invoice
            </button>
            <button style={primaryButton} onClick={retryFailedPayment}>
              Retry Payment
            </button>
          </div>
        </div>
      ) : null}

      <div
        style={{
          ...subtleCardStyle,
          marginBottom: 24,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          gap: 12,
          flexWrap: "wrap",
          border: `1px solid ${statusTone.border}`,
          background: statusTone.bg,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: statusTone.text,
              marginBottom: 4,
            }}
          >
            Subscription Status
          </div>
          <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.6 }}>
            Your current plan is <strong>{billingData.currentPlan}</strong>. Next
            renewal is scheduled for{" "}
            <strong>{formatDate(billingData.renewalDate)}</strong>.
          </div>
        </div>

        <div
          style={{
            alignSelf: isMobile ? "flex-start" : "auto",
            padding: "8px 12px",
            borderRadius: 999,
            border: `1px solid ${statusTone.border}`,
            background: theme.cardBg,
            color: statusTone.text,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {billingData.subscriptionStatus}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: summaryGridColumns,
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
              alignItems: isMobile ? "flex-start" : "center",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: isMobile ? 22 : 24,
                fontWeight: 800,
                letterSpacing: -0.3,
                color: theme.text,
              }}
            >
              {billingData.currentPlan}
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
              {billingData.subscriptionStatus}
            </div>
          </div>
          <div style={{ fontSize: 14, color: theme.subText, marginBottom: 8 }}>
            Billing cycle:{" "}
            <strong style={{ color: theme.text }}>{billingData.billingCycle}</strong>
          </div>
          <div style={{ fontSize: 14, color: theme.subText }}>
            Renewal date:{" "}
            <strong style={{ color: theme.text }}>
              {formatDate(billingData.renewalDate)}
            </strong>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ color: theme.subText, fontSize: 13, marginBottom: 8 }}>
            Next Billing
          </div>
          <div
            style={{
              fontSize: isMobile ? 22 : 24,
              fontWeight: 800,
              letterSpacing: -0.3,
              color: theme.text,
              marginBottom: 10,
            }}
          >
            {formatCurrency(total)}
          </div>
          <div style={{ fontSize: 14, color: theme.subText, marginBottom: 8 }}>
            Includes plan + seats + add-ons + GST
          </div>
          <div style={{ fontSize: 14, color: theme.subText }}>
            Auto-renew:{" "}
            <strong style={{ color: billingData.autoRenew ? theme.success : theme.warning }}>
              {billingData.autoRenew ? "Enabled" : "Disabled"}
            </strong>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ color: theme.subText, fontSize: 13, marginBottom: 8 }}>
            Payment Method
          </div>
          <div
            style={{
              fontSize: isMobile ? 16 : 18,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 8,
            }}
          >
            {billingData.paymentMethodLabel}
          </div>
          <div style={{ fontSize: 14, color: theme.subText, marginBottom: 8 }}>
            Expiry: {billingData.paymentMethodExpiry}
          </div>
          <div style={{ fontSize: 14, color: theme.subText, marginBottom: 12 }}>
            Gateway: <strong style={{ color: theme.text }}>{billingData.provider}</strong>
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 14,
              color: theme.text,
              cursor: "pointer",
              lineHeight: 1.5,
            }}
          >
            <input
              type="checkbox"
              checked={billingData.autoRenew}
              onChange={() => updateBillingData("autoRenew", !billingData.autoRenew)}
              style={{ marginTop: 3 }}
            />
            Enable auto-renewal
          </label>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: mainTwoColGrid,
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div style={{ minWidth: 0 }}>
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
                  lineHeight: 1.6,
                }}
              >
                Compare features, choose a higher tier, and connect payment provider flow.
              </p>
            </div>

            <div
              style={{
                display: "inline-flex",
                width: isMobile ? "100%" : "auto",
                background: theme.sectionBg,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: 4,
                gap: 4,
              }}
            >
              <button
                onClick={() => updateBillingData("billingCycle", "Monthly")}
                style={{
                  ...buttonBase,
                  width: "100%",
                  padding: "8px 12px",
                  background:
                    billingData.billingCycle === "Monthly"
                      ? theme.primary
                      : "transparent",
                  color:
                    billingData.billingCycle === "Monthly"
                      ? theme.inverseText
                      : theme.text,
                  border: "none",
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => updateBillingData("billingCycle", "Yearly")}
                style={{
                  ...buttonBase,
                  width: "100%",
                  padding: "8px 12px",
                  background:
                    billingData.billingCycle === "Yearly"
                      ? theme.primary
                      : "transparent",
                  color:
                    billingData.billingCycle === "Yearly"
                      ? theme.inverseText
                      : theme.text,
                  border: "none",
                }}
              >
                Yearly
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: planGridColumns,
              gap: 14,
            }}
          >
            {PLANS.map((plan) => {
              const isCurrent = plan.name === billingData.currentPlan;
              const price =
                billingData.billingCycle === "Monthly"
                  ? plan.monthlyPrice
                  : plan.yearlyPrice;

              return (
                <div
                  key={plan.id}
                  style={{
                    border: `1px solid ${isCurrent ? theme.primary : theme.border}`,
                    background: isCurrent ? theme.cardBgSoft : theme.cardBg,
                    borderRadius: 18,
                    padding: isMobile ? 14 : 16,
                    position: "relative",
                    minWidth: 0,
                  }}
                >
                  {plan.recommended ? (
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
                  ) : null}

                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: theme.text,
                      marginBottom: 8,
                      paddingRight: plan.recommended ? 80 : 0,
                    }}
                  >
                    {plan.name}
                  </div>

                  <div
                    style={{
                      fontSize: isMobile ? 22 : 24,
                      fontWeight: 900,
                      color: theme.text,
                      marginBottom: 4,
                    }}
                  >
                    {plan.name === "Enterprise" ? "Custom" : formatCurrency(price)}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: theme.subText,
                      marginBottom: 16,
                      lineHeight: 1.5,
                    }}
                  >
                    {plan.name === "Enterprise"
                      ? "Custom quotation for advanced teams"
                      : `per ${
                          billingData.billingCycle === "Monthly" ? "month" : "year"
                        }`}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                    {plan.features.map((feature) => (
                      <div
                        key={feature.label}
                        style={{
                          fontSize: 13,
                          color: feature.included ? theme.text : theme.mutedText,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ flexShrink: 0 }}>{feature.included ? "✓" : "—"}</span>
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
                    onClick={() => {
                      if (!isCurrent) openUpgradeModal(plan.name);
                    }}
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
              {billingData.usageItems.map((item) => {
                const percent = Math.min((item.used / item.limit) * 100, 100);

                return (
                  <div key={item.label} style={subtleCardStyle}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: isMobile ? "flex-start" : "center",
                        flexDirection: isMobile ? "column" : "row",
                        gap: 6,
                        marginBottom: 8,
                        fontSize: 14,
                      }}
                    >
                      <span style={{ color: theme.text, fontWeight: 700 }}>
                        {item.label}
                      </span>
                      <span style={{ color: theme.subText }}>
                        {item.used}/{item.limit}
                        {item.unit ? ` ${item.unit}` : ""}
                      </span>
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
                      {percent >= 85 ? "Usage nearing limit" : "Healthy usage range"}
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
              Seats & Add-ons
            </h2>

            <div style={{ ...subtleCardStyle, marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "stretch" : "center",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: theme.text }}>
                    Team Seats
                  </div>
                  <div style={{ fontSize: 13, color: theme.subText, lineHeight: 1.6 }}>
                    Included seats: {billingData.baseIncludedSeats} · Extra seats: {extraSeatCount}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    alignSelf: isMobile ? "flex-start" : "auto",
                  }}
                >
                  <button
                    style={{ ...secondaryButton, width: 40, minWidth: 40, padding: "10px 0" }}
                    onClick={() => adjustSeats("decrement")}
                  >
                    -
                  </button>
                  <div
                    style={{
                      minWidth: 42,
                      textAlign: "center",
                      fontWeight: 800,
                      color: theme.text,
                    }}
                  >
                    {billingData.teamSeats}
                  </div>
                  <button
                    style={{ ...secondaryButton, width: 40, minWidth: 40, padding: "10px 0" }}
                    onClick={() => adjustSeats("increment")}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ fontSize: 13, color: theme.subText, lineHeight: 1.6 }}>
                Extra seat pricing: {formatCurrency(seatPrice)} /{" "}
                {billingData.billingCycle === "Monthly" ? "seat / month" : "seat / year"}
              </div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {billingData.addOns.map((item) => (
                <label
                  key={item.key}
                  style={{
                    ...subtleCardStyle,
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 12,
                    alignItems: isMobile ? "stretch" : "flex-start",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", width: "100%" }}>
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleAddOn(item.key)}
                      style={{ marginTop: 4 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: theme.text }}>
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: theme.subText,
                          marginTop: 4,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: theme.text,
                      whiteSpace: isMobile ? "normal" : "nowrap",
                      paddingLeft: isMobile ? 28 : 0,
                    }}
                  >
                    {formatCurrency(
                      billingData.billingCycle === "Monthly"
                        ? item.monthlyPrice
                        : item.yearlyPrice
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: bottomGrid,
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div style={{ minWidth: 0 }}>
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
                  lineHeight: 1.6,
                }}
              >
                Review invoices, open detail drawer, and download GST invoice exports.
              </p>
            </div>

            <div style={{ width: isMobile ? "100%" : 260 }}>
              <input
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                placeholder="Search invoice / plan / provider"
                style={inputStyle}
              />
            </div>
          </div>

          {isMobile ? (
            <div style={{ display: "grid", gap: 12 }}>
              {filteredInvoices.length === 0 ? (
                <div style={subtleCardStyle}>
                  <div style={{ fontSize: 14, color: theme.subText }}>No invoices found.</div>
                </div>
              ) : (
                filteredInvoices.map((invoice) => {
                  const invoiceTone = getStatusColors(invoice.status, mode);

                  return (
                    <div key={invoice.id} style={subtleCardStyle}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "flex-start",
                          marginBottom: 10,
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 800, color: theme.text, lineHeight: 1.4 }}>
                            {invoice.invoiceNo}
                          </div>
                          <div style={{ fontSize: 12, color: theme.subText, marginTop: 4 }}>
                            {invoice.planName} · {invoice.paidVia}
                          </div>
                        </div>

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
                            flexShrink: 0,
                          }}
                        >
                          {invoice.status}
                        </span>
                      </div>

                      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <span style={{ fontSize: 13, color: theme.subText }}>Date</span>
                          <span style={{ fontSize: 13, color: theme.text }}>{formatDate(invoice.date)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <span style={{ fontSize: 13, color: theme.subText }}>Total</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: theme.text }}>
                            {formatCurrency(invoice.total)}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: theme.subText }}>
                          Base {formatCurrency(invoice.amount)} + Tax {formatCurrency(invoice.tax)}
                        </div>
                      </div>

                      <div style={{ display: "grid", gap: 8 }}>
                        <button style={secondaryButton} onClick={() => setSelectedInvoice(invoice)}>
                          View
                        </button>
                        <button style={secondaryButton} onClick={() => downloadInvoicePdf(invoice)}>
                          Download GST
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
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
                  minWidth: 720,
                  borderCollapse: "collapse",
                  background: theme.cardBg,
                }}
              >
                <thead style={{ background: theme.tableHeadBg ?? theme.sectionBg }}>
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
                        <tr key={invoice.id}>
                          <td style={tableCellStyle}>
                            <div style={{ fontWeight: 700 }}>{invoice.invoiceNo}</div>
                            <div style={{ fontSize: 12, color: theme.subText, marginTop: 4 }}>
                              {invoice.planName} · {invoice.paidVia}
                            </div>
                          </td>
                          <td style={tableCellStyle}>{formatDate(invoice.date)}</td>
                          <td style={tableCellStyle}>
                            <div style={{ fontWeight: 700 }}>{formatCurrency(invoice.total)}</div>
                            <div style={{ fontSize: 12, color: theme.subText, marginTop: 4 }}>
                              Base {formatCurrency(invoice.amount)} + Tax {formatCurrency(invoice.tax)}
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
                              <button
                                style={{ ...secondaryButton, width: "auto" }}
                                onClick={() => setSelectedInvoice(invoice)}
                              >
                                View
                              </button>
                              <button
                                style={{ ...secondaryButton, width: "auto" }}
                                onClick={() => downloadInvoicePdf(invoice)}
                              >
                                Download GST
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
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
              Billing Summary
            </h2>

            <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
              <SummaryRow label="Plan Amount" value={formatCurrency(planAmount)} theme={theme} />
              <SummaryRow
                label={`Extra Seats (${extraSeatCount})`}
                value={formatCurrency(seatsCost)}
                theme={theme}
              />
              <SummaryRow label="Add-ons" value={formatCurrency(addOnCost)} theme={theme} />
              <SummaryRow
                label="Discount"
                value={`- ${formatCurrency(discount)}`}
                theme={theme}
              />
              <SummaryRow label="Taxable Amount" value={formatCurrency(taxableAmount)} theme={theme} />
              <SummaryRow label="GST (18%)" value={formatCurrency(gst)} theme={theme} />
            </div>

            <div
              style={{
                ...subtleCardStyle,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                fontSize: 16,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              <span>Total Payable</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 10,
                }}
              >
                <input
                  value={billingData.couponCode}
                  onChange={(e) => updateBillingData("couponCode", e.target.value)}
                  placeholder="Enter coupon code"
                  style={inputStyle}
                />
                <button
                  style={{ ...secondaryButton, width: isMobile ? "100%" : "auto" }}
                  onClick={applyCoupon}
                >
                  Apply
                </button>
              </div>

              <div style={{ fontSize: 12, color: theme.subText, lineHeight: 1.6 }}>
                Try <strong>MEI100</strong> or <strong>MEIPRO500</strong> for preview.
              </div>

              <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                <button style={primaryButton} onClick={() => handleProviderCheckout("Razorpay")}>
                  Razorpay Checkout Ready
                </button>
                <button
                  style={secondaryButton}
                  onClick={() => handleProviderCheckout("Stripe")}
                >
                  Stripe Checkout Ready
                </button>
              </div>
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
              Billing Address & GST
            </h2>

            <div style={{ display: "grid", gap: 12 }}>
              <InfoBlock label="Company" value={billingData.billingAddress.companyName} theme={theme} subtleCardStyle={subtleCardStyle} />
              <InfoBlock
                label="Billing Address"
                value={
                  <>
                    {billingData.billingAddress.addressLine1},
                    <br />
                    {billingData.billingAddress.addressLine2},
                    <br />
                    {billingData.billingAddress.city}, {billingData.billingAddress.state} -{" "}
                    {billingData.billingAddress.postalCode},
                    <br />
                    {billingData.billingAddress.country}
                  </>
                }
                theme={theme}
                subtleCardStyle={subtleCardStyle}
              />
              <InfoBlock label="GSTIN" value={billingData.billingAddress.gstin} theme={theme} subtleCardStyle={subtleCardStyle} />
              <InfoBlock label="Billing Email" value={billingData.billingAddress.billingEmail} theme={theme} subtleCardStyle={subtleCardStyle} />

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
              Pause renewal, downgrade later, or cancel subscription when needed.
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <button style={secondaryButton}>Pause Subscription</button>
              <button style={secondaryButton}>Downgrade Plan</button>
              <button style={dangerButton}>Cancel Subscription</button>
            </div>
          </div>
        </div>
      </div>

      {selectedInvoice ? (
        <InvoiceDrawer
          invoice={selectedInvoice}
          billingData={billingData}
          mode={mode}
          theme={theme}
          onClose={() => setSelectedInvoice(null)}
          onDownload={downloadInvoicePdf}
        />
      ) : null}

      {isUpgradeModalOpen ? (
        <UpgradeModal
          mode={mode}
          theme={theme}
          isMobile={isMobile}
          selectedUpgradePlan={selectedUpgradePlan}
          selectedUpgradePlanData={selectedUpgradePlanData}
          selectedProvider={selectedProvider}
          billingCycle={billingData.billingCycle}
          onClose={() => setIsUpgradeModalOpen(false)}
          onChangePlan={setSelectedUpgradePlan}
          onChangeProvider={setSelectedProvider}
          onConfirm={confirmUpgradePlan}
        />
      ) : null}
    </div>
  );
}

function SummaryRow({
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
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        fontSize: 14,
      }}
    >
      <span style={{ color: theme.subText }}>{label}</span>
      <span style={{ color: theme.text, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  theme,
  subtleCardStyle,
}: {
  label: string;
  value: React.ReactNode;
  theme: ReturnType<typeof getTheme>;
  subtleCardStyle: React.CSSProperties;
}) {
  return (
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
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: theme.text,
          lineHeight: 1.7,
          wordBreak: "break-word",
          fontWeight: label === "GSTIN" ? 700 : 500,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InvoiceDrawer({
  invoice,
  billingData,
  mode,
  theme,
  onClose,
  onDownload,
}: {
  invoice: Invoice;
  billingData: BillingState;
  mode: ThemeMode;
  theme: ReturnType<typeof getTheme>;
  onClose: () => void;
  onDownload: (invoice: Invoice) => void;
}) {
  const invoiceTone = getStatusColors(invoice.status, mode);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(0,0,0,0.42)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(100%, 520px)",
          height: "100%",
          background: theme.cardBg,
          borderLeft: `1px solid ${theme.border}`,
          padding: 20,
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>
              Invoice Details
            </div>
            <div style={{ fontSize: 13, color: theme.subText, marginTop: 4 }}>
              {invoice.invoiceNo}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.sectionBg,
              color: theme.text,
              borderRadius: 10,
              padding: "10px 12px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <InfoBlock label="Status" value={
            <span
              style={{
                display: "inline-flex",
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
          } theme={theme} subtleCardStyle={{ background: theme.sectionBg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16 }} />
          <InfoBlock label="Plan" value={`${invoice.planName} · ${invoice.billingCycle}`} theme={theme} subtleCardStyle={{ background: theme.sectionBg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16 }} />
          <InfoBlock label="Payment Provider" value={invoice.paidVia} theme={theme} subtleCardStyle={{ background: theme.sectionBg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16 }} />
          <InfoBlock label="Date" value={formatDate(invoice.date)} theme={theme} subtleCardStyle={{ background: theme.sectionBg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16 }} />
          <InfoBlock label="Company" value={billingData.billingAddress.companyName} theme={theme} subtleCardStyle={{ background: theme.sectionBg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16 }} />
          <InfoBlock
            label="Amount Breakdown"
            value={
              <>
                Base: {formatCurrency(invoice.amount)}
                <br />
                GST: {formatCurrency(invoice.tax)}
                <br />
                Total: <strong>{formatCurrency(invoice.total)}</strong>
              </>
            }
            theme={theme}
            subtleCardStyle={{ background: theme.sectionBg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16 }}
          />
          <InfoBlock
            label="Description"
            value={invoice.description ?? "Subscription invoice"}
            theme={theme}
            subtleCardStyle={{ background: theme.sectionBg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16 }}
          />
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
          <button
            onClick={() => onDownload(invoice)}
            style={{
              background: theme.primary,
              color: theme.inverseText,
              border: "none",
              borderRadius: 12,
              padding: "12px 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Download GST Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

function UpgradeModal({
  mode,
  theme,
  isMobile,
  selectedUpgradePlan,
  selectedUpgradePlanData,
  selectedProvider,
  billingCycle,
  onClose,
  onChangePlan,
  onChangeProvider,
  onConfirm,
}: {
  mode: ThemeMode;
  theme: ReturnType<typeof getTheme>;
  isMobile: boolean;
  selectedUpgradePlan: PlanName;
  selectedUpgradePlanData: Plan;
  selectedProvider: BillingProvider;
  billingCycle: BillingCycle;
  onClose: () => void;
  onChangePlan: (value: PlanName) => void;
  onChangeProvider: (value: BillingProvider) => void;
  onConfirm: () => void;
}) {
  const previewPrice =
    billingCycle === "Monthly"
      ? selectedUpgradePlanData.monthlyPrice
      : selectedUpgradePlanData.yearlyPrice;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.48)",
        display: "flex",
        justifyContent: "center",
        alignItems: isMobile ? "flex-end" : "center",
        zIndex: 70,
        padding: isMobile ? 0 : 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(100%, 560px)",
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: isMobile ? "20px 20px 0 0" : 20,
          padding: 20,
          boxShadow:
            mode === "dark"
              ? "0 18px 40px rgba(0,0,0,0.36)"
              : "0 18px 40px rgba(15,23,42,0.14)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>
              Upgrade Plan
            </div>
            <div style={{ fontSize: 13, color: theme.subText, marginTop: 4 }}>
              Select plan and payment provider
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.sectionBg,
              color: theme.text,
              borderRadius: 10,
              padding: "10px 12px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: theme.subText, display: "block", marginBottom: 8 }}>
              Choose Plan
            </label>
            <select
              value={selectedUpgradePlan}
              onChange={(e) => onChangePlan(e.target.value as PlanName)}
              style={{
                width: "100%",
                background: theme.inputBg ?? theme.sectionBg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: "12px 14px",
                outline: "none",
                fontSize: 14,
              }}
            >
              {PLANS.map((plan) => (
                <option key={plan.id} value={plan.name}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, color: theme.subText, display: "block", marginBottom: 8 }}>
              Payment Provider
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {(["Razorpay", "Stripe"] as BillingProvider[]).map((provider) => (
                <button
                  key={provider}
                  onClick={() => onChangeProvider(provider)}
                  style={{
                    border: `1px solid ${
                      selectedProvider === provider ? theme.primary : theme.border
                    }`,
                    background:
                      selectedProvider === provider
                        ? theme.cardBgSoft
                        : theme.cardBg,
                    color: theme.text,
                    borderRadius: 12,
                    padding: "12px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              background: theme.sectionBg,
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
              padding: 16,
              display: "grid",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>
              {selectedUpgradePlanData.name}
            </div>
            <div style={{ fontSize: 14, color: theme.subText }}>
              {selectedUpgradePlanData.name === "Enterprise"
                ? "Custom quotation"
                : `${formatCurrency(previewPrice)} per ${
                    billingCycle === "Monthly" ? "month" : "year"
                  }`}
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {selectedUpgradePlanData.features.map((feature) => (
                <div
                  key={feature.label}
                  style={{
                    fontSize: 13,
                    color: feature.included ? theme.text : theme.mutedText,
                    display: "flex",
                    gap: 8,
                    lineHeight: 1.5,
                  }}
                >
                  <span>{feature.included ? "✓" : "—"}</span>
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onConfirm}
            style={{
              background: theme.primary,
              color: theme.inverseText,
              border: "none",
              borderRadius: 12,
              padding: "12px 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Confirm Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}