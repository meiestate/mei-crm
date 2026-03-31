import { Routes, Route, NavLink } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LeadsPage from "./pages/LeadsPage";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #020617 0%, #071330 55%, #06101f 100%)",
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside
          style={{
            width: "260px",
            background: "rgba(6, 18, 42, 0.96)",
            borderRight: "1px solid rgba(96, 165, 250, 0.12)",
            padding: "24px 18px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ marginBottom: "28px" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 900,
                letterSpacing: "0.5px",
              }}
            >
              MEI
            </div>
            <div
              style={{
                color: "#9fb1d1",
                marginTop: "6px",
                fontSize: "15px",
              }}
            >
              Business OS
            </div>
          </div>

          <nav style={{ display: "grid", gap: "12px" }}>
            <SideLink to="/dashboard" label="Dashboard" />
            <SideLink to="/leads" label="Leads" />
          </nav>

          <div
            style={{
              marginTop: "auto",
              paddingTop: "28px",
            }}
          >
            <div
              style={{
                marginTop: "420px",
                border: "1px solid rgba(96,165,250,0.14)",
                borderRadius: "18px",
                padding: "16px",
                background: "rgba(8,22,50,0.7)",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "8px" }}>Workspace</div>
              <div style={{ color: "#9fb1d1", fontSize: "14px" }}>MEI CRM Core</div>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads" element={<LeadsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function SideLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "block",
        padding: "15px 16px",
        borderRadius: "16px",
        textDecoration: "none",
        color: "white",
        fontWeight: 600,
        background: isActive ? "rgba(59,130,246,0.18)" : "transparent",
        border: "1px solid rgba(96,165,250,0.10)",
      })}
    >
      {label}
    </NavLink>
  );
}

export default App;