import type { ReactNode } from "react";
import { getTheme, type ThemeMode } from "../../theme";

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
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 48px",
          color: mode === "dark" ? "#e2e8f0" : "#0f172a",
          borderRight:
            mode === "dark"
              ? "1px solid rgba(148, 163, 184, 0.12)"
              : "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderRadius: 999,
              background:
                mode === "dark"
                  ? "rgba(59, 130, 246, 0.14)"
                  : "rgba(37, 99, 235, 0.10)",
              color: mode === "dark" ? "#93c5fd" : "#1d4ed8",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.3,
              marginBottom: 28,
            }}
          >
            Business Operating System
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(36px, 5vw, 56px)",
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              maxWidth: 620,
            }}
          >
            {sideTitle}
          </h1>

          <p
            style={{
              marginTop: 20,
              maxWidth: 640,
              fontSize: 18,
              lineHeight: 1.75,
              color: mode === "dark" ? "#94a3b8" : "#475569",
            }}
          >
            {sideSubtitle}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 18,
              marginTop: 40,
              maxWidth: 700,
            }}
          >
            {[
              {
                title: "Lead Tracking",
                text: "Track every enquiry from first touch to final conversion without confusion.",
              },
              {
                title: "Deal Visibility",
                text: "Monitor pipeline movement, negotiation stages, and revenue opportunities clearly.",
              },
              {
                title: "Team Productivity",
                text: "Keep your team aligned with tasks, permissions, and centralized workflows.",
              },
              {
                title: "Smart Operations",
                text: "Run contacts, follow-ups, and settings from one clean business dashboard.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: 20,
                  borderRadius: 20,
                  background:
                    mode === "dark"
                      ? "rgba(15, 23, 42, 0.52)"
                      : "rgba(255, 255, 255, 0.82)",
                  border:
                    mode === "dark"
                      ? "1px solid rgba(148, 163, 184, 0.14)"
                      : "1px solid rgba(15, 23, 42, 0.08)",
                  boxShadow:
                    mode === "dark"
                      ? "0 12px 30px rgba(0,0,0,0.22)"
                      : "0 12px 30px rgba(15,23,42,0.08)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 8,
                    color: mode === "dark" ? "#f8fafc" : "#0f172a",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: mode === "dark" ? "#94a3b8" : "#475569",
                  }}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 13,
            color: mode === "dark" ? "#64748b" : "#64748b",
          }}
        >
          {footerText}
        </div>
      </section>

      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 28px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: 28,
            boxShadow:
              mode === "dark"
                ? "0 20px 60px rgba(0,0,0,0.38)"
                : "0 20px 60px rgba(15,23,42,0.12)",
            padding: 32,
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 30,
                lineHeight: 1.2,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              {title}
            </h2>
            <p
              style={{
                margin: "10px 0 0",
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
      </section>
    </div>
  );
}