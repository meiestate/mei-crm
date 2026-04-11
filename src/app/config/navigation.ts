// src/app/config/navigation.ts

import { APP_ROUTES } from "./constants";

export type NavigationItem = {
  key: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  hidden?: boolean;
  disabled?: boolean;
};

export type BreadcrumbItem = {
  label: string;
  path?: string;
};

export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: APP_ROUTES.dashboard,
    icon: "layout-dashboard",
  },
  {
    key: "leads",
    label: "Leads",
    path: APP_ROUTES.leads,
    icon: "users-round",
  },
  {
    key: "contacts",
    label: "Contacts",
    path: APP_ROUTES.contacts,
    icon: "contact-round",
  },
  {
    key: "deals",
    label: "Deals",
    path: APP_ROUTES.deals,
    icon: "badge-indian-rupee",
  },
  {
    key: "tasks",
    label: "Tasks",
    path: APP_ROUTES.tasks,
    icon: "check-square",
  },
  {
    key: "calls",
    label: "Call Logs",
    path: APP_ROUTES.calls,
    icon: "phone-call",
  },
];

export const SETTINGS_NAVIGATION: NavigationItem[] = [
  {
    key: "settings",
    label: "Settings",
    path: APP_ROUTES.settings,
    icon: "settings",
  },
  {
    key: "team-users",
    label: "Team Users",
    path: APP_ROUTES.teamUsers,
    icon: "users",
  },
  {
    key: "roles",
    label: "Roles & Permissions",
    path: APP_ROUTES.roles,
    icon: "shield-check",
  },
  {
    key: "billing",
    label: "Billing & Subscription",
    path: APP_ROUTES.billing,
    icon: "credit-card",
  },
];

export const SUPPORT_NAVIGATION: NavigationItem[] = [
  {
    key: "help-support",
    label: "Help & Support",
    path: APP_ROUTES.helpSupport,
    icon: "life-buoy",
  },
];

export const ALL_NAVIGATION: NavigationItem[] = [
  ...MAIN_NAVIGATION,
  ...SETTINGS_NAVIGATION,
  ...SUPPORT_NAVIGATION,
];

export const AUTH_NAVIGATION: NavigationItem[] = [
  {
    key: "login",
    label: "Login",
    path: APP_ROUTES.login,
  },
  {
    key: "signup",
    label: "Sign Up",
    path: APP_ROUTES.signup,
  },
  {
    key: "forgot-password",
    label: "Forgot Password",
    path: APP_ROUTES.forgotPassword,
  },
  {
    key: "reset-password",
    label: "Reset Password",
    path: APP_ROUTES.resetPassword,
  },
  {
    key: "onboarding",
    label: "Onboarding",
    path: APP_ROUTES.onboarding,
  },
];

export function getAllNavigationItems(): NavigationItem[] {
  return [...ALL_NAVIGATION];
}

export function getMainNavigationItems(): NavigationItem[] {
  return [...MAIN_NAVIGATION];
}

export function getSettingsNavigationItems(): NavigationItem[] {
  return [...SETTINGS_NAVIGATION];
}

export function getSupportNavigationItems(): NavigationItem[] {
  return [...SUPPORT_NAVIGATION];
}

export function findNavigationItemByPath(
  path: string
): NavigationItem | null {
  const normalizedPath = normalizePath(path);

  for (const item of ALL_NAVIGATION) {
    if (normalizePath(item.path) === normalizedPath) {
      return item;
    }

    if (item.children?.length) {
      const match = item.children.find(
        (child) => normalizePath(child.path) === normalizedPath
      );

      if (match) {
        return match;
      }
    }
  }

  return null;
}

export function findNavigationItemByKey(
  key: string
): NavigationItem | null {
  const normalizedKey = key.trim().toLowerCase();

  for (const item of ALL_NAVIGATION) {
    if (item.key.toLowerCase() === normalizedKey) {
      return item;
    }

    if (item.children?.length) {
      const match = item.children.find(
        (child) => child.key.toLowerCase() === normalizedKey
      );

      if (match) {
        return match;
      }
    }
  }

  return null;
}

export function isRouteActive(
  currentPath: string,
  targetPath: string,
  exact = false
): boolean {
  const normalizedCurrentPath = normalizePath(currentPath);
  const normalizedTargetPath = normalizePath(targetPath);

  if (exact) {
    return normalizedCurrentPath === normalizedTargetPath;
  }

  if (normalizedTargetPath === "/") {
    return normalizedCurrentPath === "/";
  }

  return (
    normalizedCurrentPath === normalizedTargetPath ||
    normalizedCurrentPath.startsWith(`${normalizedTargetPath}/`)
  );
}

export function normalizePath(path: string): string {
  const trimmed = path.trim();

  if (!trimmed) {
    return "/";
  }

  const withoutQuery = trimmed.split("?")[0]?.split("#")[0] ?? "/";
  const normalized = withoutQuery.replace(/\/+$/, "");

  return normalized || "/";
}

export function getRouteLabel(path: string): string {
  const navigationItem = findNavigationItemByPath(path);

  if (navigationItem) {
    return navigationItem.label;
  }

  const normalizedPath = normalizePath(path);

  switch (normalizedPath) {
    case APP_ROUTES.root:
      return "Home";
    case APP_ROUTES.dashboard:
      return "Dashboard";
    case APP_ROUTES.login:
      return "Login";
    case APP_ROUTES.signup:
      return "Sign Up";
    case APP_ROUTES.forgotPassword:
      return "Forgot Password";
    case APP_ROUTES.resetPassword:
      return "Reset Password";
    case APP_ROUTES.onboarding:
      return "Onboarding";
    case APP_ROUTES.leadsCalendar:
      return "Leads Calendar";
    default:
      return toTitleCaseFromPath(normalizedPath);
  }
}

export function buildBreadcrumbs(path: string): BreadcrumbItem[] {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === APP_ROUTES.root) {
    return [{ label: "Home", path: APP_ROUTES.root }];
  }

  const segments = normalizedPath.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", path: APP_ROUTES.dashboard },
  ];

  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    breadcrumbs.push({
      label: getRouteLabel(currentPath),
      path: isLast ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}

export function toTitleCaseFromPath(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .pop()
    ?.split("-")
    .map((part) =>
      part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : ""
    )
    .join(" ") || "Page";
}

export function getDefaultRedirectRoute(): string {
  return APP_ROUTES.dashboard;
}

export function getPostLoginRoute(): string {
  return APP_ROUTES.dashboard;
}

export function getPostLogoutRoute(): string {
  return APP_ROUTES.login;
}