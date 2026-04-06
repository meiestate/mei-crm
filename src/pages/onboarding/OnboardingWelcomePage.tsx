import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type OnboardingWelcomePageProps = {
  mode: ThemeMode;
};

type CurrentUser = {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
};

type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const ONBOARDING_STORAGE_KEY = "mei_crm_onboarding_completed";

const onboardingSteps: OnboardingStep[] = [
  {
    id: "profile",
    title: "Complete Your Profile",
    description:
      "Add your personal details so your CRM workspace feels fully yours.",
    icon: "👤",
  },
  {
    id: "business",
    title: "Set Business Details",
    description:
      "Configure company name, city, and timezone for a proper sales setup.",
    icon: "🏢",
  },
  {
    id: "lead",
    title: "Add Your First Lead",
    description:
      "Create your first lead and start building a live working pipeline.",
    icon: "📈",
  },
  {
    id: "notifications",
    title: "Configure Alerts",
    description:
      "Turn on reminders and notifications so nothing slips through the cracks.",
    icon: "🔔",
  },
];

export default function OnboardingWelcomePage({
  mode,
}: OnboardingWelcomePageProps) {
  const theme = useMemo(() => getTheme(mode), [mode]);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    try {
      const rawCurrentUser = localStorage.getItem("mei_crm_current_user");
      const parsedUser = rawCurrentUser ? JSON.parse(rawCurrentUser) : null;

      if (parsedUser) {
        setCurrentUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to load current user:", error);
    }
  }, []);

  const handleGetStarted = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save onboarding state:", error);
      navigate("/dashboard");
    }
  };

  const handleSkip = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to skip onboarding:", error);
      navigate("/dashboard");
    }
  };

  const pageTitle = currentUser?.fullName
    ? `Welcome, ${currentUser.fullName}`
    : "Welcome to MEI CRM";

  const subtitle = currentUser?.company
    ? `Your workspace for ${currentUser.company} is almost ready. Let’s set up the essentials and get your sales engine moving.`
    : "Let’s set up the essentials and get your CRM workspace ready in a few quick steps.";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.background,
        color: theme.text,
        padding: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 24,
        }}
      >
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 24,
            padding: 32,
            boxShadow:
              mode === "dark"
                ? "0 18px 50px rgba(0,0,0,0.35)"
                : "0 18px 40px rgba(15, 23, 42, 0.08)",
            display: "grid",
            alignContent: "space-between",
            gap: 28,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background:
                  mode === "dark"
                    ? "rgba(37,99,235,0.16)"
                    : "rgba(37,99,235,0.10)",
                color: theme.primary,
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              <span>🚀</span>
              <span>Onboarding Ready</span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 40,
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: theme.text,
              }}
            >
              {pageTitle}
            </h1>

            <p
              style={{
                marginTop: 16,
                marginBottom: 0,
                fontSize: 16,
                lineHeight: 1.8,
                color: theme.textSecondary,
                maxWidth: 700,
              }}
            >
              {subtitle}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={handleGetStarted}
              style={{
                border: "none",
                background: theme.primary,
                color: "#ffffff",
                padding: "14px 22px",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Get Started
            </button>

            <button
              type="button"
              onClick={handleSkip}
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.card,
                color: theme.text,
                padding: "14px 22px",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Skip for Now
            </button>
          </div>
        </div>

        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 24,
            padding: 28,
            boxShadow:
              mode === "dark"
                ? "0 18px 50px rgba(0,0,0,0.35)"
                : "0 18px 40px rgba(15, 23, 42, 0.08)",
            display: "grid",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: theme.text,
                }}
              >
                Setup Checklist
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: theme.textSecondary,
                  lineHeight: 1.6,
                }}
              >
                Four simple steps. One powerful workspace.
              </div>
            </div>

            <div
              style={{
                minWidth: 58,
                height: 58,
                borderRadius: 16,
                display: "grid",
                placeItems: "center",
                background:
                  mode === "dark"
                    ? "rgba(34,197,94,0.14)"
                    : "rgba(34,197,94,0.10)",
                color: "#16a34a",
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              4/4
            </div>
          </div>

          {onboardingSteps.map((step, index) => (
            <div
              key={step.id}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr",
                gap: 14,
                padding: 16,
                borderRadius: 18,
                border: `1px solid ${theme.border}`,
                background: index === 0 ? theme.cardBgSoft : theme.card,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  display: "grid",
                  placeItems: "center",
                  background:
                    mode === "dark"
                      ? "rgba(37,99,235,0.16)"
                      : "rgba(37,99,235,0.10)",
                  fontSize: 24,
                }}
              >
                {step.icon}
              </div>

              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: theme.text,
                    marginBottom: 6,
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: theme.textSecondary,
                  }}
                >
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}