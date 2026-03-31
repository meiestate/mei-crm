import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "#e5e7eb",
        display: "flex",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <main style={{ padding: "24px" }}>{children}</main>
      </div>
    </div>
  );
}