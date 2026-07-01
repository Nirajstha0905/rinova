import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as notificationApi from "../../api/notificationApi";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../theme/ThemeToggle";
import NotificationPanel from "../notifications/NotificationPanel";
import { usePresenceTransition } from "../ui/usePresenceTransition";

const getRoleColor = (role) => {
  const colors = {
    "super admin": "text-purple-600",
    "consultancy admin": "text-blue-600",
    counsellors: "text-emerald-600",
    "documentation officers": "text-amber-600",
    students: "text-sky-600",
  };

  return colors[role?.toLowerCase()] || "text-slate-500";
};

const getInitials = (name = "User") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

export default function Navbar({ onMenuClick }) {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { shouldRender, visible } = usePresenceTransition(showDropdown);

  const displayName = user?.full_name || user?.email || "User";
  const displayRole = userRole || "Staff";

  useEffect(() => {
    const request = Promise.resolve()
      .then(notificationApi.getUnreadCount)
      .then(setUnreadCount)
      .catch(() => setUnreadCount(0));

    return () => {
      request.catch(() => {});
    };
  }, []);

  const [openNotifications, setOpenNotifications] = useState(false);

  const toggleNotifications = () => {
    setOpenNotifications((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="app-surface flex min-h-18.5 items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surface-muted) text-(--color-muted) md:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-(--color-muted)">
            Modern Education Consultancy & CRM Platform
          </p>
          <h2 className="truncate text-lg font-semibold text-(--color-text) sm:text-xl">
            Dashboard
          </h2>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div className="hidden lg:flex items-center gap-2 w-72 rounded-xl bg-[#f4f6fb] border border-[#e7edf7] px-3 py-2">
          <Search size={17} className="text-slate-400" />
          <span className="text-sm text-slate-400">
            Search students, leads...
          </span>
        </div>

        <ThemeToggle />

        <button
          type="button"
          onClick={toggleNotifications}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surface-muted)"
        >
          <Bell size={20} />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#ff4d6d] rounded-full text-white text-[10px] flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-(--color-surface-muted) sm:p-2"
          >
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#2558ff] to-[#9b3bff] text-white flex items-center justify-center font-semibold">
              {getInitials(displayName)}
            </div>
            <div className="hidden md:block text-left">
              <p className="font-medium text-sm text-(--color-text)">
                {displayName}
              </p>
              <p className={`text-xs ${getRoleColor(displayRole)}`}>
                {displayRole.toUpperCase()}
              </p>
            </div>
          </button>

          {shouldRender && (
            <div className={`app-surface absolute right-0 z-50 mt-2 min-w-48 rounded-xl border p-2 shadow-lg transition-all duration-200 ease-[var(--motion-ease)] ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-[0.985] opacity-0"}`}>
              <div className="mb-1 border-b border-(--color-border) px-3 py-2">
                <p className="truncate text-sm font-semibold text-(--color-text)">
                  {displayName}
                </p>
                <p className={`text-xs ${getRoleColor(displayRole)}`}>
                  {displayRole}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-(--color-muted) transition hover:bg-(--color-surface-muted) hover:text-(--color-text)"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <NotificationPanel
        open={openNotifications}
        onClose={() => setOpenNotifications(false)}
        onUnreadChange={setUnreadCount}
      />
    </header>
  );
}
