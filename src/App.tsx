import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function LeadsPage() {
  return <div style={{ padding: 24, fontSize: 28 }}>Leads Page ✅</div>;
}

function LeadDetailPage() {
  return <div style={{ padding: 24, fontSize: 28 }}>Lead Detail Page ✅</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/leads" replace />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/leads/:id" element={<LeadDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}