import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#eef4ff] flex text-[#111827]">
      <Sidebar />

      <div className="flex-1 md:ml-64 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-auto px-5 py-5 md:px-8 md:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
