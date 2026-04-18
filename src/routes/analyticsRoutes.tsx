import React, { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

const AnalyticsDashboardPage = lazy(
  () => import("../pages/analytics/AnalyticsDashboardPage")
);
const ForecastAnalyticsPage = lazy(
  () => import("../pages/analytics/ForecastAnalyticsPage")
);
const LeadAnalyticsPage = lazy(
  () => import("../pages/analytics/LeadAnalyticsPage")
);
const MarketingAnalyticsPage = lazy(
  () => import("../pages/analytics/MarketingAnalyticsPage")
);
const PipelineAnalyticsPage = lazy(
  () => import("../pages/analytics/PipelineAnalyticsPage")
);
const RevenueAnalyticsPage = lazy(
  () => import("../pages/analytics/RevenueAnalyticsPage")
);
const TeamPerformanceAnalyticsPage = lazy(
  () => import("../pages/analytics/TeamPerformanceAnalyticsPage")
);

type AnalyticsRouteMeta = {
  title: string;
  description?: string;
};

export type AnalyticsAppRoute = RouteObject & {
  meta?: AnalyticsRouteMeta;
  children?: AnalyticsAppRoute[];
};

const AnalyticsRouteLoader = () => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Loading analytics workspace...
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Preparing dashboards, charts, and insights.
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
    <Suspense fallback={<AnalyticsRouteLoader />}>
      <Component />
    </Suspense>
  );
};

export const analyticsRoutes: AnalyticsAppRoute[] = [
  {
    path: "analytics",
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: withSuspense(AnalyticsDashboardPage),
        meta: {
          title: "Analytics Dashboard",
          description: "Overall analytics summary and business KPI overview.",
        },
      },
      {
        path: "forecast",
        element: withSuspense(ForecastAnalyticsPage),
        meta: {
          title: "Forecast Analytics",
          description: "Forecast trends, targets, and projected business outcomes.",
        },
      },
      {
        path: "leads",
        element: withSuspense(LeadAnalyticsPage),
        meta: {
          title: "Lead Analytics",
          description: "Lead generation, source quality, and conversion insights.",
        },
      },
      {
        path: "marketing",
        element: withSuspense(MarketingAnalyticsPage),
        meta: {
          title: "Marketing Analytics",
          description: "Campaign performance, CPL, ROI, and attribution metrics.",
        },
      },
      {
        path: "pipeline",
        element: withSuspense(PipelineAnalyticsPage),
        meta: {
          title: "Pipeline Analytics",
          description: "Pipeline stage flow, stuck deals, and stage-wise performance.",
        },
      },
      {
        path: "revenue",
        element: withSuspense(RevenueAnalyticsPage),
        meta: {
          title: "Revenue Analytics",
          description: "Revenue growth, trends, project-wise performance, and targets.",
        },
      },
      {
        path: "team-performance",
        element: withSuspense(TeamPerformanceAnalyticsPage),
        meta: {
          title: "Team Performance Analytics",
          description: "Sales team productivity, leaderboard, and achievement analysis.",
        },
      },
      {
        path: "*",
        element: <Navigate to="dashboard" replace />,
      },
    ],
  },
];

export default analyticsRoutes;