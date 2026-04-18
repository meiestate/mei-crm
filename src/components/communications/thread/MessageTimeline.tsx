import React from "react";
import MessageDateGroup from "./MessageDateGroup";
import ChatMessageBubble from "./ChatMessageBubble";
import EmailMessageCard, { type EmailMessageCardProps } from "./EmailMessageCard";
import InternalNoteCard, { type InternalNoteCardProps } from "./InternalNoteCard";
import ActivityEventRow from "./ActivityEventRow";

export type TimelineItemType = "chat" | "email" | "note" | "activity";

export interface TimelineChatItem {
  id: string | number;
  type: "chat";
  props: React.ComponentProps<typeof ChatMessageBubble>;
}

export interface TimelineEmailItem {
  id: string | number;
  type: "email";
  props: EmailMessageCardProps;
}

export interface TimelineNoteItem {
  id: string | number;
  type: "note";
  props: InternalNoteCardProps;
}

export interface TimelineActivityItem {
  id: string | number;
  type: "activity";
  props: React.ComponentProps<typeof ActivityEventRow>;
}

export type TimelineItem =
  | TimelineChatItem
  | TimelineEmailItem
  | TimelineNoteItem
  | TimelineActivityItem;

export interface TimelineGroup {
  id: string | number;
  label: string;
  items: TimelineItem[];
}

export interface MessageTimelineProps {
  groups: TimelineGroup[];
  className?: string;
  compact?: boolean;
  stickyGroupHeaders?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  renderEmptyIcon?: React.ReactNode;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const EmptyTimelineState: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
}> = ({ title, description, icon }) => {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 dark:border-slate-700 dark:bg-slate-950/50">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {icon ?? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h8M8 14h5m-7 6h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
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

const renderTimelineItem = (item: TimelineItem, compact?: boolean) => {
  switch (item.type) {
    case "chat":
      return (
        <ChatMessageBubble
          key={item.id}
          {...item.props}
        />
      );

    case "email":
      return (
        <EmailMessageCard
          key={item.id}
          {...item.props}
          compact={item.props.compact ?? compact}
        />
      );

    case "note":
      return (
        <InternalNoteCard
          key={item.id}
          {...item.props}
          compact={item.props.compact ?? compact}
        />
      );

    case "activity":
      return (
        <ActivityEventRow
          key={item.id}
          {...item.props}
        />
      );

    default:
      return null;
  }
};

const MessageTimeline: React.FC<MessageTimelineProps> = ({
  groups,
  className,
  compact = false,
  stickyGroupHeaders = true,
  emptyTitle = "No messages yet",
  emptyDescription = "This conversation timeline is empty right now. Once messages, notes, or activity events appear, they’ll show up here.",
  renderEmptyIcon,
}) => {
  if (!groups.length) {
    return (
      <div className={className}>
        <EmptyTimelineState
          title={emptyTitle}
          description={emptyDescription}
          icon={renderEmptyIcon}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {groups.map((group) => (
        <MessageDateGroup
          key={group.id}
          label={group.label}
          count={group.items.length}
          sticky={stickyGroupHeaders}
          compact={compact}
        >
          {group.items.map((item) => renderTimelineItem(item, compact))}
        </MessageDateGroup>
      ))}
    </div>
  );
};

export default MessageTimeline;