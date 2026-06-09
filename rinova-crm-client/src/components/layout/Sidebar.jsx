import {
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menus = [
  { name: "Dashboard",     path: "/",             icon: LayoutDashboard },
  { name: "Leads",         path: "/leads",        icon: Users },
  { name: "Students",      path: "/students",     icon: GraduationCap },
  { name: "Applications",  path: "/applications", icon: Briefcase },
  { name: "Documents",     path: "/documents",    icon: FileText },
  { name: "Tasks",         path: "/tasks",        icon: Settings },
  { name: "Reports",       path: "/reports",      icon: Sparkles },
];

export default function Sidebar() {
  const location = useLocation();                          // ✅ fix 4
  const isActive = (path) => location.pathname === path;  // ✅ fix 4

  return (
    <aside className="hidden md:flex w-64 bg-white/92 border-r border-[#dde6f6] flex-col fixed left-0 top-0 h-screen">
      <div className="p-6 border-b border-[#edf1f8]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-[#2558ff] to-[#9b3bff] rounded-2xl flex items-center justify-center text-white shadow-sm shadow-violet-200">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-[#2558ff] to-[#9b3bff] bg-clip-text text-transparent">
              Rinova
            </h1>
            <p className="text-xs text-slate-500">Education CRM</p>
          </div>
        </div>
      </div>

      <nav className="p-4 flex-1 space-y-1.5">
        {menus.map((item) => (
          <Link
            key={item.name}                                 // ✅ fix 2
            to={item.path}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isActive(item.path)
                ? "bg-[#f2f0ff] text-[#6d35ff] font-semibold shadow-sm"
                : "text-slate-600 hover:bg-[#f7f9fd] hover:text-slate-950"
            }`}
          >
            <item.icon size={19} />                        {/* ✅ fix 1 */}
            <span className="text-sm">{item.name}</span>  {/* ✅ fix 3 */}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#edf1f8]">
        <div className="rounded-2xl bg-[#f7f9ff] border border-[#e5ebf7] px-4 py-3">
          <div className="flex items-center gap-2 text-[#6d35ff]">
            <Sparkles size={16} />
            <p className="text-xs font-semibold">Rinova Creation</p>
          </div>
          <p className="mt-1 text-xs text-slate-500">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}