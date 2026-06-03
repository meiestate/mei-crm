import { useNavigate } from "react-router-dom";

type ChecklistItem = {
  icon: string;
  title: string;
  description: string;
  path: string;
};

const checklistItems: ChecklistItem[] = [
  {
    icon: "👤",
    title: "Complete Your Profile",
    description: "Add your personal details so your CRM workspace feels fully yours.",
    path: "/settings/profile",
  },
  {
    icon: "🏢",
    title: "Set Business Details",
    description: "Configure company name, city, and timezone for a proper sales setup.",
    path: "/settings/company",
  },
  {
    icon: "📈",
    title: "Add Your First Lead",
    description: "Create your first lead and start building a live working pipeline.",
    path: "/leads/add",
  },
  {
    icon: "🔔",
    title: "Configure Alerts",
    description: "Turn on reminders and notifications so nothing slips through the cracks.",
    path: "/settings/notifications",
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#FFFFFF",
        padding: "64px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "1120px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "28px",
        }}
      >
        <div
          style={{
            background: "#111827",
            border: "1px solid #334155",
            borderRadius: "24px",
            padding: "40px",
            minHeight: "620px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "999px",
                background: "#172554",
                color: "#3B82F6",
                fontWeight: 800,
                marginBottom: "28px",
              }}
            >
              🚀 Onboarding Ready
            </div>

            <h1
              style={{
                fontSize: "44px",
                lineHeight: "1.1",
                fontWeight: 900,
                margin: "0 0 24px",
              }}
            >
              Welcome, john paul
            </h1>

            <p
              style={{
                fontSize: "20px",
                lineHeight: "1.8",
                color: "#93C5FD",
                maxWidth: "620px",
              }}
            >
              Your workspace for MEI is almost ready. Let’s set up the essentials
              and get your sales engine moving.
            </p>
          </div>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => navigate("/leads/add")}
              style={{
                border: "none",
                borderRadius: "14px",
                padding: "16px 28px",
                background: "#2563EB",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Get Started
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={{
                border: "1px solid #334155",
                borderRadius: "14px",
                padding: "16px 28px",
                background: "transparent",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Skip for Now
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid #334155",
            borderRadius: "24px",
            padding: "36px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              alignItems: "flex-start",
              marginBottom: "28px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  margin: "0 0 8px",
                }}
              >
                Setup Checklist
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#93C5FD",
                  fontSize: "18px",
                }}
              >
                Four simple steps. One powerful workspace.
              </p>
            </div>

            <div
              style={{
                background: "#064E3B",
                color: "#22C55E",
                padding: "20px",
                borderRadius: "18px",
                fontSize: "22px",
                fontWeight: 900,
              }}
            >
              4/4
            </div>
          </div>

          <div style={{ display: "grid", gap: "18px" }}>
            {checklistItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(item.path)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  display: "grid",
                  gridTemplateColumns: "70px 1fr",
                  gap: "18px",
                  alignItems: "center",
                  padding: "20px",
                  borderRadius: "18px",
                  border: "1px solid #334155",
                  background: "#0F172A",
                  color: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "16px",
                    background: "#172554",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "24px",
                  }}
                >
                  {item.icon}
                </span>

                <span>
                  <strong
                    style={{
                      display: "block",
                      fontSize: "20px",
                      marginBottom: "8px",
                    }}
                  >
                    {item.title}
                  </strong>

                  <span
                    style={{
                      color: "#93C5FD",
                      lineHeight: "1.6",
                      fontSize: "16px",
                    }}
                  >
                    {item.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}