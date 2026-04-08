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
        display: "flex",
        minHeight: "100vh",
        background: "#020617",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Topbar />

        <main
          style={{
            flex: 1,
            overflow: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}