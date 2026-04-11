// src/utils/team-users/userExport.ts

import type { TeamUserRecord } from "../../constants/teamUsersConstants";

export type UserExportFormat = "csv" | "json";

export type UserExportColumn =
  | "id"
  | "employeeCode"
  | "fullName"
  | "email"
  | "phone"
  | "role"
  | "department"
  | "status"
  | "location"
  | "reportingTo"
  | "joinedOn"
  | "lastActive"
  | "timezone"
  | "assignedLeads"
  | "activeDeals"
  | "tasksDueToday"
  | "monthlyRevenue"
  | "conversionRate"
  | "notes";

export type UserExportOptions = {
  format?: UserExportFormat;
  fileName?: string;
  columns?: UserExportColumn[];
  includeHeaders?: boolean;
  prettifyDates?: boolean;
  prettifyRevenue?: boolean;
};

const DEFAULT_EXPORT_COLUMNS: UserExportColumn[] = [
  "id",
  "employeeCode",
  "fullName",
  "email",
  "phone",
  "role",
  "department",
  "status",
  "location",
  "reportingTo",
  "joinedOn",
  "lastActive",
  "timezone",
  "assignedLeads",
  "activeDeals",
  "tasksDueToday",
  "monthlyRevenue",
  "conversionRate",
  "notes",
];

const COLUMN_LABELS: Record<UserExportColumn, string> = {
  id: "ID",
  employeeCode: "Employee Code",
  fullName: "Full Name",
  email: "Email",
  phone: "Phone",
  role: "Role",
  department: "Department",
  status: "Status",
  location: "Location",
  reportingTo: "Reporting To",
  joinedOn: "Joined On",
  lastActive: "Last Active",
  timezone: "Timezone",
  assignedLeads: "Assigned Leads",
  activeDeals: "Active Deals",
  tasksDueToday: "Tasks Due Today",
  monthlyRevenue: "Monthly Revenue",
  conversionRate: "Conversion Rate (%)",
  notes: "Notes",
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function escapeCsvValue(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function getUserFieldValue(
  user: TeamUserRecord,
  column: UserExportColumn,
  options: Required<
    Pick<UserExportOptions, "prettifyDates" | "prettifyRevenue">
  >
) {
  switch (column) {
    case "id":
      return user.id;

    case "employeeCode":
      return user.employeeCode;

    case "fullName":
      return user.fullName;

    case "email":
      return user.email;

    case "phone":
      return user.phone;

    case "role":
      return user.role;

    case "department":
      return user.department;

    case "status":
      return user.status;

    case "location":
      return user.location;

    case "reportingTo":
      return user.reportingTo ?? "";

    case "joinedOn":
      return options.prettifyDates ? formatDate(user.joinedOn) : user.joinedOn;

    case "lastActive":
      return options.prettifyDates ? formatDate(user.lastActive) : user.lastActive;

    case "timezone":
      return user.timezone;

    case "assignedLeads":
      return user.assignedLeads;

    case "activeDeals":
      return user.activeDeals;

    case "tasksDueToday":
      return user.tasksDueToday;

    case "monthlyRevenue":
      return options.prettifyRevenue
        ? formatCurrency(user.monthlyRevenue)
        : user.monthlyRevenue;

    case "conversionRate":
      return user.conversionRate;

    case "notes":
      return user.notes ?? "";

    default:
      return "";
  }
}

export function buildUsersCsv(
  users: TeamUserRecord[],
  options: UserExportOptions = {}
) {
  const {
    columns = DEFAULT_EXPORT_COLUMNS,
    includeHeaders = true,
    prettifyDates = true,
    prettifyRevenue = false,
  } = options;

  const rows: string[] = [];

  if (includeHeaders) {
    rows.push(columns.map((column) => escapeCsvValue(COLUMN_LABELS[column])).join(","));
  }

  users.forEach((user) => {
    const row = columns
      .map((column) =>
        escapeCsvValue(
          getUserFieldValue(user, column, {
            prettifyDates,
            prettifyRevenue,
          })
        )
      )
      .join(",");

    rows.push(row);
  });

  return rows.join("\n");
}

export function buildUsersJson(
  users: TeamUserRecord[],
  options: UserExportOptions = {}
) {
  const {
    columns = DEFAULT_EXPORT_COLUMNS,
    prettifyDates = true,
    prettifyRevenue = false,
  } = options;

  const data = users.map((user) => {
    const row: Partial<Record<UserExportColumn, unknown>> = {};

    columns.forEach((column) => {
      row[column] = getUserFieldValue(user, column, {
        prettifyDates,
        prettifyRevenue,
      });
    });

    return row;
  });

  return JSON.stringify(data, null, 2);
}

export function getUserExportFileName(
  format: UserExportFormat = "csv",
  customName?: string
) {
  if (customName?.trim()) {
    return customName.trim().endsWith(`.${format}`)
      ? customName.trim()
      : `${customName.trim()}.${format}`;
  }

  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "-",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
  ].join("");

  return `mei-team-users-${stamp}.${format}`;
}

export function downloadTextFile(content: string, fileName: string, mimeType: string) {
  if (typeof window === "undefined") return;

  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  window.URL.revokeObjectURL(url);
}

export function exportUsers(
  users: TeamUserRecord[],
  options: UserExportOptions = {}
) {
  const format = options.format ?? "csv";
  const fileName = getUserExportFileName(format, options.fileName);

  if (format === "json") {
    const json = buildUsersJson(users, options);
    downloadTextFile(json, fileName, "application/json;charset=utf-8");
    return {
      fileName,
      format,
      content: json,
      count: users.length,
    };
  }

  const csv = buildUsersCsv(users, options);
  downloadTextFile(csv, fileName, "text/csv;charset=utf-8");
  return {
    fileName,
    format,
    content: csv,
    count: users.length,
  };
}

export function exportSelectedUsers(
  users: TeamUserRecord[],
  selectedIds: string[],
  options: UserExportOptions = {}
) {
  const selectedIdSet = new Set(selectedIds);
  const selectedUsers = users.filter((user) => selectedIdSet.has(user.id));

  return exportUsers(selectedUsers, options);
}

export function exportAllUsers(
  users: TeamUserRecord[],
  options: UserExportOptions = {}
) {
  return exportUsers(users, options);
}

export const USER_EXPORT_COLUMNS = DEFAULT_EXPORT_COLUMNS;
export const USER_EXPORT_COLUMN_LABELS = COLUMN_LABELS;