import React, { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

const CommunicationAnalyticsPage = lazy(
  () => import("../pages/communications/CommunicationAnalyticsPage")
);
const CommunicationTemplatesPage = lazy(
  () => import("../pages/communications/CommunicationTemplatesPage")
);
const EmailMessagesPage = lazy(
  () => import("../pages/communications/EmailMessagesPage")
);
const ScheduledMessagesPage = lazy(
  () => import("../pages/communications/ScheduledMessagesPage")
);

type CommunicationRouteMeta = {
  title: string;
  description?: string;
};

export type CommunicationAppRoute = RouteObject & {
  meta?: CommunicationRouteMeta;
  children?: CommunicationAppRoute[];
};

const CommunicationRouteLoader = () => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Loading communication workspace...
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Preparing inbox, templates, and communication insights.
          </p>
        </div>
      </div>
    </div>
  );
};

const withSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<any>>
) => {
  return (
    <Suspense fallback={<CommunicationRouteLoader />}>
      <Component />
    </Suspense>
  );
};

export const communicationRoutes: CommunicationAppRoute[] = [
  {
    path: "communications",
    children: [
      {
        index: true,
        element: <Navigate to="messages" replace />,
      },
      {
        path: "messages",
        element: withSuspense(EmailMessagesPage),
        meta: {
          title: "Email Messages",
          description: "View and manage email conversations, replies, and message threads.",
        },
      },
      {
        path: "templates",
        element: withSuspense(CommunicationTemplatesPage),
        meta: {
          title: "Communication Templates",
          description: "Create, manage, and organize reusable email and message templates.",
        },
      },
      {
        path: "scheduled",
        element: withSuspense(ScheduledMessagesPage),
        meta: {
          title: "Scheduled Messages",
          description: "Track upcoming scheduled emails and outbound communication.",
        },
      },
      {
        path: "analytics",
        element: withSuspense(CommunicationAnalyticsPage),
        meta: {
          title: "Communication Analytics",
          description: "Analyze open rates, click rates, replies, and channel performance.",
        },
      },
      {
        path: "*",
        element: <Navigate to="messages" replace />,
      },
    ],
  },
];

export default communicationRoutes;