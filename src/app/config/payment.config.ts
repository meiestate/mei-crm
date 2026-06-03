// =====================================================
// MEI CRM - payment.config.ts
// Frontend-safe payment configuration
// Vite + React + TypeScript
// -----------------------------------------------------
// IMPORTANT:
// Razorpay key secret / Stripe secret key / webhook secret
// frontend-ல் வைக்கக்கூடாது. Payment order create,
// signature verification, webhook verification backend-ல் மட்டும்.
// Frontend-ல் publishable key, endpoints, UI settings,
// plan metadata, validation helpers மட்டும் maintain செய்யவும்.
// =====================================================

export type PaymentEnvironment = "development" | "staging" | "production";

export type PaymentProvider = "razorpay" | "stripe" | "cashfree" | "paytm" | "mock";

export type PaymentCurrency = "INR" | "USD" | "AED" | "SGD";

export type BillingCycle = "monthly" | "quarterly" | "yearly";

export type PaymentMode = "live" | "test" | "mock";

export type PaymentStatus =
  | "created"
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export type SubscriptionPlanKey = "free" | "starter" | "growth" | "business" | "enterprise";

export type SubscriptionPlan = {
  key: SubscriptionPlanKey;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: PaymentCurrency;
  maxUsers: number;
  maxLeads: number;
  maxDeals: number;
  features: string[];
  isPopular: boolean;
  enabled: boolean;
};

export type PaymentConfig = {
  environment: PaymentEnvironment;
  provider: PaymentProvider;
  mode: PaymentMode;
  enabled: boolean;
  currency: PaymentCurrency;
  billingCycle: BillingCycle;
  api: {
    baseUrl: string;
    createOrderEndpoint: string;
    verifyPaymentEndpoint: string;
    subscriptionEndpoint: string;
    invoiceEndpoint: string;
    refundEndpoint: string;
    paymentStatusEndpoint: string;
    timeoutMs: number;
    retryCount: number;
  };
  razorpay: {
    enabled: boolean;
    keyId: string;
    companyName: string;
    checkoutThemeColor: string;
    imageUrl: string;
    prefillEmail: boolean;
    prefillContact: boolean;
  };
  stripe: {
    enabled: boolean;
    publishableKey: string;
    checkoutMode: "payment" | "subscription";
    successUrl: string;
    cancelUrl: string;
  };
  gst: {
    enabled: boolean;
    percentage: number;
    companyGstin: string;
    invoicePrefix: string;
    placeOfSupply: string;
  };
  invoice: {
    enabled: boolean;
    autoGenerate: boolean;
    downloadEnabled: boolean;
    invoicePrefix: string;
    dueDays: number;
  };
  validation: {
    minAmount: number;
    maxAmount: number;
    maxSeats: number;
    minSeats: number;
    allowedCurrencies: PaymentCurrency[];
  };
  plans: Record<SubscriptionPlanKey, SubscriptionPlan>;
  localPreview: {
    enabled: boolean;
    storageKey: string;
    keepLastCount: number;
  };
};

export type PaymentOrderPayload = {
  amount: number;
  currency?: PaymentCurrency;
  planKey?: SubscriptionPlanKey;
  billingCycle?: BillingCycle;
  seats?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  gstin?: string;
  notes?: Record<string, string | number | boolean>;
};

export type PaymentPreview = PaymentOrderPayload & {
  id: string;
  status: PaymentStatus;
  createdAt: string;
  totalAmount: number;
  gstAmount: number;
  baseAmount: number;
};

const getEnvValue = (key: string, fallback: string): string => {
  const value = import.meta.env[key] as string | undefined;
  return value && value.trim().length > 0 ? value : fallback;
};

const getBooleanEnvValue = (key: string, fallback: boolean): boolean => {
  const value = import.meta.env[key] as string | undefined;

  if (!value || value.trim().length === 0) {
    return fallback;
  }

  return ["true", "1", "yes", "on"].includes(value.toLowerCase());
};

const getNumberEnvValue = (key: string, fallback: number): number => {
  const value = import.meta.env[key] as string | undefined;
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const resolveEnvironment = (): PaymentEnvironment => {
  const env = getEnvValue("VITE_APP_ENV", import.meta.env.MODE || "development");

  if (env === "development" || env === "staging" || env === "production") {
    return env;
  }

  return "development";
};

const resolveProvider = (): PaymentProvider => {
  const provider = getEnvValue("VITE_PAYMENT_PROVIDER", "razorpay");

  if (provider === "razorpay" || provider === "stripe" || provider === "cashfree" || provider === "paytm" || provider === "mock") {
    return provider;
  }

  return "razorpay";
};

const resolvePaymentMode = (): PaymentMode => {
  const mode = getEnvValue("VITE_PAYMENT_MODE", resolveEnvironment() === "production" ? "live" : "test");

  if (mode === "live" || mode === "test" || mode === "mock") {
    return mode;
  }

  return "test";
};

const resolveCurrency = (): PaymentCurrency => {
  const currency = getEnvValue("VITE_PAYMENT_CURRENCY", "INR");

  if (currency === "INR" || currency === "USD" || currency === "AED" || currency === "SGD") {
    return currency;
  }

  return "INR";
};

const resolveBillingCycle = (): BillingCycle => {
  const billingCycle = getEnvValue("VITE_DEFAULT_BILLING_CYCLE", "monthly");

  if (billingCycle === "monthly" || billingCycle === "quarterly" || billingCycle === "yearly") {
    return billingCycle;
  }

  return "monthly";
};

export const PAYMENT_CONFIG: PaymentConfig = {
  environment: resolveEnvironment(),
  provider: resolveProvider(),
  mode: resolvePaymentMode(),
  enabled: getBooleanEnvValue("VITE_PAYMENT_ENABLED", true),
  currency: resolveCurrency(),
  billingCycle: resolveBillingCycle(),

  api: {
    baseUrl: getEnvValue("VITE_API_BASE_URL", "http://localhost:4000/api/v1"),
    createOrderEndpoint: getEnvValue("VITE_PAYMENT_CREATE_ORDER_ENDPOINT", "/payments/orders"),
    verifyPaymentEndpoint: getEnvValue("VITE_PAYMENT_VERIFY_ENDPOINT", "/payments/verify"),
    subscriptionEndpoint: getEnvValue("VITE_PAYMENT_SUBSCRIPTION_ENDPOINT", "/payments/subscriptions"),
    invoiceEndpoint: getEnvValue("VITE_PAYMENT_INVOICE_ENDPOINT", "/payments/invoices"),
    refundEndpoint: getEnvValue("VITE_PAYMENT_REFUND_ENDPOINT", "/payments/refunds"),
    paymentStatusEndpoint: getEnvValue("VITE_PAYMENT_STATUS_ENDPOINT", "/payments/status"),
    timeoutMs: getNumberEnvValue("VITE_PAYMENT_TIMEOUT_MS", 30000),
    retryCount: getNumberEnvValue("VITE_PAYMENT_RETRY_COUNT", 2),
  },

  razorpay: {
    enabled: getBooleanEnvValue("VITE_RAZORPAY_ENABLED", true),
    keyId: getEnvValue("VITE_RAZORPAY_KEY_ID", ""),
    companyName: getEnvValue("VITE_RAZORPAY_COMPANY_NAME", "MEI CRM"),
    checkoutThemeColor: getEnvValue("VITE_RAZORPAY_THEME_COLOR", "#111827"),
    imageUrl: getEnvValue("VITE_RAZORPAY_IMAGE_URL", ""),
    prefillEmail: getBooleanEnvValue("VITE_RAZORPAY_PREFILL_EMAIL", true),
    prefillContact: getBooleanEnvValue("VITE_RAZORPAY_PREFILL_CONTACT", true),
  },

  stripe: {
    enabled: getBooleanEnvValue("VITE_STRIPE_ENABLED", false),
    publishableKey: getEnvValue("VITE_STRIPE_PUBLISHABLE_KEY", ""),
    checkoutMode: getEnvValue("VITE_STRIPE_CHECKOUT_MODE", "subscription") === "payment" ? "payment" : "subscription",
    successUrl: getEnvValue("VITE_STRIPE_SUCCESS_URL", `${window.location.origin}/settings/billing?payment=success`),
    cancelUrl: getEnvValue("VITE_STRIPE_CANCEL_URL", `${window.location.origin}/settings/billing?payment=cancelled`),
  },

  gst: {
    enabled: getBooleanEnvValue("VITE_GST_ENABLED", true),
    percentage: getNumberEnvValue("VITE_GST_PERCENTAGE", 18),
    companyGstin: getEnvValue("VITE_COMPANY_GSTIN", ""),
    invoicePrefix: getEnvValue("VITE_GST_INVOICE_PREFIX", "MEI-GST"),
    placeOfSupply: getEnvValue("VITE_GST_PLACE_OF_SUPPLY", "Tamil Nadu"),
  },

  invoice: {
    enabled: getBooleanEnvValue("VITE_INVOICE_ENABLED", true),
    autoGenerate: getBooleanEnvValue("VITE_INVOICE_AUTO_GENERATE", true),
    downloadEnabled: getBooleanEnvValue("VITE_INVOICE_DOWNLOAD_ENABLED", true),
    invoicePrefix: getEnvValue("VITE_INVOICE_PREFIX", "MEI-INV"),
    dueDays: getNumberEnvValue("VITE_INVOICE_DUE_DAYS", 7),
  },

  validation: {
    minAmount: getNumberEnvValue("VITE_PAYMENT_MIN_AMOUNT", 1),
    maxAmount: getNumberEnvValue("VITE_PAYMENT_MAX_AMOUNT", 10000000),
    minSeats: getNumberEnvValue("VITE_PAYMENT_MIN_SEATS", 1),
    maxSeats: getNumberEnvValue("VITE_PAYMENT_MAX_SEATS", 500),
    allowedCurrencies: ["INR", "USD", "AED", "SGD"],
  },

  plans: {
    free: {
      key: "free",
      name: "Free",
      description: "Basic CRM access for testing and early setup.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: "INR",
      maxUsers: 1,
      maxLeads: 100,
      maxDeals: 25,
      features: ["Lead management", "Basic dashboard", "Task tracking"],
      isPopular: false,
      enabled: true,
    },
    starter: {
      key: "starter",
      name: "Starter",
      description: "For small teams starting CRM operations.",
      monthlyPrice: 999,
      yearlyPrice: 9990,
      currency: "INR",
      maxUsers: 3,
      maxLeads: 1000,
      maxDeals: 250,
      features: ["Lead CRM", "Deal pipeline", "Tasks", "Call logs", "Basic analytics"],
      isPopular: false,
      enabled: true,
    },
    growth: {
      key: "growth",
      name: "Growth",
      description: "For growing sales teams with advanced analytics.",
      monthlyPrice: 2499,
      yearlyPrice: 24990,
      currency: "INR",
      maxUsers: 10,
      maxLeads: 10000,
      maxDeals: 2500,
      features: ["Advanced CRM", "Deal Kanban", "Revenue analytics", "Marketing analytics", "Team performance"],
      isPopular: true,
      enabled: true,
    },
    business: {
      key: "business",
      name: "Business",
      description: "For serious businesses needing automation and controls.",
      monthlyPrice: 6999,
      yearlyPrice: 69990,
      currency: "INR",
      maxUsers: 50,
      maxLeads: 50000,
      maxDeals: 10000,
      features: ["Everything in Growth", "Role permissions", "Audit logs", "Billing", "Integrations", "Priority support"],
      isPopular: false,
      enabled: true,
    },
    enterprise: {
      key: "enterprise",
      name: "Enterprise",
      description: "Custom CRM OS for large organizations.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: "INR",
      maxUsers: 9999,
      maxLeads: 999999,
      maxDeals: 999999,
      features: ["Custom setup", "Dedicated support", "Custom integrations", "SLA", "Security review"],
      isPopular: false,
      enabled: true,
    },
  },

  localPreview: {
    enabled: getBooleanEnvValue("VITE_PAYMENT_LOCAL_PREVIEW_ENABLED", resolveEnvironment() === "development"),
    storageKey: getEnvValue("VITE_PAYMENT_LOCAL_PREVIEW_STORAGE_KEY", "mei-crm-payment-preview"),
    keepLastCount: getNumberEnvValue("VITE_PAYMENT_LOCAL_PREVIEW_KEEP_LAST", 25),
  },
};

export const isPaymentProduction = PAYMENT_CONFIG.environment === "production";
export const isPaymentDevelopment = PAYMENT_CONFIG.environment === "development";
export const isPaymentStaging = PAYMENT_CONFIG.environment === "staging";

export const isPaymentEnabled = (): boolean => PAYMENT_CONFIG.enabled;

export const isMockPaymentEnabled = (): boolean => PAYMENT_CONFIG.provider === "mock" || PAYMENT_CONFIG.mode === "mock";

export const getPaymentApiBaseUrl = (): string => PAYMENT_CONFIG.api.baseUrl.replace(/\/$/, "");

export const getPaymentApiUrl = (endpoint: string): string => {
  const baseUrl = getPaymentApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return `${baseUrl}${cleanEndpoint}`;
};

export const getCreateOrderUrl = (): string => getPaymentApiUrl(PAYMENT_CONFIG.api.createOrderEndpoint);

export const getVerifyPaymentUrl = (): string => getPaymentApiUrl(PAYMENT_CONFIG.api.verifyPaymentEndpoint);

export const getSubscriptionUrl = (): string => getPaymentApiUrl(PAYMENT_CONFIG.api.subscriptionEndpoint);

export const getInvoiceUrl = (): string => getPaymentApiUrl(PAYMENT_CONFIG.api.invoiceEndpoint);

export const getRefundUrl = (): string => getPaymentApiUrl(PAYMENT_CONFIG.api.refundEndpoint);

export const getPaymentStatusUrl = (): string => getPaymentApiUrl(PAYMENT_CONFIG.api.paymentStatusEndpoint);

export const formatPaymentAmount = (amount: number, currency: PaymentCurrency = PAYMENT_CONFIG.currency): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" ? 0 : 2,
  }).format(amount);
};

export const convertToSmallestCurrencyUnit = (amount: number, currency: PaymentCurrency = PAYMENT_CONFIG.currency): number => {
  if (currency === "INR") {
    return Math.round(amount * 100);
  }

  return Math.round(amount * 100);
};

export const convertFromSmallestCurrencyUnit = (amount: number, currency: PaymentCurrency = PAYMENT_CONFIG.currency): number => {
  if (currency === "INR") {
    return amount / 100;
  }

  return amount / 100;
};

export const calculateGstAmount = (amount: number): number => {
  if (!PAYMENT_CONFIG.gst.enabled) {
    return 0;
  }

  return Number(((amount * PAYMENT_CONFIG.gst.percentage) / 100).toFixed(2));
};

export const calculateTotalWithGst = (amount: number): number => {
  return Number((amount + calculateGstAmount(amount)).toFixed(2));
};

export const calculateBaseAmountFromTotal = (totalAmount: number): number => {
  if (!PAYMENT_CONFIG.gst.enabled) {
    return totalAmount;
  }

  const divisor = 1 + PAYMENT_CONFIG.gst.percentage / 100;
  return Number((totalAmount / divisor).toFixed(2));
};

export const getPlan = (planKey: SubscriptionPlanKey): SubscriptionPlan => {
  return PAYMENT_CONFIG.plans[planKey];
};

export const getEnabledPlans = (): SubscriptionPlan[] => {
  return Object.values(PAYMENT_CONFIG.plans).filter((plan) => plan.enabled);
};

export const getPlanPrice = (planKey: SubscriptionPlanKey, billingCycle: BillingCycle = PAYMENT_CONFIG.billingCycle): number => {
  const plan = getPlan(planKey);

  if (billingCycle === "yearly") {
    return plan.yearlyPrice;
  }

  if (billingCycle === "quarterly") {
    return plan.monthlyPrice * 3;
  }

  return plan.monthlyPrice;
};

export const getPlanTotal = (planKey: SubscriptionPlanKey, billingCycle: BillingCycle = PAYMENT_CONFIG.billingCycle, seats = 1): number => {
  const price = getPlanPrice(planKey, billingCycle);
  return calculateTotalWithGst(price * seats);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidIndianPhone = (phone: string): boolean => {
  const cleanedPhone = phone.replace(/\D/g, "");
  return cleanedPhone.length >= 10 && cleanedPhone.length <= 12;
};

export const validatePaymentOrder = (payload: PaymentOrderPayload): string[] => {
  const errors: string[] = [];
  const amount = Number(payload.amount);
  const seats = payload.seats ?? 1;
  const currency = payload.currency ?? PAYMENT_CONFIG.currency;

  if (!Number.isFinite(amount) || amount < PAYMENT_CONFIG.validation.minAmount) {
    errors.push(`Amount must be at least ${formatPaymentAmount(PAYMENT_CONFIG.validation.minAmount, currency)}.`);
  }

  if (amount > PAYMENT_CONFIG.validation.maxAmount) {
    errors.push(`Amount cannot exceed ${formatPaymentAmount(PAYMENT_CONFIG.validation.maxAmount, currency)}.`);
  }

  if (!PAYMENT_CONFIG.validation.allowedCurrencies.includes(currency)) {
    errors.push(`Currency ${currency} is not allowed.`);
  }

  if (seats < PAYMENT_CONFIG.validation.minSeats) {
    errors.push(`Minimum ${PAYMENT_CONFIG.validation.minSeats} seat is required.`);
  }

  if (seats > PAYMENT_CONFIG.validation.maxSeats) {
    errors.push(`Maximum ${PAYMENT_CONFIG.validation.maxSeats} seats are allowed.`);
  }

  if (payload.customerEmail && !isValidEmail(payload.customerEmail)) {
    errors.push("Customer email is invalid.");
  }

  if (payload.customerPhone && !isValidIndianPhone(payload.customerPhone)) {
    errors.push("Customer phone number is invalid.");
  }

  if (payload.planKey && !PAYMENT_CONFIG.plans[payload.planKey]) {
    errors.push("Selected plan is invalid.");
  }

  return errors;
};

export const createPaymentPreview = (payload: PaymentOrderPayload): PaymentPreview => {
  const baseAmount = payload.amount;
  const gstAmount = calculateGstAmount(baseAmount);
  const totalAmount = calculateTotalWithGst(baseAmount);

  return {
    ...payload,
    id: crypto.randomUUID(),
    status: "created",
    createdAt: new Date().toISOString(),
    baseAmount,
    gstAmount,
    totalAmount,
  };
};

export const savePaymentPreview = (payload: PaymentOrderPayload): void => {
  if (!PAYMENT_CONFIG.localPreview.enabled || typeof window === "undefined") {
    return;
  }

  const preview = createPaymentPreview(payload);
  const storageKey = PAYMENT_CONFIG.localPreview.storageKey;
  const existingRaw = window.localStorage.getItem(storageKey);
  const existing = existingRaw ? (JSON.parse(existingRaw) as PaymentPreview[]) : [];
  const nextItems = [preview, ...existing].slice(0, PAYMENT_CONFIG.localPreview.keepLastCount);

  window.localStorage.setItem(storageKey, JSON.stringify(nextItems));
};

export const getPaymentPreviews = (): PaymentPreview[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const existingRaw = window.localStorage.getItem(PAYMENT_CONFIG.localPreview.storageKey);
  return existingRaw ? (JSON.parse(existingRaw) as PaymentPreview[]) : [];
};

export const clearPaymentPreviews = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PAYMENT_CONFIG.localPreview.storageKey);
};

export const getRazorpayCheckoutOptions = (payload: PaymentOrderPayload & { orderId?: string }) => {
  const amount = convertToSmallestCurrencyUnit(calculateTotalWithGst(payload.amount), payload.currency ?? PAYMENT_CONFIG.currency);

  return {
    key: PAYMENT_CONFIG.razorpay.keyId,
    amount,
    currency: payload.currency ?? PAYMENT_CONFIG.currency,
    name: PAYMENT_CONFIG.razorpay.companyName,
    description: payload.planKey ? `${PAYMENT_CONFIG.plans[payload.planKey].name} Plan` : "MEI CRM Payment",
    image: PAYMENT_CONFIG.razorpay.imageUrl || undefined,
    order_id: payload.orderId,
    prefill: {
      name: payload.customerName,
      email: PAYMENT_CONFIG.razorpay.prefillEmail ? payload.customerEmail : undefined,
      contact: PAYMENT_CONFIG.razorpay.prefillContact ? payload.customerPhone : undefined,
    },
    theme: {
      color: PAYMENT_CONFIG.razorpay.checkoutThemeColor,
    },
    notes: payload.notes,
  };
};

export const assertPaymentConfig = (): void => {
  const errors: string[] = [];

  if (!PAYMENT_CONFIG.api.baseUrl) {
    errors.push("VITE_API_BASE_URL is required.");
  }

  if (!PAYMENT_CONFIG.api.createOrderEndpoint) {
    errors.push("VITE_PAYMENT_CREATE_ORDER_ENDPOINT is required.");
  }

  if (PAYMENT_CONFIG.api.timeoutMs <= 0) {
    errors.push("VITE_PAYMENT_TIMEOUT_MS must be greater than 0.");
  }

  if (PAYMENT_CONFIG.api.retryCount < 0) {
    errors.push("VITE_PAYMENT_RETRY_COUNT cannot be negative.");
  }

  if (PAYMENT_CONFIG.validation.minAmount < 0) {
    errors.push("VITE_PAYMENT_MIN_AMOUNT cannot be negative.");
  }

  if (PAYMENT_CONFIG.validation.maxAmount <= PAYMENT_CONFIG.validation.minAmount) {
    errors.push("VITE_PAYMENT_MAX_AMOUNT must be greater than VITE_PAYMENT_MIN_AMOUNT.");
  }

  if (PAYMENT_CONFIG.validation.maxSeats < PAYMENT_CONFIG.validation.minSeats) {
    errors.push("VITE_PAYMENT_MAX_SEATS must be greater than or equal to VITE_PAYMENT_MIN_SEATS.");
  }

  if (PAYMENT_CONFIG.provider === "razorpay" && PAYMENT_CONFIG.razorpay.enabled && !PAYMENT_CONFIG.razorpay.keyId && PAYMENT_CONFIG.mode !== "mock") {
    errors.push("VITE_RAZORPAY_KEY_ID is required when Razorpay is enabled.");
  }

  if (PAYMENT_CONFIG.provider === "stripe" && PAYMENT_CONFIG.stripe.enabled && !PAYMENT_CONFIG.stripe.publishableKey && PAYMENT_CONFIG.mode !== "mock") {
    errors.push("VITE_STRIPE_PUBLISHABLE_KEY is required when Stripe is enabled.");
  }

  if (errors.length > 0) {
    throw new Error(`Invalid payment configuration:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  }
};

export default PAYMENT_CONFIG;
