import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type NotFoundPageProps = {
  title?: string;
  description?: string;
};

const QUICK_LINKS = [
  { label: "Go to Dashboard", path: "/" },
  { label: "Open Leads", path: "/leads" },
  { label: "Open Contacts", path: "/contacts" },
  { label: "Open Deals", path: "/deals" },
  { label: "Open Tasks", path: "/tasks" },
  { label: "Open Settings", path: "/settings" },
];

export default function NotFoundPage({
  title = "Page not found",
  description = "The page you are trying to open does not exist, may have been moved, or the route is not connected yet.",
}: NotFoundPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const suggestedLinks = useMemo(() => {
    const pathname = location.pathname.toLowerCase();

    if (pathname.includes("lead")) {
      return QUICK_LINKS.filter(
        (item) => item.path === "/leads" || item.path === "/"
      );
    }

    if (pathname.includes("contact")) {
      return QUICK_LINKS.filter(
        (item) => item.path === "/contacts" || item.path === "/"
      );
    }

    if (pathname.includes("deal")) {
      return QUICK_LINKS.filter(
        (item) => item.path === "/deals" || item.path === "/"
      );
    }

    if (pathname.includes("task")) {
      return QUICK_LINKS.filter(
        (item) => item.path === "/tasks" || item.path === "/"
      );
    }

    if (pathname.includes("setting")) {
      return QUICK_LINKS.filter(
        (item) => item.path === "/settings" || item.path === "/"
      );
    }

    return QUICK_LINKS.slice(0, 4);
  }, [location.pathname]);

  return (
    <div style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <div style={styles.container}>
        <div style={styles.badge}>404 • Route Missing</div>

        <div style={styles.heroCard}>
          <div style={styles.heroLeft}>
            <div style={styles.codeWrap}>
              <span style={styles.codeDigit}>4</span>
              <span style={styles.codeDigitCenter}>0</span>
              <span style={styles.codeDigit}>4</span>
            </div>

            <h1 style={styles.title}>{title}</h1>
            <p style={styles.description}>{description}</p>

            <div style={styles.pathCard}>
              <div style={styles.pathLabel}>Requested Path</div>
              <div style={styles.pathValue}>{location.pathname || "/"}</div>
            </div>

            <div style={styles.actionRow}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={styles.secondaryButton}
              >
                ← Go Back
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                style={styles.primaryButton}
              >
                Go to Dashboard
              </button>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.illustrationCard}>
              <div style={styles.windowTop}>
                <span style={styles.windowDotRed} />
                <span style={styles.windowDotAmber} />
                <span style={styles.windowDotGreen} />
              </div>

              <div style={styles.windowBody}>
                <div style={styles.fakeLineLong} />
                <div style={styles.fakeLineMedium} />
                <div style={styles.fakeLineShort} />

                <div style={styles.errorBlock}>
                  <div style={styles.errorIcon}>!</div>
                  <div>
                    <div style={styles.errorTitle}>Route unavailable</div>
                    <div style={styles.errorText}>
                      This screen is not mapped in your current router setup.
                    </div>
                  </div>
                </div>

                <div style={styles.fakeGrid}>
                  <div style={styles.fakeTile} />
                  <div style={styles.fakeTile} />
                  <div style={styles.fakeTile} />
                  <div style={styles.fakeTile} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.bottomGrid}>
          <div style={styles.sectionCard}>
            <div style={styles.sectionTitle}>Quick Navigation</div>
            <div style={styles.linkGrid}>
              {suggestedLinks.map((item) => (
                <Link key={item.path} to={item.path} style={styles.quickLink}>
                  <span>{item.label}</span>
                  <span style={styles.quickLinkArrow}>→</span>
                </Link>
              ))}
            </div>
          </div>

          <div style={styles.sectionCard}>
            <div style={styles.sectionTitle}>Why this happens</div>
            <ul style={styles.reasonList}>
              <li>The route path is missing in <code>App.tsx</code>.</li>
              <li>The page component import path is incorrect.</li>
              <li>The URL was typed manually and does not match a valid route.</li>
              <li>The page exists but the navigation link is pointing to a wrong path.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(180deg, #020617 0%, #0F172A 45%, #111827 100%)",
    padding: "32px 20px",
    boxSizing: "border-box",
  },
  glowOne: {
    position: "absolute",
    top: -120,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.16)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  glowTwo: {
    position: "absolute",
    bottom: -140,
    right: -120,
    width: 360,
    height: 360,
    borderRadius: "50%",
    background: "rgba(168, 85, 247, 0.14)",
    filter: "blur(90px)",
    pointerEvents: "none",
  },
  container: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 1220,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  badge: {
    alignSelf: "flex-start",
    height: 34,
    padding: "0 14px",
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.6,
  },
  heroCard: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.9fr)",
    gap: 20,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 28,
    padding: 24,
    backdropFilter: "blur(18px)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.28)",
  },
  heroLeft: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  codeWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  codeDigit: {
    fontSize: 74,
    lineHeight: 1,
    fontWeight: 900,
    color: "#FFFFFF",
    textShadow: "0 10px 40px rgba(255,255,255,0.08)",
  },
  codeDigitCenter: {
    fontSize: 74,
    lineHeight: 1,
    fontWeight: 900,
    color: "#60A5FA",
    textShadow: "0 10px 40px rgba(96,165,250,0.3)",
  },
  title: {
    margin: 0,
    fontSize: 38,
    lineHeight: 1.1,
    fontWeight: 900,
    color: "#FFFFFF",
    maxWidth: 640,
  },
  description: {
    margin: "14px 0 0",
    maxWidth: 700,
    fontSize: 15,
    lineHeight: 1.7,
    color: "#CBD5E1",
  },
  pathCard: {
    marginTop: 22,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(15, 23, 42, 0.7)",
    padding: 16,
  },
  pathLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: 700,
    marginBottom: 8,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  pathValue: {
    fontSize: 15,
    color: "#E2E8F0",
    fontWeight: 800,
    wordBreak: "break-word",
  },
  actionRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 22,
  },
  primaryButton: {
    height: 46,
    padding: "0 18px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(37,99,235,0.28)",
  },
  secondaryButton: {
    height: 46,
    padding: "0 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.05)",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
  heroRight: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 24,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(15, 23, 42, 0.82)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
  },
  windowTop: {
    height: 44,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 14px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
  },
  windowDotRed: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#FB7185",
  },
  windowDotAmber: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#FBBF24",
  },
  windowDotGreen: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#4ADE80",
  },
  windowBody: {
    padding: 18,
  },
  fakeLineLong: {
    height: 12,
    width: "72%",
    borderRadius: 999,
    background: "rgba(255,255,255,0.12)",
    marginBottom: 10,
  },
  fakeLineMedium: {
    height: 10,
    width: "52%",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    marginBottom: 10,
  },
  fakeLineShort: {
    height: 10,
    width: "34%",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    marginBottom: 18,
  },
  errorBlock: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    borderRadius: 18,
    border: "1px solid rgba(251,113,133,0.24)",
    background: "rgba(225,29,72,0.08)",
    padding: 14,
    marginBottom: 18,
  },
  errorIcon: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#E11D48",
    color: "#FFFFFF",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    flexShrink: 0,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#CBD5E1",
  },
  fakeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },
  fakeTile: {
    height: 82,
    borderRadius: 16,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 20,
  },
  sectionCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 24,
    padding: 20,
    backdropFilter: "blur(14px)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  linkGrid: {
    display: "grid",
    gap: 12,
  },
  quickLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 52,
    padding: "0 16px",
    borderRadius: 16,
    textDecoration: "none",
    color: "#E2E8F0",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 14,
    fontWeight: 700,
  },
  quickLinkArrow: {
    color: "#60A5FA",
    fontWeight: 900,
  },
  reasonList: {
    margin: 0,
    paddingLeft: 18,
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 1.9,
  },
};