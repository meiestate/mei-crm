import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";
import type { CSSProperties } from "react";

type HelpSupportPageProps = {
  mode: ThemeMode;
};

type QuickAction = {
  title: string;
  description: string;
  icon: string;
};

type HelpCategory = {
  title: string;
  description: string;
  count: number;
  icon: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type GuideItem = {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  updatedAt: string;
};

type TicketItem = {
  id: string;
  title: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Waiting for User" | "Resolved" | "Closed";
  submittedAt: string;
  updatedAt: string;
  agent: string;
};

type TutorialItem = {
  title: string;
  description: string;
  duration: string;
};

type HelpSupportLocationState = {
  openRaiseTicketForm?: boolean;
};

type TicketFormState = {
  issueTitle: string;
  category: string;
  priority: string;
  relatedModule: string;
  description: string;
};

type TicketFormErrors = Partial<Record<keyof TicketFormState, string>>;

const quickActions: QuickAction[] = [
  {
    title: "Raise a Ticket",
    description: "Submit a support request with priority and issue details.",
    icon: "🎫",
  },
  {
    title: "Chat with Support",
    description: "Start a live chat for quick issue resolution.",
    icon: "💬",
  },
  {
    title: "Billing Help",
    description: "Get help with invoices, failed payments, and plan changes.",
    icon: "💳",
  },
  {
    title: "Report a Bug",
    description: "Share technical problems, UI bugs, and unexpected errors.",
    icon: "🐞",
  },
  {
    title: "Setup Assistance",
    description: "Need help onboarding your CRM team or importing data?",
    icon: "⚙️",
  },
  {
    title: "Call Support",
    description: "Talk to our support team for urgent assistance.",
    icon: "📞",
  },
];

const helpCategories: HelpCategory[] = [
  {
    title: "Account & Login",
    description: "Password reset, OTP issues, sign in, and access problems.",
    count: 16,
    icon: "🔐",
  },
  {
    title: "Leads & Contacts",
    description: "Lead creation, updates, import issues, and ownership logic.",
    count: 24,
    icon: "👥",
  },
  {
    title: "Deals & Pipeline",
    description: "Deal stages, conversion flow, and pipeline tracking help.",
    count: 14,
    icon: "📊",
  },
  {
    title: "Tasks & Follow-ups",
    description: "Task reminders, overdue items, and follow-up workflow issues.",
    count: 11,
    icon: "✅",
  },
  {
    title: "Billing & Subscription",
    description: "Plans, invoices, payment failure, GST, and seat management.",
    count: 18,
    icon: "🧾",
  },
  {
    title: "Team & Roles",
    description: "Permissions, team invites, role access, and admin controls.",
    count: 9,
    icon: "🧑‍💼",
  },
  {
    title: "Import / Export",
    description: "CSV upload, data formatting, mapping, and export problems.",
    count: 12,
    icon: "📂",
  },
  {
    title: "Integrations",
    description: "WhatsApp, email, payment gateways, and API connection help.",
    count: 15,
    icon: "🔌",
  },
];

const faqItems: FAQItem[] = [
  {
    question: "How do I add a new lead in MEI CRM?",
    answer:
      "Go to the Leads page, click Add Lead, fill the required fields, and save. You can also import multiple leads through CSV.",
  },
  {
    question: "Why is my CSV import failing?",
    answer:
      "Check whether required columns are present, file format is correct, duplicate values exist, or invalid mobile/email data is included.",
  },
  {
    question: "How do I upgrade my subscription plan?",
    answer:
      "Go to Billing & Subscription, choose your new plan, review seat count, and complete payment to upgrade immediately.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Use the Forgot Password option on the login page and follow the email or OTP verification steps.",
  },
  {
    question: "Why am I not receiving notifications?",
    answer:
      "Check notification settings, browser permissions, email spam folder, and integration status if external channels are connected.",
  },
];

const guides: GuideItem[] = [
  {
    title: "OTP Not Received",
    description: "Troubleshoot login OTP delivery problems in a few steps.",
    difficulty: "Easy",
    updatedAt: "Updated 2 days ago",
  },
  {
    title: "Lead Import Failed",
    description: "Fix CSV format, field mapping, and validation errors.",
    difficulty: "Medium",
    updatedAt: "Updated 4 days ago",
  },
  {
    title: "Payment Declined",
    description: "Understand card, UPI, bank, and subscription retry failures.",
    difficulty: "Easy",
    updatedAt: "Updated 1 week ago",
  },
  {
    title: "Email Notifications Not Sending",
    description: "Check sender setup, SMTP config, and delivery restrictions.",
    difficulty: "Advanced",
    updatedAt: "Updated 6 days ago",
  },
];

const baseTickets: TicketItem[] = [
  {
    id: "#SUP-1048",
    title: "Invoice download is not working",
    category: "Billing",
    priority: "High",
    status: "In Progress",
    submittedAt: "07 Apr 2026",
    updatedAt: "07 Apr 2026",
    agent: "Riya",
  },
  {
    id: "#SUP-1042",
    title: "CSV import failed on contacts upload",
    category: "Import / Export",
    priority: "Medium",
    status: "Waiting for User",
    submittedAt: "05 Apr 2026",
    updatedAt: "06 Apr 2026",
    agent: "Karthik",
  },
  {
    id: "#SUP-1031",
    title: "Unable to login after password reset",
    category: "Account & Login",
    priority: "Critical",
    status: "Resolved",
    submittedAt: "02 Apr 2026",
    updatedAt: "03 Apr 2026",
    agent: "Ananya",
  },
];

const tutorials: TutorialItem[] = [
  {
    title: "Set up your CRM in 10 minutes",
    description: "Quick onboarding guide for account setup, team, and workflow basics.",
    duration: "10 min",
  },
  {
    title: "Import your first leads",
    description: "Learn CSV import, field mapping, and cleanup tips.",
    duration: "8 min",
  },
  {
    title: "Manage follow-ups like a pro",
    description: "Track tasks, reminders, and lead engagement in one flow.",
    duration: "6 min",
  },
];

function SectionTitle({
  title,
  subtitle,
  actionLabel,
  onActionClick,
  actionButtonStyle,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  actionButtonStyle?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 18,
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 800,
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 14,
              opacity: 0.82,
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {actionLabel ? (
        <button
          onClick={onActionClick}
          style={{
            border: "none",
            borderRadius: 12,
            padding: "10px 14px",
            fontWeight: 700,
            cursor: "pointer",
            ...actionButtonStyle,
          }}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

const initialTicketForm: TicketFormState = {
  issueTitle: "",
  category: "",
  priority: "",
  relatedModule: "",
  description: "",
};

export default function HelpSupportPage({ mode }: HelpSupportPageProps) {
  const theme = getTheme(mode);
  const location = useLocation();
  const locationState = (location.state as HelpSupportLocationState | null) ?? null;

  const raiseTicketRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [ticketFilter, setTicketFilter] = useState("All");
  const [highlightRaiseTicket, setHighlightRaiseTicket] = useState(false);

  const [ticketForm, setTicketForm] = useState<TicketFormState>(initialTicketForm);
  const [ticketErrors, setTicketErrors] = useState<TicketFormErrors>({});
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [showTicketToast, setShowTicketToast] = useState(false);
  const [ticketToastMessage, setTicketToastMessage] = useState("");
  const [tickets, setTickets] = useState<TicketItem[]>(baseTickets);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return helpCategories;
    return helpCategories.filter((item) =>
      `${item.title} ${item.description}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredFaqs = useMemo(() => {
    if (!searchTerm.trim()) return faqItems;
    return faqItems.filter((item) =>
      `${item.question} ${item.answer}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredTickets = useMemo(() => {
    if (ticketFilter === "All") return tickets;
    return tickets.filter((ticket) => ticket.status === ticketFilter);
  }, [ticketFilter, tickets]);

  const scrollToRaiseTicketForm = () => {
    raiseTicketRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setHighlightRaiseTicket(true);

    window.setTimeout(() => {
      setHighlightRaiseTicket(false);
    }, 2200);
  };

  useEffect(() => {
    if (locationState?.openRaiseTicketForm) {
      const timer = window.setTimeout(() => {
        scrollToRaiseTicketForm();
        window.history.replaceState(
          { ...(window.history.state || {}), usr: {} },
          document.title
        );
      }, 120);

      return () => window.clearTimeout(timer);
    }
  }, [locationState?.openRaiseTicketForm]);

  useEffect(() => {
    if (!showTicketToast) return;

    const timer = window.setTimeout(() => {
      setShowTicketToast(false);
      setTicketToastMessage("");
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [showTicketToast]);

  const handleTicketFieldChange = (
    field: keyof TicketFormState,
    value: string
  ) => {
    setTicketForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setTicketErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateTicketForm = () => {
    const errors: TicketFormErrors = {};

    if (!ticketForm.issueTitle.trim()) {
      errors.issueTitle = "Issue title is required";
    } else if (ticketForm.issueTitle.trim().length < 5) {
      errors.issueTitle = "Issue title must be at least 5 characters";
    }

    if (!ticketForm.category.trim()) {
      errors.category = "Please choose a category";
    }

    if (!ticketForm.priority.trim()) {
      errors.priority = "Please select a priority";
    }

    if (!ticketForm.relatedModule.trim()) {
      errors.relatedModule = "Related page or module is required";
    }

    if (!ticketForm.description.trim()) {
      errors.description = "Issue description is required";
    } else if (ticketForm.description.trim().length < 20) {
      errors.description = "Description must be at least 20 characters";
    }

    setTicketErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDraft = () => {
    localStorage.setItem("mei-help-ticket-draft", JSON.stringify(ticketForm));
    setTicketToastMessage("Ticket draft saved successfully");
    setShowTicketToast(true);
  };

  const handleSubmitTicket = () => {
    if (!validateTicketForm()) {
      scrollToRaiseTicketForm();
      return;
    }

    setIsSubmittingTicket(true);

    window.setTimeout(() => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();

      const formattedDate = `${day} ${month} ${year}`;
      const nextId = `#SUP-${1050 + tickets.length}`;

      const newTicket: TicketItem = {
        id: nextId,
        title: ticketForm.issueTitle.trim(),
        category: ticketForm.category,
        priority: ticketForm.priority as TicketItem["priority"],
        status: "Open",
        submittedAt: formattedDate,
        updatedAt: formattedDate,
        agent: "Unassigned",
      };

      setTickets((prev) => [newTicket, ...prev]);
      setTicketForm(initialTicketForm);
      setTicketErrors({});
      localStorage.removeItem("mei-help-ticket-draft");
      setIsSubmittingTicket(false);
      setTicketFilter("All");
      setTicketToastMessage(`Support ticket ${nextId} submitted successfully`);
      setShowTicketToast(true);
    }, 900);
  };

  useEffect(() => {
    const savedDraft = localStorage.getItem("mei-help-ticket-draft");
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft) as TicketFormState;
        setTicketForm(parsedDraft);
      } catch {
        localStorage.removeItem("mei-help-ticket-draft");
      }
    }
  }, []);

  const getPriorityBadge = (priority: TicketItem["priority"]) => {
    switch (priority) {
      case "Critical":
        return { bg: "rgba(239,68,68,0.14)", color: "#ef4444" };
      case "High":
        return { bg: "rgba(249,115,22,0.14)", color: "#f97316" };
      case "Medium":
        return { bg: "rgba(234,179,8,0.14)", color: "#ca8a04" };
      case "Low":
      default:
        return { bg: "rgba(34,197,94,0.14)", color: "#16a34a" };
    }
  };

  const getStatusBadge = (status: TicketItem["status"]) => {
    switch (status) {
      case "Open":
        return { bg: "rgba(59,130,246,0.14)", color: "#2563eb" };
      case "In Progress":
        return { bg: "rgba(168,85,247,0.14)", color: "#9333ea" };
      case "Waiting for User":
        return { bg: "rgba(245,158,11,0.14)", color: "#d97706" };
      case "Resolved":
        return { bg: "rgba(34,197,94,0.14)", color: "#16a34a" };
      case "Closed":
      default:
        return { bg: "rgba(107,114,128,0.14)", color: "#6b7280" };
    }
  };

  const inputStyle: CSSProperties = {
    background: theme.inputBg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: "13px 14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const errorTextStyle: CSSProperties = {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 6,
    fontWeight: 600,
  };

  const getFieldStyle = (hasError?: boolean): CSSProperties => ({
    ...inputStyle,
    border: hasError ? "1px solid #ef4444" : `1px solid ${theme.border}`,
  });

  return (
    <div
      style={{
        background: theme.pageBg,
        minHeight: "100vh",
        padding: 24,
        color: theme.text,
        position: "relative",
      }}
    >
      {showTicketToast ? (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 1000,
            background: "#16a34a",
            color: "#ffffff",
            borderRadius: 14,
            padding: "14px 18px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          ✅ {ticketToastMessage}
        </div>
      ) : null}

      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <section
          style={{
            background: `linear-gradient(135deg, ${theme.cardBg} 0%, ${theme.cardBgSoft} 100%)`,
            border: `1px solid ${theme.border}`,
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 760 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 999,
                  padding: "8px 12px",
                  background: theme.primary + "15",
                  color: theme.primary,
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 14,
                }}
              >
                <span>🛟</span>
                <span>Support Center</span>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 34,
                  lineHeight: 1.2,
                  fontWeight: 900,
                }}
              >
                Help & Support
              </h1>

              <p
                style={{
                  margin: "12px 0 0",
                  color: theme.subText,
                  fontSize: 15,
                  lineHeight: 1.8,
                  maxWidth: 760,
                }}
              >
                Find answers, troubleshoot issues, contact support, and track your
                tickets from one centralized support hub inside MEI CRM.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={scrollToRaiseTicketForm}
                style={{
                  background: theme.primary,
                  color: theme.inverseText,
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 18px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Raise Ticket
              </button>

              <button
                style={{
                  background: theme.cardBg,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  padding: "12px 18px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Contact Support
              </button>

              <button
                style={{
                  background: theme.cardBg,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  padding: "12px 18px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                View My Tickets
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: 22,
              display: "grid",
              gridTemplateColumns: "1fr 180px",
              gap: 12,
            }}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search help articles, FAQs, billing issues, CRM setup, import errors..."
              style={{
                width: "100%",
                background: theme.inputBg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: 14,
                padding: "14px 16px",
                fontSize: 14,
                outline: "none",
              }}
            />

            <select
              defaultValue="All"
              style={{
                background: theme.inputBg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: 14,
                padding: "14px 16px",
                fontSize: 14,
                outline: "none",
              }}
            >
              <option>All</option>
              <option>Articles</option>
              <option>FAQs</option>
              <option>Tickets</option>
              <option>Tutorials</option>
            </select>
          </div>
        </section>

        <section
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: 22,
            padding: 22,
          }}
        >
          <SectionTitle
            title="Quick Help Actions"
            subtitle="Jump straight into the support action you need most."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {quickActions.map((action) => (
              <div
                key={action.title}
                onClick={() => {
                  if (action.title === "Raise a Ticket") {
                    scrollToRaiseTicketForm();
                  }
                }}
                style={{
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.borderSoft}`,
                  borderRadius: 18,
                  padding: 18,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{action.icon}</div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 800,
                  }}
                >
                  {action.title}
                </h3>
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: theme.subText,
                  }}
                >
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 20,
          }}
        >
          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: 22,
              padding: 22,
            }}
          >
            <SectionTitle
              title="System Status"
              subtitle="Current operational health of key services inside MEI CRM."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
              }}
            >
              {[
                { name: "CRM Core", status: "Operational" },
                { name: "Login / Auth", status: "Operational" },
                { name: "Billing", status: "Slow" },
                { name: "Email Notifications", status: "Operational" },
                { name: "API Services", status: "Operational" },
                { name: "File Uploads", status: "Operational" },
              ].map((service) => (
                <div
                  key={service.name}
                  style={{
                    background: theme.cardBgSoft,
                    border: `1px solid ${theme.borderSoft}`,
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    {service.name}
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      borderRadius: 999,
                      padding: "6px 10px",
                      background:
                        service.status === "Slow"
                          ? "rgba(245,158,11,0.15)"
                          : "rgba(34,197,94,0.14)",
                      color: service.status === "Slow" ? "#d97706" : "#16a34a",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    <span>{service.status === "Slow" ? "⚠️" : "●"}</span>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: 22,
              padding: 22,
            }}
          >
            <SectionTitle
              title="Support Snapshot"
              subtitle="A quick trust signal for response quality and speed."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {[
                { label: "Avg Response", value: "12 min" },
                { label: "Avg Resolution", value: "4.2 hrs" },
                { label: "Satisfaction", value: "4.8/5" },
                { label: "Solved This Month", value: "184" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: theme.cardBgSoft,
                    border: `1px solid ${theme.borderSoft}`,
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.subText,
                      marginBottom: 8,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 900,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: 22,
            padding: 22,
          }}
        >
          <SectionTitle
            title="Help Categories"
            subtitle="Browse help topics by module and issue type."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {filteredCategories.map((category) => (
              <div
                key={category.title}
                style={{
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.borderSoft}`,
                  borderRadius: 18,
                  padding: 18,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 28 }}>{category.icon}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      borderRadius: 999,
                      padding: "6px 10px",
                      background: theme.primary + "14",
                      color: theme.primary,
                    }}
                  >
                    {category.count} Articles
                  </span>
                </div>

                <h3
                  style={{
                    margin: "14px 0 8px",
                    fontSize: 17,
                    fontWeight: 800,
                  }}
                >
                  {category.title}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: theme.subText,
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 20,
          }}
        >
          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: 22,
              padding: 22,
            }}
          >
            <SectionTitle
              title="Frequently Asked Questions"
              subtitle="Fast answers to the most common user questions."
              actionLabel="View All FAQs"
              actionButtonStyle={{
                background: theme.cardBgSoft,
                color: theme.text,
                border: `1px solid ${theme.border}`,
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <div
                    key={faq.question}
                    style={{
                      background: theme.cardBgSoft,
                      border: `1px solid ${theme.borderSoft}`,
                      borderRadius: 16,
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        color: theme.text,
                        textAlign: "left",
                        padding: 16,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      <span>{faq.question}</span>
                      <span>{isOpen ? "−" : "+"}</span>
                    </button>

                    {isOpen ? (
                      <div
                        style={{
                          padding: "0 16px 16px",
                          color: theme.subText,
                          fontSize: 14,
                          lineHeight: 1.75,
                        }}
                      >
                        {faq.answer}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: 22,
              padding: 22,
            }}
          >
            <SectionTitle
              title="Troubleshooting Guides"
              subtitle="Step-by-step help for the most common issues."
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {guides.map((guide) => (
                <div
                  key={guide.title}
                  style={{
                    background: theme.cardBgSoft,
                    border: `1px solid ${theme.borderSoft}`,
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 800,
                      }}
                    >
                      {guide.title}
                    </h3>

                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        borderRadius: 999,
                        padding: "6px 10px",
                        background:
                          guide.difficulty === "Advanced"
                            ? "rgba(239,68,68,0.12)"
                            : guide.difficulty === "Medium"
                            ? "rgba(245,158,11,0.14)"
                            : "rgba(34,197,94,0.14)",
                        color:
                          guide.difficulty === "Advanced"
                            ? "#dc2626"
                            : guide.difficulty === "Medium"
                            ? "#d97706"
                            : "#16a34a",
                      }}
                    >
                      {guide.difficulty}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "10px 0 10px",
                      color: theme.subText,
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    {guide.description}
                  </p>

                  <div
                    style={{
                      fontSize: 12,
                      color: theme.mutedText,
                      fontWeight: 600,
                    }}
                  >
                    {guide.updatedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 20,
          }}
        >
          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: 22,
              padding: 22,
            }}
          >
            <SectionTitle
              title="Contact Support"
              subtitle="Choose the support channel that works best for you."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 14,
              }}
            >
              {[
                {
                  title: "Live Chat",
                  info: "Available Mon–Sat, 9:00 AM to 7:00 PM",
                  icon: "💬",
                },
                {
                  title: "Email Support",
                  info: "Response usually within 4 business hours",
                  icon: "📧",
                },
                {
                  title: "Phone Support",
                  info: "Priority support for urgent plan or access issues",
                  icon: "📞",
                },
                {
                  title: "WhatsApp Support",
                  info: "Fast conversational help for day-to-day issues",
                  icon: "🟢",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: theme.cardBgSoft,
                    border: `1px solid ${theme.borderSoft}`,
                    borderRadius: 16,
                    padding: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ fontSize: 24 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>{item.title}</div>
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 13,
                          color: theme.subText,
                        }}
                      >
                        {item.info}
                      </div>
                    </div>
                  </div>

                  <button
                    style={{
                      background: theme.primary,
                      color: theme.inverseText,
                      border: "none",
                      borderRadius: 12,
                      padding: "10px 14px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={raiseTicketRef}
            style={{
              background: theme.cardBg,
              border: highlightRaiseTicket
                ? `2px solid ${theme.primary}`
                : `1px solid ${theme.border}`,
              borderRadius: 22,
              padding: 22,
              boxShadow: highlightRaiseTicket
                ? `0 0 0 4px ${theme.primary}22, 0 16px 40px rgba(0,0,0,0.08)`
                : "none",
              transition: "all 0.25s ease",
            }}
          >
            <SectionTitle
              title="Raise a Support Ticket"
              subtitle="Describe your issue clearly so the team can resolve it faster."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <input
                  value={ticketForm.issueTitle}
                  onChange={(e) =>
                    handleTicketFieldChange("issueTitle", e.target.value)
                  }
                  placeholder="Issue title"
                  style={getFieldStyle(!!ticketErrors.issueTitle)}
                />
                {ticketErrors.issueTitle ? (
                  <div style={errorTextStyle}>{ticketErrors.issueTitle}</div>
                ) : null}
              </div>

              <div>
                <select
                  value={ticketForm.category}
                  onChange={(e) =>
                    handleTicketFieldChange("category", e.target.value)
                  }
                  style={getFieldStyle(!!ticketErrors.category)}
                >
                  <option value="">Choose category</option>
                  <option value="Account & Login">Account & Login</option>
                  <option value="Billing">Billing</option>
                  <option value="Leads">Leads</option>
                  <option value="Tasks">Tasks</option>
                  <option value="Integrations">Integrations</option>
                </select>
                {ticketErrors.category ? (
                  <div style={errorTextStyle}>{ticketErrors.category}</div>
                ) : null}
              </div>

              <div>
                <select
                  value={ticketForm.priority}
                  onChange={(e) =>
                    handleTicketFieldChange("priority", e.target.value)
                  }
                  style={getFieldStyle(!!ticketErrors.priority)}
                >
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                {ticketErrors.priority ? (
                  <div style={errorTextStyle}>{ticketErrors.priority}</div>
                ) : null}
              </div>

              <div>
                <input
                  value={ticketForm.relatedModule}
                  onChange={(e) =>
                    handleTicketFieldChange("relatedModule", e.target.value)
                  }
                  placeholder="Related page / module"
                  style={getFieldStyle(!!ticketErrors.relatedModule)}
                />
                {ticketErrors.relatedModule ? (
                  <div style={errorTextStyle}>{ticketErrors.relatedModule}</div>
                ) : null}
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) =>
                    handleTicketFieldChange("description", e.target.value)
                  }
                  placeholder="Describe the issue, expected result, and what actually happened..."
                  rows={6}
                  style={{
                    ...getFieldStyle(!!ticketErrors.description),
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
                {ticketErrors.description ? (
                  <div style={errorTextStyle}>{ticketErrors.description}</div>
                ) : null}
              </div>

              <div
                style={{
                  gridColumn: "1 / -1",
                  border: `1px dashed ${theme.borderStrong}`,
                  borderRadius: 14,
                  padding: 16,
                  background: theme.cardBgSoft,
                  color: theme.subText,
                  fontSize: 14,
                }}
              >
                Drag & drop screenshots, invoices, or issue files here
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: theme.subText,
                }}
              >
                Estimated response time: <strong>within 30 minutes</strong> for high priority
              </span>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleSaveDraft}
                  style={{
                    background: theme.cardBg,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Save Draft
                </button>
                <button
                  onClick={handleSubmitTicket}
                  disabled={isSubmittingTicket}
                  style={{
                    background: theme.primary,
                    color: theme.inverseText,
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontWeight: 800,
                    cursor: isSubmittingTicket ? "not-allowed" : "pointer",
                    opacity: isSubmittingTicket ? 0.7 : 1,
                  }}
                >
                  {isSubmittingTicket ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: 22,
            padding: 22,
          }}
        >
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
            <SectionTitle
              title="My Support Tickets"
              subtitle="Track status, priorities, and assigned agents in one place."
            />

            <select
              value={ticketFilter}
              onChange={(e) => setTicketFilter(e.target.value)}
              style={{
                background: theme.inputBg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 14,
                outline: "none",
                minWidth: 180,
              }}
            >
              <option>All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Waiting for User</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </div>

          <div
            style={{
              width: "100%",
              overflowX: "auto",
              border: `1px solid ${theme.borderSoft}`,
              borderRadius: 18,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 980,
              }}
            >
              <thead
                style={{
                  background: theme.tableHeadBg,
                }}
              >
                <tr>
                  {[
                    "Ticket ID",
                    "Title",
                    "Category",
                    "Priority",
                    "Status",
                    "Submitted",
                    "Last Updated",
                    "Agent",
                  ].map((head) => (
                    <th
                      key={head}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        fontSize: 13,
                        fontWeight: 800,
                        color: theme.subText,
                        borderBottom: `1px solid ${theme.borderSoft}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((ticket) => {
                  const priorityStyle = getPriorityBadge(ticket.priority);
                  const statusStyle = getStatusBadge(ticket.status);

                  return (
                    <tr key={ticket.id} style={{ background: theme.rowBg }}>
                      <td
                        style={{
                          padding: "14px 16px",
                          borderBottom: `1px solid ${theme.borderSoft}`,
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ticket.id}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          borderBottom: `1px solid ${theme.borderSoft}`,
                          fontWeight: 700,
                        }}
                      >
                        {ticket.title}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          borderBottom: `1px solid ${theme.borderSoft}`,
                          color: theme.subText,
                        }}
                      >
                        {ticket.category}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          borderBottom: `1px solid ${theme.borderSoft}`,
                        }}
                      >
                        <span
                          style={{
                            background: priorityStyle.bg,
                            color: priorityStyle.color,
                            borderRadius: 999,
                            padding: "6px 10px",
                            fontSize: 12,
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          borderBottom: `1px solid ${theme.borderSoft}`,
                        }}
                      >
                        <span
                          style={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            borderRadius: 999,
                            padding: "6px 10px",
                            fontSize: 12,
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          borderBottom: `1px solid ${theme.borderSoft}`,
                          color: theme.subText,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ticket.submittedAt}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          borderBottom: `1px solid ${theme.borderSoft}`,
                          color: theme.subText,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ticket.updatedAt}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          borderBottom: `1px solid ${theme.borderSoft}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ticket.agent}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: 22,
              padding: 22,
            }}
          >
            <SectionTitle
              title="Tutorials & Getting Started"
              subtitle="Learn the core workflows with guided support content."
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {tutorials.map((tutorial) => (
                <div
                  key={tutorial.title}
                  style={{
                    background: theme.cardBgSoft,
                    border: `1px solid ${theme.borderSoft}`,
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 800,
                      }}
                    >
                      {tutorial.title}
                    </h3>

                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        fontSize: 12,
                        fontWeight: 800,
                        background: theme.primary + "12",
                        color: theme.primary,
                      }}
                    >
                      {tutorial.duration}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "10px 0 0",
                      fontSize: 14,
                      color: theme.subText,
                      lineHeight: 1.7,
                    }}
                  >
                    {tutorial.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: 22,
              padding: 22,
            }}
          >
            <SectionTitle
              title="Feedback & Suggestions"
              subtitle="Tell us what’s broken, what’s missing, or what can be improved."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 14,
              }}
            >
              <select
                style={{
                  background: theme.inputBg,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  padding: "13px 14px",
                  outline: "none",
                }}
              >
                <option>Select feedback type</option>
                <option>Feature Request</option>
                <option>UI Feedback</option>
                <option>Bug Report</option>
                <option>General Suggestion</option>
              </select>

              <textarea
                placeholder="Share your feedback or idea..."
                rows={6}
                style={{
                  resize: "vertical",
                  background: theme.inputBg,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  padding: "13px 14px",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {["😞", "😐", "🙂", "😍"].map((emoji) => (
                  <button
                    key={emoji}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      border: `1px solid ${theme.border}`,
                      background: theme.cardBgSoft,
                      cursor: "pointer",
                      fontSize: 20,
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  style={{
                    background: theme.primary,
                    color: theme.inverseText,
                    border: "none",
                    borderRadius: 12,
                    padding: "11px 16px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}