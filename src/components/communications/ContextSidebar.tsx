import React from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CircleAlert,
  CircleDollarSign,
  Clock3,
  FileText,
  Mail,
  MapPin,
  Phone,
  Tag,
  User2,
} from "lucide-react";

type ContextPriority = "low" | "medium" | "high" | "urgent";

export interface ContextSidebarFact {
  id: string | number;
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export interface ContextSidebarDetailItem {
  id: string | number;
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface ContextSidebarTag {
  id: string | number;
  label: string;
}

export interface ContextSidebarHighlight {
  id: string | number;
  title: string;
  description?: string;
  timestamp?: string;
}

export interface ContextSidebarRelatedRecord {
  id: string | number;
  title: string;
  subtitle?: string;
  badge?: string;
  onClick?: () => void;
}

export interface ContextSidebarProps {
  name: string;
  roleLabel?: string;
  avatarUrl?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  location?: string;
  statusLabel?: string;
  priority?: ContextPriority;
  verified?: boolean;
  sticky?: boolean;
  className?: string;
  quickActions?: React.ReactNode;
  facts?: ContextSidebarFact[];
  details?: ContextSidebarDetailItem[];
  tags?: ContextSidebarTag[];
  nextActionTitle?: string;
  nextActionDescription?: string;
  nextActionTime?: string;
  highlights?: ContextSidebarHighlight[];
  relatedRecords?: ContextSidebarRelatedRecord[];
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getInitials = (value?: string) => {
  if (!value) return "C";
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const priorityMap: Record<
  ContextPriority,
  {
    label: string;
    className: string;
  }
> = {
  low: {
    label: "Low",
    className:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  },
  medium: {
    label: "Medium",
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300",
  },
  high: {
    label: "High",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
  },
  urgent: {
    label: "Urgent",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300",
  },
};

const SectionCard: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
};

const ContextSidebar: React.FC<ContextSidebarProps> = ({
  name,
  roleLabel = "Contact",
  avatarUrl,
  companyName,
  email,
  phone,
  location,
  statusLabel = "Active",
  priority,
  verified = false,
  sticky = true,
  className,
  quickActions,
  facts = [],
  details = [],
  tags = [],
  nextActionTitle,
  nextActionDescription,
  nextActionTime,
  highlights = [],
  relatedRecords = [],
}) => {
  const mergedDetails: ContextSidebarDetailItem[] =
    details.length > 0
      ? details
      : [
          ...(companyName
            ? [
                {
                  id: "company",
                  label: "Company",
                  value: companyName,
                  icon: <Building2 className="h-4 w-4" />,
                },
              ]
            : []),
          ...(email
            ? [
                {
                  id: "email",
                  label: "Email",
                  value: email,
                  icon: <Mail className="h-4 w-4" />,
                },
              ]
            : []),
          ...(phone
            ? [
                {
                  id: "phone",
                  label: "Phone",
                  value: phone,
                  icon: <Phone className="h-4 w-4" />,
                },
              ]
            : []),
          ...(location
            ? [
                {
                  id: "location",
                  label: "Location",
                  value: location,
                  icon: <MapPin className="h-4 w-4" />,
                },
              ]
            : []),
        ];

  return (
    <aside
      className={cn(
        "w-full space-y-4",
        sticky && "xl:sticky xl:top-4",
        className
      )}
    >
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="h-24 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />

        <div className="relative px-4 pb-4">
          <div className="-mt-10 flex items-end justify-between gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-20 w-20 rounded-3xl border-4 border-white object-cover shadow-sm dark:border-slate-950"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-slate-200 text-lg font-semibold text-slate-700 shadow-sm dark:border-slate-950 dark:bg-slate-800 dark:text-slate-200">
                {getInitials(name)}
              </div>
            )}

            <div className="mb-1 flex flex-wrap items-center justify-end gap-2">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                {statusLabel}
              </span>

              {priority ? (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium",
                    priorityMap[priority].className
                  )}
                >
                  {priorityMap[priority].label}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {name}
              </h2>

              {verified ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              ) : null}
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {roleLabel}
            </p>
          </div>

          {quickActions ? <div className="mt-4">{quickActions}</div> : null}
        </div>
      </section>

      {facts.length > 0 ? (
        <SectionCard title="Quick Facts" icon={<CircleDollarSign className="h-4.5 w-4.5" />}>
          <div className="grid grid-cols-2 gap-3">
            {facts.map((fact) => (
              <div
                key={fact.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  {fact.icon ? (
                    <div className="text-slate-500 dark:text-slate-400">
                      {fact.icon}
                    </div>
                  ) : null}
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {fact.label}
                  </p>
                </div>
                <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {mergedDetails.length > 0 ? (
        <SectionCard title="Key Details" icon={<BriefcaseBusiness className="h-4.5 w-4.5" />}>
          <div className="space-y-3">
            {mergedDetails.map((detail) => (
              <div
                key={detail.id}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mt-0.5 text-slate-500 dark:text-slate-400">
                  {detail.icon ?? <User2 className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {detail.label}
                  </p>
                  <p className="mt-1 break-words text-sm font-medium text-slate-900 dark:text-slate-100">
                    {detail.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {tags.length > 0 ? (
        <SectionCard title="Tags" icon={<Tag className="h-4.5 w-4.5" />}>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {tag.label}
              </span>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {(nextActionTitle || nextActionDescription || nextActionTime) ? (
        <SectionCard title="Next Action" icon={<CalendarClock className="h-4.5 w-4.5" />}>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            {nextActionTitle ? (
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {nextActionTitle}
              </p>
            ) : null}

            {nextActionDescription ? (
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {nextActionDescription}
              </p>
            ) : null}

            {nextActionTime ? (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-slate-900 dark:text-amber-300">
                <Clock3 className="h-3.5 w-3.5" />
                {nextActionTime}
              </div>
            ) : null}
          </div>
        </SectionCard>
      ) : null}

      {highlights.length > 0 ? (
        <SectionCard title="Highlights" icon={<CircleAlert className="h-4.5 w-4.5" />}>
          <div className="space-y-3">
            {highlights.map((item, index) => (
              <div key={item.id} className="relative flex gap-3">
                <div className="relative flex flex-col items-center">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                  {index !== highlights.length - 1 ? (
                    <span className="mt-1 h-full w-px bg-slate-200 dark:bg-slate-800" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 pb-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  {item.description ? (
                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  ) : null}
                  {item.timestamp ? (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" />
                      {item.timestamp}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {relatedRecords.length > 0 ? (
        <SectionCard title="Related Records" icon={<FileText className="h-4.5 w-4.5" />}>
          <div className="space-y-3">
            {relatedRecords.map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={record.onClick}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {record.title}
                    </p>
                    {record.subtitle ? (
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {record.subtitle}
                      </p>
                    ) : null}
                  </div>

                  {record.badge ? (
                    <span className="shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {record.badge}
                    </span>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </aside>
  );
};

export default ContextSidebar;