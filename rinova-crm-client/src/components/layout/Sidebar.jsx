import {
  Bell,
  Briefcase,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePresenceTransition } from "../ui/usePresenceTransition";

const menus = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: [
      "Super Admin",
      "Consultancy Admin",
      "Counsellors",
      "Documentation Officers",
      "Students",
    ],
  },
  {
    name: "Leads",
    path: "/leads",
    icon: Users,
    roles: ["Super Admin", "Consultancy Admin", "Counsellors"],
  },
  {
    name: "Students",
    path: "/students",
    icon: GraduationCap,
    roles: [
      "Super Admin",
      "Consultancy Admin",
      "Counsellors",
      "Documentation Officers",
    ],
  },
  {
    name: "Applications",
    path: "/applications",
    icon: Briefcase,
    roles: [
      "Super Admin",
      "Consultancy Admin",
      "Counsellors",
      "Documentation Officers",
      "Students",
    ],
  },
  {
    name: "Documents",
    path: "/documents",
    icon: FileText,
    roles: [
      "Super Admin",
      "Consultancy Admin",
      "Documentation Officers",
      "Students",
    ],
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: ClipboardCheck,
    roles: [
      "Super Admin",
      "Consultancy Admin",
      "Counsellors",
      "Documentation Officers",
    ],
  },
  {
    name: "Reports",
    path: "/reports",
    icon: Sparkles,
    roles: ["Super Admin", "Consultancy Admin"],
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
    roles: [
      "Super Admin",
      "Consultancy Admin",
      "Counsellors",
      "Documentation Officers",
      "Students",
    ],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["Super Admin", "Consultancy Admin"],
  },
];

function SidebarContent({ onNavigate }) {
  const location = useLocation();
  const { hasAnyRole } = useAuth();
  const visibleMenus = menus.filter((item) => hasAnyRole(item.roles));
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="border-b border-(--color-border) p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-(--color-secondary) to-(--color-primary) text-white shadow-sm shadow-violet-200 dark:shadow-none">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="bg-linear-to-r from-(--color-secondary) to-(--color-primary) bg-clip-text text-lg font-bold leading-tight text-transparent">
              Rinova
            </h1>
            <p className="text-xs text-(--color-muted)">Education CRM</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
        {visibleMenus.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={onNavigate}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              isActive(item.path)
                ? "bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] font-semibold text-(--color-primary) shadow-sm"
                : "text-(--color-muted) hover:bg-(--color-surface-muted) hover:text-(--color-text)"
            }`}
          >
            <item.icon size={19} />
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-(--color-border) p-4">
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-muted) px-4 py-3">
          <div className="flex items-center gap-2 text-(--color-primary)">
            <Sparkles size={16} />
            <p className="text-xs font-semibold">Rinova Creation</p>
          </div>
          <p className="mt-1 text-xs text-(--color-muted)">v1.0.0</p>
        </div>
      </div>
    </>
  );
}

export default function Sidebar({ mobileOpen = false, onMobileClose }) {
  const { shouldRender, visible } = usePresenceTransition(mobileOpen);

  return (
    <>
      <aside className="app-surface fixed left-0 top-0 hidden h-screen w-64 flex-col border-r md:flex">
        <SidebarContent />
      </aside>

      {shouldRender && (
        <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-200 ease-[var(--motion-ease)] ${visible ? "opacity-100" : "opacity-0"}`}>
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45"
            onClick={onMobileClose}
            aria-label="Close sidebar overlay"
          />
          <aside className={`app-surface relative flex h-full w-72 max-w-[86vw] flex-col border-r shadow-2xl transition-all duration-200 ease-[var(--motion-ease)] ${visible ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
            <button
              type="button"
              onClick={onMobileClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-(--color-muted) transition hover:bg-(--color-surface-muted) hover:text-(--color-text)"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
}
