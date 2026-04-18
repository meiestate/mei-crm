// src/mocks/tasks.mock.ts

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "waiting"
  | "completed"
  | "cancelled";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskCategory =
  | "follow_up"
  | "call"
  | "meeting"
  | "site_visit"
  | "documentation"
  | "payment"
  | "internal"
  | "demo"
  | "onboarding";

export type TaskEntityType = "lead" | "deal" | "contact" | "general";

export interface TaskRelatedEntity {
  id: string;
  type: TaskEntityType;
  name: string;
  code?: string;
}

export interface TaskChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  message: string;
  createdAt: string;
  createdBy: string;
}

export interface TaskActivity {
  id: string;
  type:
    | "created"
    | "updated"
    | "status_changed"
    | "comment_added"
    | "checklist_updated"
    | "reminder_sent";
  title: string;
  description?: string;
  createdAt: string;
  createdBy: string;
}

export interface Task {
  id: string;
  taskCode: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  assignedTo: string;
  assignedUserId: string;
  dueAt: string;
  startAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  relatedEntity?: TaskRelatedEntity;
  tags: string[];
  checklist: TaskChecklistItem[];
  comments: TaskComment[];
  activities: TaskActivity[];
  reminderMinutesBefore?: number;
  isOverdue: boolean;
  isToday: boolean;
  isStarred: boolean;
}

const isSameDate = (dateString: string, baseDate: string): boolean => {
  return (
    new Date(dateString).toISOString().slice(0, 10) ===
    new Date(baseDate).toISOString().slice(0, 10)
  );
};

const TODAY_BASE = "2026-04-15T00:00:00.000Z";

export const taskStatusOptions = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Waiting", value: "waiting" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
] as const;

export const taskPriorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
] as const;

export const taskCategoryOptions = [
  { label: "Follow Up", value: "follow_up" },
  { label: "Call", value: "call" },
  { label: "Meeting", value: "meeting" },
  { label: "Site Visit", value: "site_visit" },
  { label: "Documentation", value: "documentation" },
  { label: "Payment", value: "payment" },
  { label: "Internal", value: "internal" },
  { label: "Demo", value: "demo" },
  { label: "Onboarding", value: "onboarding" },
] as const;

export const tasksMock: Task[] = [
  {
    id: "task_001",
    taskCode: "MEI-TASK-1001",
    title: "Call Vignesh R and share shortlisted projects",
    description:
      "Follow up on the website inquiry and send 2 BHK options in OMR and Medavakkam.",
    status: "todo",
    priority: "high",
    category: "follow_up",
    assignedTo: "Ravi Kumar",
    assignedUserId: "usr_001",
    dueAt: "2026-04-15T11:30:00.000Z",
    startAt: "2026-04-15T10:45:00.000Z",
    createdAt: "2026-04-15T06:05:00.000Z",
    updatedAt: "2026-04-15T06:10:00.000Z",
    relatedEntity: {
      id: "lead_001",
      type: "lead",
      name: "Vignesh R",
      code: "MEI-LEAD-1001",
    },
    tags: ["lead", "hot", "website"],
    checklist: [
      { id: "tchk_001", label: "Review lead budget", completed: true },
      { id: "tchk_002", label: "Shortlist 3 matching projects", completed: false },
      { id: "tchk_003", label: "Make follow-up call", completed: false },
    ],
    comments: [
      {
        id: "tcom_001",
        message: "Customer prefers school-friendly location.",
        createdAt: "2026-04-15T06:08:00.000Z",
        createdBy: "Ravi Kumar",
      },
    ],
    activities: [
      {
        id: "tact_001",
        type: "created",
        title: "Task created",
        description: "Created from lead follow-up workflow.",
        createdAt: "2026-04-15T06:05:00.000Z",
        createdBy: "System",
      },
    ],
    reminderMinutesBefore: 30,
    isOverdue: false,
    isToday: true,
    isStarred: true,
  },
  {
    id: "task_002",
    taskCode: "MEI-TASK-1002",
    title: "Schedule Whitefield site visit for Ananya",
    description: "Coordinate site visit slots for premium 3 BHK options.",
    status: "in_progress",
    priority: "urgent",
    category: "site_visit",
    assignedTo: "Aravind P",
    assignedUserId: "usr_003",
    dueAt: "2026-04-16T08:00:00.000Z",
    startAt: "2026-04-15T08:00:00.000Z",
    createdAt: "2026-04-15T04:28:00.000Z",
    updatedAt: "2026-04-15T08:10:00.000Z",
    relatedEntity: {
      id: "lead_002",
      type: "lead",
      name: "Ananya Shekar",
      code: "MEI-LEAD-1002",
    },
    tags: ["site-visit", "qualified", "premium"],
    checklist: [
      { id: "tchk_004", label: "Confirm customer slot", completed: true },
      { id: "tchk_005", label: "Coordinate with project sales team", completed: false },
      { id: "tchk_006", label: "Send route map", completed: false },
    ],
    comments: [],
    activities: [
      {
        id: "tact_002",
        type: "created",
        title: "Task created",
        createdAt: "2026-04-15T04:28:00.000Z",
        createdBy: "Aravind P",
      },
      {
        id: "tact_003",
        type: "status_changed",
        title: "Task moved to in progress",
        createdAt: "2026-04-15T08:10:00.000Z",
        createdBy: "Aravind P",
      },
    ],
    reminderMinutesBefore: 60,
    isOverdue: false,
    isToday: false,
    isStarred: true,
  },
  {
    id: "task_003",
    taskCode: "MEI-TASK-1003",
    title: "Send plotted investment options to Kishore Babu",
    description: "Email the top Coimbatore plotted layouts with appreciation notes.",
    status: "todo",
    priority: "medium",
    category: "documentation",
    assignedTo: "Meena S",
    assignedUserId: "usr_002",
    dueAt: "2026-04-17T09:30:00.000Z",
    createdAt: "2026-04-14T16:30:00.000Z",
    updatedAt: "2026-04-14T16:35:00.000Z",
    relatedEntity: {
      id: "lead_003",
      type: "lead",
      name: "Kishore Babu",
      code: "MEI-LEAD-1003",
    },
    tags: ["investor", "plot", "email"],
    checklist: [
      { id: "tchk_007", label: "Select 3 plots", completed: false },
      { id: "tchk_008", label: "Attach pricing sheet", completed: false },
    ],
    comments: [],
    activities: [
      {
        id: "tact_004",
        type: "created",
        title: "Task created",
        createdAt: "2026-04-14T16:30:00.000Z",
        createdBy: "Meena S",
      },
    ],
    reminderMinutesBefore: 120,
    isOverdue: false,
    isToday: false,
    isStarred: false,
  },
  {
    id: "task_004",
    taskCode: "MEI-TASK-1004",
    title: "Coordinate Sarjapur villa site visit",
    description: "Plan and confirm Harini's villa community visit.",
    status: "todo",
    priority: "high",
    category: "site_visit",
    assignedTo: "Balaji K",
    assignedUserId: "usr_004",
    dueAt: "2026-04-16T06:30:00.000Z",
    createdAt: "2026-04-14T13:22:00.000Z",
    updatedAt: "2026-04-14T13:25:00.000Z",
    relatedEntity: {
      id: "lead_004",
      type: "lead",
      name: "Harini M",
      code: "MEI-LEAD-1004",
    },
    tags: ["villa", "site-visit", "instagram"],
    checklist: [
      { id: "tchk_009", label: "Confirm transport", completed: false },
      { id: "tchk_010", label: "Share project brochure", completed: true },
    ],
    comments: [],
    activities: [
      {
        id: "tact_005",
        type: "created",
        title: "Task created",
        createdAt: "2026-04-14T13:22:00.000Z",
        createdBy: "Balaji K",
      },
    ],
    reminderMinutesBefore: 90,
    isOverdue: false,
    isToday: false,
    isStarred: false,
  },
  {
    id: "task_005",
    taskCode: "MEI-TASK-1005",
    title: "Negotiate final villa price with seller",
    description: "Run pricing discussion for Sathish Kumar luxury deal.",
    status: "waiting",
    priority: "urgent",
    category: "meeting",
    assignedTo: "Ravi Kumar",
    assignedUserId: "usr_001",
    dueAt: "2026-04-15T13:45:00.000Z",
    startAt: "2026-04-15T13:15:00.000Z",
    createdAt: "2026-04-14T12:00:00.000Z",
    updatedAt: "2026-04-15T07:20:00.000Z",
    relatedEntity: {
      id: "lead_005",
      type: "lead",
      name: "Sathish Kumar",
      code: "MEI-LEAD-1005",
    },
    tags: ["luxury", "negotiation", "seller"],
    checklist: [
      { id: "tchk_011", label: "Prepare price comparison", completed: true },
      { id: "tchk_012", label: "Align buyer expectation", completed: true },
      { id: "tchk_013", label: "Conduct negotiation", completed: false },
    ],
    comments: [
      {
        id: "tcom_002",
        message: "Seller may reduce price by 3-4% if registration is quick.",
        createdAt: "2026-04-15T07:18:00.000Z",
        createdBy: "Ravi Kumar",
      },
    ],
    activities: [
      {
        id: "tact_006",
        type: "created",
        title: "Task created",
        createdAt: "2026-04-14T12:00:00.000Z",
        createdBy: "Ravi Kumar",
      },
      {
        id: "tact_007",
        type: "updated",
        title: "Task notes updated",
        createdAt: "2026-04-15T07:20:00.000Z",
        createdBy: "Ravi Kumar",
      },
    ],
    reminderMinutesBefore: 45,
    isOverdue: false,
    isToday: true,
    isStarred: true,
  },
  {
    id: "task_006",
    taskCode: "MEI-TASK-1006",
    title: "Final re-engagement call to Divya Raj",
    description: "One final attempt before marking the lead cold.",
    status: "todo",
    priority: "low",
    category: "call",
    assignedTo: "Meena S",
    assignedUserId: "usr_002",
    dueAt: "2026-04-12T09:00:00.000Z",
    createdAt: "2026-04-10T08:35:00.000Z",
    updatedAt: "2026-04-12T09:00:00.000Z",
    relatedEntity: {
      id: "lead_006",
      type: "lead",
      name: "Divya Raj",
      code: "MEI-LEAD-1006",
    },
    tags: ["cold", "rental", "overdue"],
    checklist: [
      { id: "tchk_014", label: "Call lead", completed: false },
    ],
    comments: [],
    activities: [
      {
        id: "tact_008",
        type: "created",
        title: "Task created",
        createdAt: "2026-04-10T08:35:00.000Z",
        createdBy: "Meena S",
      },
      {
        id: "tact_009",
        type: "reminder_sent",
        title: "Reminder sent",
        description: "Overdue reminder sent to assignee.",
        createdAt: "2026-04-12T09:00:00.000Z",
        createdBy: "System",
      },
    ],
    reminderMinutesBefore: 15,
    isOverdue: true,
    isToday: false,
    isStarred: false,
  },
  {
    id: "task_007",
    taskCode: "MEI-TASK-1007",
    title: "Send property management agreement to Karthik",
    description: "Email service agreement and onboarding details.",
    status: "todo",
    priority: "medium",
    category: "documentation",
    assignedTo: "Balaji K",
    assignedUserId: "usr_004",
    dueAt: "2026-04-16T10:30:00.000Z",
    createdAt: "2026-04-13T14:20:00.000Z",
    updatedAt: "2026-04-13T14:22:00.000Z",
    relatedEntity: {
      id: "lead_007",
      type: "lead",
      name: "Karthik Subramanian",
      code: "MEI-LEAD-1007",
    },
    tags: ["owner", "agreement", "property-management"],
    checklist: [
      { id: "tchk_015", label: "Attach service overview", completed: true },
      { id: "tchk_016", label: "Attach agreement PDF", completed: false },
      { id: "tchk_017", label: "Send email", completed: false },
    ],
    comments: [],
    activities: [
      {
        id: "tact_010",
        type: "created",
        title: "Task created",
        createdAt: "2026-04-13T14:20:00.000Z",
        createdBy: "Balaji K",
      },
    ],
    reminderMinutesBefore: 60,
    isOverdue: false,
    isToday: false,
    isStarred: true,
  },
  {
    id: "task_008",
    taskCode: "MEI-TASK-1008",
    title: "Post-sale referral ask from Rahul Shetty",
    description: "Follow up after booking and ask for 2 investor referrals.",
    status: "todo",
    priority: "medium",
    category: "follow_up",
    assignedTo: "Aravind P",
    assignedUserId: "usr_003",
    dueAt: "2026-04-25T09:00:00.000Z",
    createdAt: "2026-04-12T10:10:00.000Z",
    updatedAt: "2026-04-12T10:15:00.000Z",
    relatedEntity: {
      id: "lead_008",
      type: "lead",
      name: "Rahul Shetty",
      code: "MEI-LEAD-1008",
    },
    tags: ["won", "referral", "investor"],
    checklist: [
      { id: "tchk_018", label: "Prepare thank-you note", completed: false },
      { id: "tchk_019", label: "Ask for referrals", completed: false },
    ],
    comments: [],
    activities: [
      {
        id: "tact_011",
        type: "created",
        title: "Task created",
        createdAt: "2026-04-12T10:10:00.000Z",
        createdBy: "Aravind P",
      },
    ],
    reminderMinutesBefore: 120,
    isOverdue: false,
    isToday: false,
    isStarred: false,
  },
  {
    id: "task_009",
    taskCode: "MEI-TASK-1009",
    title: "Prepare dashboard performance review notes",
    description: "Compile weekly KPI and pipeline summary for internal review.",
    status: "completed",
    priority: "medium",
    category: "internal",
    assignedTo: "Ravi Kumar",
    assignedUserId: "usr_001",
    dueAt: "2026-04-14T16:00:00.000Z",
    completedAt: "2026-04-14T15:20:00.000Z",
    createdAt: "2026-04-13T18:00:00.000Z",
    updatedAt: "2026-04-14T15:20:00.000Z",
    tags: ["internal", "weekly-review"],
    checklist: [
      { id: "tchk_020", label: "Export KPI stats", completed: true },
      { id: "tchk_021", label: "Summarize team blockers", completed: true },
    ],
    comments: [
      {
        id: "tcom_003",
        message: "Completed and shared in leadership group.",
        createdAt: "2026-04-14T15:20:00.000Z",
        createdBy: "Ravi Kumar",
      },
    ],
    activities: [
      {
        id: "tact_012",
        type: "created",
        title: "Task created",
        createdAt: "2026-04-13T18:00:00.000Z",
        createdBy: "Ravi Kumar",
      },
      {
        id: "tact_013",
        type: "status_changed",
        title: "Task marked completed",
        createdAt: "2026-04-14T15:20:00.000Z",
        createdBy: "Ravi Kumar",
      },
    ],
    reminderMinutesBefore: 30,
    isOverdue: false,
    isToday: false,
    isStarred: false,
  },
  {
    id: "task_010",
    taskCode: "MEI-TASK-1010",
    title: "Collect builder inventory sheet for OMR launch",
    description: "Need final unit list and pricing from builder partner.",
    status: "waiting",
    priority: "high",
    category: "documentation",
    assignedTo: "Balaji K",
    assignedUserId: "usr_004",
    dueAt: "2026-04-15T14:00:00.000Z",
    createdAt: "2026-04-14T17:30:00.000Z",
    updatedAt: "2026-04-15T06:50:00.000Z",
    relatedEntity: {
      id: "deal_007",
      type: "deal",
      name: "Lakshmi Prasad - OMR Builder Partnership Deal",
      code: "MEI-DEAL-1007",
    },
    tags: ["builder", "inventory", "launch"],
    checklist: [
      { id: "tchk_022", label: "Request latest price sheet", completed: true },
      { id: "tchk_023", label: "Collect floor plan pack", completed: false },
    ],
    comments: [
      {
        id: "tcom_004",
        message: "Builder team said they will share after noon.",
        createdAt: "2026-04-15T06:48:00.000Z",
        createdBy: "Balaji K",
      },
    ],
    activities: [
      {
        id: "tact_014",
        type: "created",
        title: "Task created",
        createdAt: "2026-04-14T17:30:00.000Z",
        createdBy: "Balaji K",
      },
      {
        id: "tact_015",
        type: "comment_added",
        title: "Comment added",
        createdAt: "2026-04-15T06:48:00.000Z",
        createdBy: "Balaji K",
      },
    ],
    reminderMinutesBefore: 20,
    isOverdue: false,
    isToday: true,
    isStarred: true,
  },
  {
    id: "task_011",
    taskCode: "MEI-TASK-1011",
    title: "Verify agreement draft for Velachery PM mandate",
    description: "Legal cross-check before sending final copy.",
    status: "in_progress",
    priority: "high",
    category: "documentation",
    assignedTo: "Meena S",
    assignedUserId: "usr_002",
    dueAt: "2026-04-18T09:00:00.000Z",
    createdAt: "2026-04-11T14:15:00.000Z",
    updatedAt: "2026-04-15T09:00:00.000Z",
    relatedEntity: {
      id: "deal_005",
      type: "deal",
      name: "Karthik Subramanian - Property Management Mandate",
      code: "MEI-DEAL-1005",
    },
    tags: ["agreement", "legal", "owner"],
    checklist: [
      { id: "tchk_024", label: "Review agreement clauses", completed: true },
      { id: "tchk_025", label: "Check pricing schedule", completed: false },
      { id: "tchk_026", label: "Send final version", completed: false },
    ],
    comments: [],
    activities: [
      {
        id: "tact_016",
        type: "created",
        title: "Task created",
        createdAt: "2026-04-11T14:15:00.000Z",
        createdBy: "Meena S",
      },
      {
        id: "tact_017",
        type: "status_changed",
        title: "Task moved to in progress",
        createdAt: "2026-04-15T09:00:00.000Z",
        createdBy: "Meena S",
      },
    ],
    reminderMinutesBefore: 60,
    isOverdue: false,
    isToday: false,
    isStarred: false,
  },
  {
    id: "task_012",
    taskCode: "MEI-TASK-1012",
    title: "Demo MEI CRM flow to channel partner",
    description: "Show how lead capture and follow-up tracking works.",
    status: "cancelled",
    priority: "low",
    category: "demo",
    assignedTo: "Aravind P",
    assignedUserId: "usr_003",
    dueAt: "2026-04-13T12:30:00.000Z",
    createdAt: "2026-04-12T17:20:00.000Z",
    updatedAt: "2026-04-13T11:00:00.000Z",
    relatedEntity: {
      id: "cnt_010",
      type: "contact",
      name: "Channel Partner Demo",
      code: "CNT-010",
    },
    tags: ["demo", "partner"],
    checklist: [
      { id: "tchk_027", label: "Prepare walkthrough", completed: false },
    ],
    comments: [
      {
        id: "tcom_005",
        message: "Cancelled because partner requested reschedule next week.",
        createdAt: "2026-04-13T11:00:00.000Z",
        createdBy: "Aravind P",
      },
    ],
    activities: [
      {
        id: "tact_018",
        type: "created",
        title: "Task created",
        createdAt: "2026-04-12T17:20:00.000Z",
        createdBy: "Aravind P",
      },
      {
        id: "tact_019",
        type: "status_changed",
        title: "Task cancelled",
        createdAt: "2026-04-13T11:00:00.000Z",
        createdBy: "Aravind P",
      },
    ],
    reminderMinutesBefore: 30,
    isOverdue: false,
    isToday: false,
    isStarred: false,
  },
];

export const taskStatsMock = {
  totalTasks: tasksMock.length,
  todoTasks: tasksMock.filter((task) => task.status === "todo").length,
  inProgressTasks: tasksMock.filter((task) => task.status === "in_progress").length,
  waitingTasks: tasksMock.filter((task) => task.status === "waiting").length,
  completedTasks: tasksMock.filter((task) => task.status === "completed").length,
  cancelledTasks: tasksMock.filter((task) => task.status === "cancelled").length,
  overdueTasks: tasksMock.filter((task) => task.isOverdue).length,
  todayTasks: tasksMock.filter((task) => task.isToday).length,
  starredTasks: tasksMock.filter((task) => task.isStarred).length,
  completionRate:
    tasksMock.length > 0
      ? Math.round(
          (tasksMock.filter((task) => task.status === "completed").length /
            tasksMock.length) *
            100,
        )
      : 0,
};

export const todayTasksMock = tasksMock.filter((task) => task.isToday);

export const overdueTasksMock = tasksMock.filter((task) => task.isOverdue);

export const starredTasksMock = tasksMock.filter((task) => task.isStarred);

export const upcomingTasksMock = tasksMock
  .filter((task) => new Date(task.dueAt).getTime() > new Date(TODAY_BASE).getTime())
  .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

export const recentTasksMock = [...tasksMock]
  .sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
  .slice(0, 6);

export const taskStatusCountMock = taskStatusOptions.map((status) => ({
  status: status.value,
  label: status.label,
  count: tasksMock.filter((task) => task.status === status.value).length,
}));

export const taskCategoryCountMock = taskCategoryOptions.map((category) => ({
  category: category.value,
  label: category.label,
  count: tasksMock.filter((task) => task.category === category.value).length,
}));

export const tasksGroupedByStatusMock: Record<TaskStatus, Task[]> = {
  todo: tasksMock.filter((task) => task.status === "todo"),
  in_progress: tasksMock.filter((task) => task.status === "in_progress"),
  waiting: tasksMock.filter((task) => task.status === "waiting"),
  completed: tasksMock.filter((task) => task.status === "completed"),
  cancelled: tasksMock.filter((task) => task.status === "cancelled"),
};

export const getTaskById = (taskId: string): Task | undefined => {
  return tasksMock.find((task) => task.id === taskId);
};

export const getTasksByAssignedUser = (userId: string): Task[] => {
  return tasksMock.filter((task) => task.assignedUserId === userId);
};

export const getTasksByStatus = (status: TaskStatus): Task[] => {
  return tasksMock.filter((task) => task.status === status);
};

export const getTasksDueToday = (): Task[] => {
  return tasksMock.filter((task) => isSameDate(task.dueAt, TODAY_BASE));
};

export const searchTasksMock = (search: string): Task[] => {
  const query = search.trim().toLowerCase();

  if (!query) {
    return tasksMock;
  }

  return tasksMock.filter((task) =>
    [
      task.title,
      task.description,
      task.taskCode,
      task.assignedTo,
      task.status,
      task.priority,
      task.category,
      task.relatedEntity?.name,
      task.relatedEntity?.code,
      ...task.tags,
      ...task.checklist.map((item) => item.label),
      ...task.comments.map((comment) => comment.message),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query)),
  );
};

export default tasksMock;