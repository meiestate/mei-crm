import type { ReactNode } from "react";
import { getTheme } from "../theme";
import type { ThemeMode } from "../theme";

type AuthLayoutProps = {
  children: ReactNode;
  mode: ThemeMode;
  title?: string;
  subtitle?: string;
  sideTitle?: string;
  sideSubtitle?: string;
  footerText?: string;
};

export default function AuthLayout({
  children,
  mode,
  title = "Welcome back",
  subtitle = "Sign in to continue managing your business smoothly.",
  sideTitle = "MEI CRM",
  sideSubtitle = "A modern business operating system for leads, deals, tasks, contacts, and team productivity.",
  footerText = "© 2026 MEI CRM. All rights reserved.",
}: AuthLayoutProps) {
  const theme = getTheme(mode);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        background:
          mode === "dark"
            ? "linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #e0f2fe 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 32px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: 28,
            padding: 32,
            boxShadow:
              mode === "dark"
                ? "0 20px 60px rgba(0,0,0,0.45)"
                : "0 20px 60px rgba(15,23,42,0.10)",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 14px",
                borderRadius: 999,
                background:
                  mode === "dark"
                    ? "rgba(59,130,246,0.14)"
                    : "rgba(37,99,235,0.10)",
                color: theme.primary,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Secure Access
            </div>

            <h1
              style={{
                margin: "18px 0 8px",
                fontSize: 32,
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: theme.text,
              }}
            >
              {title}
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.7,
                color: theme.subText,
              }}
            >
              {subtitle}
            </p>
          </div>

          <div>{children}</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          padding: "32px",
        }}
      >
        <div
          style={{
            width: "100%",
            borderRadius: 30,
            padding: "40px 36px",
            border:
              mode === "dark"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(15,23,42,0.06)",
            background:
              mode === "dark"
                ? "linear-gradient(180deg, rgba(15,23,42,0.72) 0%, rgba(30,41,59,0.82) 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(248,250,252,0.92) 100%)",
            boxShadow:
              mode === "dark"
                ? "inset 0 1px 0 rgba(255,255,255,0.04)"
                : "inset 0 1px 0 rgba(255,255,255,0.8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: theme.primary,
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 800,
                boxShadow:
                  mode === "dark"
                    ? "0 16px 36px rgba(37,99,235,0.34)"
                    : "0 16px 36px rgba(37,99,235,0.22)",
              }}
            >
              M
            </div>

            <h2
              style={{
                margin: "24px 0 12px",
                fontSize: 34,
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: theme.text,
                maxWidth: 420,
              }}
            >
              {sideTitle}
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.8,
                color: theme.subText,
                maxWidth: 500,
              }}
            >
              {sideSubtitle}
            </p>

            <div
              style={{
                marginTop: 32,
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 16,
              }}
            >
              {[
                {
                  label: "Lead Management",
                  value: "Smart tracking and conversion flow",
                },
                {
                  label: "Task Visibility",
                  value: "Daily execution with zero confusion",
                },
                {
                  label: "Deal Pipeline",
                  value: "From inquiry to closure in one place",
                },
                {
                  label: "Team Productivity",
                  value: "Simple, sharp, scalable operations",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    border: `1px solid ${theme.border}`,
                    background:
                      mode === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(255,255,255,0.56)",
                    borderRadius: 20,
                    padding: 18,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: theme.text,
                      marginBottom: 6,
                    }}
                  >
                    {item.label}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: theme.subText,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: `1px solid ${theme.border}`,
              fontSize: 13,
              color: theme.mutedText,
            }}
          >
            {footerText}
          </div>
        </div>
      </div>
    </div>
  );
}