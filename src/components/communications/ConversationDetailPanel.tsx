import React from "react";
import {
  Clock3,
  Mail,
  MessageSquareText,
  PanelRight,
  Phone,
  Shield,
  User2,
} from "lucide-react";

export interface ConversationDetailPanelProps {
  title: string;
  subtitle?: string;
  participantName?: string;
  participantRole?: string;
  channel?: "email" | "sms" | "whatsapp" | "call" | "internal";
  statusLabel?: string;
  lastActivityLabel?: string;
  isInternal?: boolean;
  className?: string;
  timeline: React.ReactNode;
  composer?: React.ReactNode;
  sidebar?: React.ReactNode;
  headerActions?: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getChannelIcon = (channel?: ConversationDetailPanelProps["channel"]) => {
  switch (channel) {
    case "email":
      return <Mail className="h-4 w-4" />;
    case "sms":
    case "whatsapp":
      return <MessageSquareText className="h-4 w-4" />;
    case "call":
      return <Phone className="h-4 w-4" />;
    case "internal":
      return <Shield className="h-4 w-4" />;
    default:
      return <MessageSquareText className="h-4 w-4" />;
  }
};

const getChannelLabel = (channel?: ConversationDetailPanelProps["channel"]) => {
  switch (channel) {
    case "email":
      return "Email";
    case "sms":
      return "SMS";
    case "whatsapp":
      return "WhatsApp";
    case "call":
      return "Call";
    case "internal":
      return "Internal";
    default:
      return "Conversation";
  }
};

const LoadingState = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-72 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-7 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="ml-auto h-20 w-3/4 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-24 w-4/5 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 dark:border-slate-700 dark:bg-slate-950/50">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <MessageSquareText className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
};

const ConversationDetailPanel: React.FC<ConversationDetailPanelProps> = ({
  title,
  subtitle,
  participantName,
  participantRole,
  channel,
  statusLabel = "Active",
  lastActivityLabel,
  isInternal = false,
  className,
  timeline,
  composer,
  sidebar,
  headerActions,
  loading = false,
  empty = false,
  emptyTitle = "No conversation selected",
  emptyDescription = "Choose a thread from the list to view the full conversation, notes, and activity history.",
}) => {
  if (loading) {
    return (
      <div className={cn("grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]", className)}>
        <LoadingState />
        {sidebar ? <div className="hidden xl:block">{sidebar}</div> : null}
      </div>
    );
  }

  if (empty) {
    return (
      <div className={cn("grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]", className)}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
        {sidebar ? <div className="hidden xl:block">{sidebar}</div> : null}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]", className)}>
      <div className="min-w-0 space-y-4">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h1>

                {isInternal ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                    <Shield className="h-3.5 w-3.5" />
                    Internal
                  </span>
                ) : null}
              </div>

              {subtitle ? (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {getChannelIcon(channel)}
                  {getChannelLabel(channel)}
                </span>

                {participantName ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <User2 className="h-3.5 w-3.5" />
                    {participantName}
                  </span>
                ) : null}

                {participantRole ? (
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {participantRole}
                  </span>
                ) : null}

                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {statusLabel}
                </span>

                {lastActivityLabel ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    <Clock3 className="h-3.5 w-3.5" />
                    {lastActivityLabel}
                  </span>
                ) : null}
              </div>
            </div>

            {headerActions ? (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {headerActions}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Conversation Timeline
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Messages, emails, internal notes, and activity updates in one stream.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:inline-flex">
              <PanelRight className="h-4 w-4" />
              Live context view
            </div>
          </div>

          <div className="min-h-[320px]">{timeline}</div>
        </section>

        {composer ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            {composer}
          </section>
        ) : null}
      </div>

      {sidebar ? <div className="min-w-0">{sidebar}</div> : null}
    </div>
  );
};

export default ConversationDetailPanel;