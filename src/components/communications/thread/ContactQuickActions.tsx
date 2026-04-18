import React from "react";
import {
  PhoneCall,
  MessageCircle,
  Mail,
  MessagesSquare,
  CalendarPlus,
  StickyNote,
  PencilLine,
  MoreHorizontal,
  ExternalLink,
  UserCheck,
} from "lucide-react";

type QuickActionVariant = "default" | "primary" | "success" | "warning" | "danger";

export interface ContactQuickActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  hidden?: boolean;
  variant?: QuickActionVariant;
  external?: boolean;
}

export interface ContactQuickActionsProps {
  contactName?: string;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  smsNumber?: string;
  canCall?: boolean;
  canWhatsapp?: boolean;
  canEmail?: boolean;
  canSms?: boolean;
  className?: string;
  compact?: boolean;
  showLabels?: boolean;
  onCall?: () => void;
  onWhatsapp?: () => void;
  onEmail?: () => void;
  onSms?: () => void;
  onScheduleFollowUp?: () => void;
  onAddNote?: () => void;
  onEditContact?: () => void;
  extraActions?: ContactQuickActionItem[];
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const normalizePhone = (value?: string) => (value ? value.replace(/[^\d+]/g, "") : "");

const buildTelLink = (phone?: string) => {
  const normalized = normalizePhone(phone);
  return normalized ? `tel:${normalized}` : undefined;
};

const buildSmsLink = (phone?: string) => {
  const normalized = normalizePhone(phone);
  return normalized ? `sms:${normalized}` : undefined;
};

const buildMailtoLink = (email?: string) => {
  return email ? `mailto:${email}` : undefined;
};

const buildWhatsappLink = (phone?: string) => {
  const normalized = normalizePhone(phone)?.replace(/^\+/, "");
  return normalized ? `https://wa.me/${normalized}` : undefined;
};

const variantStyles: Record<
  QuickActionVariant,
  {
    card: string;
    iconWrap: string;
    label: string;
  }
> = {
  default: {
    card:
      "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:hover:bg-slate-900",
    iconWrap:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    label: "text-slate-700 dark:text-slate-200",
  },
  primary: {
    card:
      "border-sky-200 bg-sky-50 hover:border-sky-300 hover:bg-sky-100 dark:border-sky-900 dark:bg-sky-950/30 dark:hover:border-sky-800 dark:hover:bg-sky-950/50",
    iconWrap:
      "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
    label: "text-sky-800 dark:text-sky-300",
  },
  success: {
    card:
      "border-emerald-200 bg-emerald-50 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/50",
    iconWrap:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    label: "text-emerald-800 dark:text-emerald-300",
  },
  warning: {
    card:
      "border-amber-200 bg-amber-50 hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/30 dark:hover:border-amber-800 dark:hover:bg-amber-950/50",
    iconWrap:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    label: "text-amber-800 dark:text-amber-300",
  },
  danger: {
    card:
      "border-rose-200 bg-rose-50 hover:border-rose-300 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/30 dark:hover:border-rose-800 dark:hover:bg-rose-950/50",
    iconWrap:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
    label: "text-rose-800 dark:text-rose-300",
  },
};

interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: QuickActionVariant;
  compact?: boolean;
  showLabels?: boolean;
  external?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  href,
  onClick,
  disabled,
  variant = "default",
  compact = false,
  showLabels = true,
  external = false,
}) => {
  const styles = variantStyles[variant];
  const baseClasses = cn(
    "group relative flex items-center gap-3 rounded-2xl border transition-all duration-200",
    compact ? "px-3 py-2.5" : "px-4 py-3.5",
    styles.card,
    disabled && "cursor-not-allowed opacity-50 hover:bg-inherit hover:border-inherit"
  );

  const content = (
    <>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl",
          compact ? "h-9 w-9" : "h-10 w-10",
          styles.iconWrap
        )}
      >
        {icon}
      </div>

      {showLabels ? (
        <div className="min-w-0 flex-1 text-left">
          <div className={cn("truncate text-sm font-semibold", styles.label)}>
            {label}
          </div>
        </div>
      ) : null}

      {external && href && !disabled ? (
        <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
      ) : null}
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={baseClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        "w-full text-left"
      )}
    >
      {content}
    </button>
  );
};

const ContactQuickActions: React.FC<ContactQuickActionsProps> = ({
  contactName,
  phone,
  whatsappNumber,
  email,
  smsNumber,
  canCall = true,
  canWhatsapp = true,
  canEmail = true,
  canSms = true,
  className,
  compact = false,
  showLabels = true,
  onCall,
  onWhatsapp,
  onEmail,
  onSms,
  onScheduleFollowUp,
  onAddNote,
  onEditContact,
  extraActions = [],
}) => {
  const telLink = buildTelLink(phone);
  const whatsappLink = buildWhatsappLink(whatsappNumber || phone);
  const emailLink = buildMailtoLink(email);
  const smsLink = buildSmsLink(smsNumber || phone);

  const primaryActions = [
    {
      id: "call",
      label: "Call",
      icon: <PhoneCall className="h-4.5 w-4.5" />,
      href: !onCall ? telLink : undefined,
      onClick: onCall,
      disabled: !canCall || (!telLink && !onCall),
      variant: "primary" as QuickActionVariant,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: <MessageCircle className="h-4.5 w-4.5" />,
      href: !onWhatsapp ? whatsappLink : undefined,
      onClick: onWhatsapp,
      disabled: !canWhatsapp || (!whatsappLink && !onWhatsapp),
      variant: "success" as QuickActionVariant,
      external: true,
    },
    {
      id: "email",
      label: "Email",
      icon: <Mail className="h-4.5 w-4.5" />,
      href: !onEmail ? emailLink : undefined,
      onClick: onEmail,
      disabled: !canEmail || (!emailLink && !onEmail),
      variant: "default" as QuickActionVariant,
    },
    {
      id: "sms",
      label: "SMS",
      icon: <MessagesSquare className="h-4.5 w-4.5" />,
      href: !onSms ? smsLink : undefined,
      onClick: onSms,
      disabled: !canSms || (!smsLink && !onSms),
      variant: "warning" as QuickActionVariant,
    },
  ];

  const secondaryActions = [
    {
      id: "followup",
      label: "Schedule Follow-up",
      icon: <CalendarPlus className="h-4.5 w-4.5" />,
      onClick: onScheduleFollowUp,
      disabled: !onScheduleFollowUp,
      variant: "default" as QuickActionVariant,
    },
    {
      id: "note",
      label: "Add Note",
      icon: <StickyNote className="h-4.5 w-4.5" />,
      onClick: onAddNote,
      disabled: !onAddNote,
      variant: "default" as QuickActionVariant,
    },
    {
      id: "edit",
      label: "Edit Contact",
      icon: <PencilLine className="h-4.5 w-4.5" />,
      onClick: onEditContact,
      disabled: !onEditContact,
      variant: "default" as QuickActionVariant,
    },
  ];

  const visibleExtraActions = extraActions.filter((item) => !item.hidden);

  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <UserCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Quick Actions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {contactName
                  ? `Fast actions for ${contactName}`
                  : "Reach and manage this contact faster"}
              </p>
            </div>
          </div>
        </div>

        {visibleExtraActions.length > 0 ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <MoreHorizontal className="h-4.5 w-4.5" />
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {primaryActions.map((action) => (
          <ActionButton
            key={action.id}
            label={action.label}
            icon={action.icon}
            href={action.href}
            onClick={action.onClick}
            disabled={action.disabled}
            variant={action.variant}
            compact={compact}
            showLabels={showLabels}
            external={"external" in action ? action.external : false}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {secondaryActions.map((action) => (
          <ActionButton
            key={action.id}
            label={action.label}
            icon={action.icon}
            onClick={action.onClick}
            disabled={action.disabled}
            variant={action.variant}
            compact={compact}
            showLabels={showLabels}
          />
        ))}
      </div>

      {visibleExtraActions.length > 0 ? (
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              More Actions
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleExtraActions.map((action) => (
              <ActionButton
                key={action.id}
                label={action.label}
                icon={action.icon ?? <MoreHorizontal className="h-4.5 w-4.5" />}
                href={action.href}
                onClick={action.onClick}
                disabled={action.disabled}
                variant={action.variant ?? "default"}
                compact={compact}
                showLabels={showLabels}
                external={action.external}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ContactQuickActions;