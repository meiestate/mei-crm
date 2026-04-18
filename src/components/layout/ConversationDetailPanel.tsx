import React from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Clock3,
  Mail,
  MessageSquareText,
  Phone,
  Sparkles,
  User2,
} from "lucide-react";

export interface ConversationParticipant {
  id: string | number;
  name: string;
  role?: string;
  avatarUrl?: string;
  initials?: string;
  email?: string;
  phone?: string;
}

export interface ConversationDetailPanelMetric {
  id: string | number;
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "success" | "warning";
}

export interface ConversationDetailPanelProps {
  className?: string;
  title?: string;
  subtitle?: string;
  channelLabel?: string;
  statusLabel?: string;
  participant?: ConversationParticipant;
  metrics?: ConversationDetailPanelMetric[];
  children?: React.ReactNode;
  footerSlot?: React.ReactNode;
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

  return parts.length
    ? parts.map((part) => part[0]?.toUpperCase() ?? "").join("")
    : fallback;
};

const getToneClasses = (
  tone: ConversationDetailPanelMetric["tone"] = "default"
) => {
  switch (tone) {
    case "success":
      return "text-emerald-600 dark:text-emerald-400";
    case "warning":
      return "text-amber-600 dark:text-amber-400";
    case "default":
    default:
      return "text-slate-500 dark:text-slate-400";
  }
};

const defaultParticipant: ConversationParticipant = {
  id: "participant-1",
  name: "Arjun Prakash",
  role: "Primary Contact",
  email: "arjun@example.com",
  phone: "+91 98765 43210",
};

const defaultMetrics: ConversationDetailPanelMetric[] = [
  {
    id: 1,
    label: "Last Response",
    value: "10:32 AM",
    hint: "Today",
    tone: "success",
  },
  {
    id: 2,
    label: "Engagement",
    value: "High",
    hint: "Buyer intent looks strong",
    tone: "success",
  },
  {
    id: 3,
    label: "Pending Tasks",
    value: "3",
    hint: "Needs follow-up",
    tone: "warning",
  },
];

const ConversationDetailPanel: React.FC<ConversationDetailPanelProps> = ({
  className,
  title = "Conversation Details",
  subtitle = "See the active thread, read signals clearly, and keep every next step moving with confidence.",
  channelLabel = "WhatsApp",
  statusLabel = "Active conversation",
  participant = defaultParticipant,
  metrics = defaultMetrics,
  children,
  footerSlot,
}) => {
  return (
    <section
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="border-b border-slate-200 p-5 sm:p-6 dark:border-slate-800">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950/20 dark:text-sky-300">
                  <Mail className="h-3.5 w-3.5" />
                  {channelLabel}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  {statusLabel}
                </span>
              </div>

              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">
                {title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
                {subtitle}
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
            >
              Open Full Contact
              <ArrowUpRight className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex items-start gap-4">
                {participant.avatarUrl ? (
                  <img
                    src={participant.avatarUrl}
                    alt={participant.name}
                    className="h-14 w-14 rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                    {participant.initials || getInitials(participant.name)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                      {participant.name}
                    </h3>

                    {participant.role ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                        <User2 className="h-3.5 w-3.5" />
                        {participant.role}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                    {participant.email ? (
                      <div className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <span className="truncate">{participant.email}</span>
                      </div>
                    ) : null}

                    {participant.phone ? (
                      <div className="inline-flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <span>{participant.phone}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {metric.value}
                  </p>
                  {metric.hint ? (
                    <p
                      className={cn(
                        "mt-1 text-xs font-medium",
                        getToneClasses(metric.tone)
                      )}
                    >
                      {metric.hint}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-slate-200 px-5 py-3 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <Clock3 className="h-3.5 w-3.5" />
              Live thread
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <MessageSquareText className="h-3.5 w-3.5" />
              Replies, notes, and context
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
              <AlertCircle className="h-3.5 w-3.5" />
              Keep follow-up clear and short
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/60 p-4 sm:p-5 dark:bg-slate-950/40">
          {children ? (
            children
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-8 text-center dark:border-slate-700 dark:bg-slate-950/70">
              <div className="max-w-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <MessageSquareText className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Conversation content goes here
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Plug in your message timeline, email cards, internal notes, or
                  composer stack inside this panel body.
                </p>
              </div>
            </div>
          )}
        </div>

        {footerSlot ? (
          <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            {footerSlot}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ConversationDetailPanel;