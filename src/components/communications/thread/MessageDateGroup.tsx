import React from "react";
import { CalendarDays } from "lucide-react";

export interface MessageDateGroupProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  count?: number;
  sticky?: boolean;
  compact?: boolean;
  showIcon?: boolean;
  muted?: boolean;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const MessageDateGroup: React.FC<MessageDateGroupProps> = ({
  label,
  children,
  className,
  count,
  sticky = false,
  compact = false,
  showIcon = true,
  muted = false,
}) => {
  return (
    <section className={cn("relative", className)}>
      <div
        className={cn(
          "z-10 flex justify-center",
          sticky && "sticky top-0"
        )}
      >
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border shadow-sm backdrop-blur",
            compact ? "mb-3 px-3 py-1 text-[11px]" : "mb-4 px-4 py-1.5 text-xs",
            muted
              ? "border-slate-200 bg-white/85 text-slate-500 dark:border-slate-800 dark:bg-slate-950/85 dark:text-slate-400"
              : "border-slate-200 bg-white/90 text-slate-700 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-200"
          )}
        >
          {showIcon ? <CalendarDays className="h-3.5 w-3.5" /> : null}
          <span className="font-medium">{label}</span>
          {typeof count === "number" ? (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                muted
                  ? "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
              )}
            >
              {count}
            </span>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "space-y-3",
          compact ? "space-y-2" : "space-y-3"
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default MessageDateGroup;