import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell flex min-h-screen">
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="relative flex-1 overflow-auto px-4 py-4 sm:px-5 md:px-8 md:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
