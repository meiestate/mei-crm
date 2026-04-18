import React from "react";
import {
  Activity,
  AlertCircle,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  User2,
} from "lucide-react";

export interface ContextSidebarContact {
  name: string;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  initials?: string;
  statusLabel?: string;
  statusTone?: "success" | "warning" | "neutral";
}

export interface ContextSidebarInsight {
  id: string | number;
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "warning";
}

export interface ContextSidebarTimelineItem {
  id: string | number;
  title: string;
  time: string;
  description?: string;
  tone?: "default" | "success" | "warning";
}

export interface ContextSidebarProps {
  className?: string;
  title?: string;
  subtitle?: string;
  contact?: ContextSidebarContact;
  insights?: ContextSidebarInsight[];
  nextStepTitle?: string;
  nextStepDescription?: string;
  nextStepDueLabel?: string;
  timeline?: ContextSidebarTimelineItem[];
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getInitials = (name?: string, fallback = "C") => {
  if (!name) return fallback;

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) return fallback;

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
};

const getToneClasses = (
  tone: "default" | "success" | "warning" = "default"
) => {
  switch (tone) {
    case "success":
      return {
        badge:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300",
        dot: "bg-emerald-500",
      };
    case "warning":
      return {
        badge:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300",
        dot: "bg-amber-500",
      };
    case "default":
    default:
      return {
        badge:
          "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
        dot: "bg-slate-400",
      };
  }
};

const defaultInsights: ContextSidebarInsight[] = [
  {
    id: 1,
    label: "Lead Score",
    value: "82 / 100",
    hint: "Strong buying intent",
    tone: "success",
  },
  {
    id: 2,
    label: "Response Rate",
    value: "88%",
    hint: "Last 30 days",
    tone: "success",
  },
  {
    id: 3,
    label: "Open Follow-ups",
    value: "3",
    hint: "Needs attention",
    tone: "warning",
  },
  {
    id: 4,
    label: "Preferred Channel",
    value: "WhatsApp",
    hint: "Fastest response",
    tone: "default",
  },
];

const defaultTimeline: ContextSidebarTimelineItem[] = [
  {
    id: 1,
    title: "Last reply received",
    time: "Today • 10:30 AM",
    description: "Asked for pricing details and available unit options.",
    tone: "success",
  },
  {
    id: 2,
    title: "Follow-up reminder",
    time: "Today • 4:00 PM",
    description: "Send brochure and schedule a short call.",
    tone: "warning",
  },
  {
    id: 3,
    title: "Site visit planned",
    time: "Tomorrow • 11:00 AM",
    description: "Tentative visit with spouse confirmation pending.",
    tone: "default",
  },
];

const ContextSidebar: React.FC<ContextSidebarProps> = ({
  className,
  title = "Conversation Context",
  subtitle = "Quick contact intelligence, next steps, and live engagement signals in one focused view.",
  contact = {
    name: "Arjun Prakash",
    role: "Senior Decision Maker",
    company: "Prakash Holdings",
    email: "arjun@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    statusLabel: "Highly engaged",
    statusTone: "success",
  },
  insights = defaultInsights,
  nextStepTitle = "Send project brochure + pricing sheet",
  nextStepDescription = "This contact responds fastest to crisp WhatsApp messages followed by a short confirmation call.",
  nextStepDueLabel = "Due today • 4:00 PM",
  timeline = defaultTimeline,
}) => {
  const contactTone = getToneClasses(
    contact.statusTone === "warning"
      ? "warning"
      : contact.statusTone === "success"
        ? "success"
        : "default"
  );

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="border-b border-slate-200 p-5 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Activity className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Context
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-start gap-3">
            {contact.avatarUrl ? (
              <img
                src={contact.avatarUrl}
                alt={contact.name}
                className="h-14 w-14 rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                {contact.initials || getInitials(contact.name)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                  {contact.name}
                </h3>

                {contact.statusLabel ? (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                      contactTone.badge
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", contactTone.dot)} />
                    {contact.statusLabel}
                  </span>
                ) : null}
              </div>

              {(contact.role || contact.company) && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {[contact.role, contact.company].filter(Boolean).join(" • ")}
                </p>
              )}

              <div className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                {contact.email ? (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                ) : null}

                {contact.phone ? (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span>{contact.phone}</span>
                  </div>
                ) : null}

                {contact.location ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span>{contact.location}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Quick Insights
            </h3>
            <Sparkles className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {insights.map((item) => {
              const tone = getToneClasses(item.tone || "default");

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {item.value}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full",
                        tone.dot
                      )}
                    />
                  </div>

                  {item.hint ? (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {item.hint}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
              <CalendarClock className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Recommended Next Step
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                  <Clock3 className="h-3.5 w-3.5" />
                  {nextStepDueLabel}
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                {nextStepTitle}
              </p>
              <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">
                {nextStepDescription}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Activity Snapshot
            </h3>
            <FileText className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="space-y-3">
            {timeline.map((item) => {
              const tone = getToneClasses(item.tone || "default");

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full",
                        tone.dot
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </h4>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {item.time}
                        </span>
                      </div>

                      {item.description ? (
                        <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Trust Signals
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <User2 className="h-3.5 w-3.5" />
                  Verified Contact
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <Building2 className="h-3.5 w-3.5" />
                  Company Linked
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <Star className="h-3.5 w-3.5" />
                  High Priority
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Clean History
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
              <AlertCircle className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Communication Guidance
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                Best results usually come from concise messages, quick value summary,
                and a clear next action. Avoid sending long blocks of text in the
                first follow-up.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <MessageSquareText className="h-3.5 w-3.5" />
                  Short messages win
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <Phone className="h-3.5 w-3.5" />
                  Call after reply
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
};

export default ContextSidebar;