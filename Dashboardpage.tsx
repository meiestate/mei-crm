import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Lead = {
  id: string;
  name: string;
  phone: string;
  location: string;
  source: string;
  owner: string;
  status: string;
  dealValue: number | string;
  followUp: string;
  createdAt: string;
  propertyType?: string;
  areaValue?: string;
  areaUnit?: string;
  facing?: string;
  bhk?: string;
};

const STORAGE_KEY = "mei_leads_v1";

function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLeads = () => {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        setLeads([]);
        return;
      }

      try {
        const parsed = JSON.parse(saved);
        setLeads(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Failed to load leads:", error);
        setLeads([]);
      }
    };

    loadLeads();
    window.addEventListener("focus", loadLeads);

    return () => {
      window.removeEventListener("focus", loadLeads);
    };
  }, []);

  const todayString = new Date().toISOString().split("T")[0];

  const normalizeDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = dateStr.match(ddmmyyyy);
    if (match) {
      const [, dd, mm, yyyy] = match;
      return `${yyyy}-${mm}-${dd}`;
    }

    return dateStr;
  };

  const getNumericValue = (value: number | string) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const formatCurrency = (value: number) => {
    return `₹ ${value.toLocaleString("en-IN")}`;
  };

  const isOverdue = (lead: Lead) => {
    const follow = normalizeDate(lead.followUp);
    if (!follow) return false;
    if (lead.status === "Closed" || lead.status === "Lost") return false;
    return follow < todayString;
  };

  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const followUpsDue = leads.filter((lead) => lead.status === "Follow-up").length;
    const visitPlanned = leads.filter((lead) => lead.status === "Visit Planned").length;
    const closedLeads = leads.filter((lead) => lead.status === "Closed").length;
    const overdueCount = leads.filter(isOverdue).length;

    const pipelineValue = leads.reduce((sum, lead) => {
      if (lead.status === "Lost") return sum;
      return sum + getNumericValue(lead.dealValue);
    }, 0);

    const closedRevenue = leads.reduce((sum, lead) => {
      if (lead.status !== "Closed") return sum;
      return sum + getNumericValue(lead.dealValue);
    }, 0);

    const avgDealValue = totalLeads > 0 ? Math.round(pipelineValue / totalLeads) : 0;
    const conversionRate =
      totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : "0.0";

    const sourceMap: Record<string, number> = {};
    const ownerMap: Record<string, number> = {};

    leads.forEach((lead) => {
      const source = lead.source || "Unknown";
      const owner = lead.owner || "Unassigned";
      sourceMap[source] = (sourceMap[source] || 0) + 1;
      ownerMap[owner] = (ownerMap[owner] || 0) + 1;
    });

    const topSource =
      Object.entries(sourceMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
    const topOwner =
      Object.entries(ownerMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    const recentLeads = [...leads]
      .sort((a, b) => normalizeDate(b.createdAt).localeCompare(normalizeDate(a.createdAt)))
      .slice(0, 5);

    const overdueLeads = leads
      .filter(isOverdue)
      .sort((a, b) => normalizeDate(a.followUp).localeCompare(normalizeDate(b.followUp)));

    return {
      totalLeads,
      followUpsDue,
      visitPlanned,
      closedLeads,
      overdueCount,
      pipelineValue,
      closedRevenue,
      avgDealValue,
      conversionRate,
      topSource,
      topOwner,
      recentLeads,
      overdueLeads,
    };
  }, [leads]);

  return (
    <div style={{ padding: "28px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "44px", fontWeight: 900, marginBottom: "8px" }}>
          Dashboard
        </div>
        <div style={{ color: "#9fb1d1" }}>Welcome back to MEI Business OS</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: "18px",
          marginBottom: "20px",
        }}
      >
        <StatCard title="Total Leads" value={String(stats.totalLeads)} onClick={() => navigate("/leads")} />
        <StatCard title="Follow-ups Due" value={String(stats.followUpsDue)} onClick={() => navigate("/leads?status=Follow-up")} />
        <StatCard title="Visit Planned" value={String(stats.visitPlanned)} onClick={() => navigate("/leads?status=Visit%20Planned")} />
        <StatCard title="Closed Leads" value={String(stats.closedLeads)} onClick={() => navigate("/leads?status=Closed")} />
        <StatCard
          title="Overdue Follow-ups"
          value={String(stats.overdueCount)}
          valueColor={stats.overdueCount > 0 ? "#fca5a5" : "#ffffff"}
          onClick={() => navigate("/leads?filter=overdue")}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "18px",
          marginBottom: "20px",
        }}
      >
        <StatCard title="Pipeline Value" value={formatCurrency(stats.pipelineValue)} big />
        <StatCard title="Closed Revenue" value={formatCurrency(stats.closedRevenue)} big />
        <StatCard title="Conversion Rate" value={`${stats.conversionRate}%`} big />
        <StatCard title="Avg Deal Value" value={formatCurrency(stats.avgDealValue)} big />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px",
        }}
      >
        <Card>
          <div style={sectionTitle}>Quick Insights</div>
          <InsightBox label="Top Source" value={stats.topSource} onClick={() => navigate(`/leads?source=${encodeURIComponent(stats.topSource)}`)} />
          <InsightBox label="Top Owner" value={stats.topOwner} onClick={() => navigate(`/leads?owner=${encodeURIComponent(stats.topOwner)}`)} />
          <InsightBox label="Overdue Count" value={String(stats.overdueCount)} onClick={() => navigate("/leads?filter=overdue")} />
        </Card>

        <Card>
          <div style={sectionTitle}>Recent Leads</div>
          {stats.recentLeads.length === 0 ? (
            <EmptyState text="No recent leads available." />
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {stats.recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => navigate(`/leads?search=${encodeURIComponent(lead.name)}`)}
                  style={listRowStyle}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{lead.name}</div>
                    <div style={{ color: "#9fb1d1", marginTop: "4px", fontSize: "14px" }}>
                      {lead.location}
                    </div>
                  </div>
                  <div style={{ color: "#cbd5e1" }}>{normalizeDate(lead.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div style={sectionTitle}>Overdue Leads</div>
          {stats.overdueLeads.length === 0 ? (
            <EmptyState text="No overdue leads. Clean board." />
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {stats.overdueLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() =>
                    navigate(`/leads?search=${encodeURIComponent(lead.name)}&filter=overdue`)
                  }
                  style={{
                    ...listRowStyle,
                    background: "rgba(127,29,29,0.18)",
                    border: "1px solid rgba(239,68,68,0.18)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{lead.name}</div>
                    <div style={{ color: "#fecaca", marginTop: "4px", fontSize: "14px" }}>
                      {normalizeDate(lead.followUp)}
                    </div>
                  </div>
                  <div style={{ color: "#fca5a5", fontWeight: 800 }}>Overdue</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div style={sectionTitle}>Pipeline Overview</div>
          <OverviewRow label="New" value={leads.filter((l) => l.status === "New").length} onClick={() => navigate("/leads?status=New")} />
          <OverviewRow label="Follow-up" value={leads.filter((l) => l.status === "Follow-up").length} onClick={() => navigate("/leads?status=Follow-up")} />
          <OverviewRow label="Visit Planned" value={leads.filter((l) => l.status === "Visit Planned").length} onClick={() => navigate("/leads?status=Visit%20Planned")} />
          <OverviewRow label="Closed" value={leads.filter((l) => l.status === "Closed").length} onClick={() => navigate("/leads?status=Closed")} />
        </Card>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={cardStyle}>{children}</div>;
}

function StatCard({
  title,
  value,
  big = false,
  valueColor = "#ffffff",
  onClick,
}: {
  title: string;
  value: string;
  big?: boolean;
  valueColor?: string;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick} style={{ ...statCardStyle, cursor: onClick ? "pointer" : "default" }}>
      <div style={{ color: "#9fb1d1", fontSize: "15px", marginBottom: "14px" }}>{title}</div>
      <div
        style={{
          fontSize: big ? "34px" : "24px",
          fontWeight: 900,
          color: valueColor,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InsightBox({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick} style={{ ...insightStyle, cursor: onClick ? "pointer" : "default" }}>
      <div style={{ color: "#9fb1d1", fontSize: "14px", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "20px", fontWeight: 900 }}>{value}</div>
    </div>
  );
}

function OverviewRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "16px 0",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "18px",
        background: "#081632",
        color: "#93a4c3",
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(10, 20, 45, 0.95)",
  border: "1px solid rgba(96, 165, 250, 0.15)",
  borderRadius: "24px",
  padding: "22px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
};

const statCardStyle: React.CSSProperties = {
  background: "rgba(10, 20, 45, 0.95)",
  border: "1px solid rgba(96, 165, 250, 0.15)",
  borderRadius: "24px",
  padding: "22px",
  boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 800,
  marginBottom: "14px",
};

const insightStyle: React.CSSProperties = {
  background: "#081632",
  border: "1px solid rgba(96,165,250,0.12)",
  borderRadius: "18px",
  padding: "18px",
  marginBottom: "12px",
};

const listRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#081632",
  border: "1px solid rgba(96,165,250,0.12)",
  borderRadius: "18px",
  padding: "18px 20px",
  cursor: "pointer",
};
export default DashboardPage;
