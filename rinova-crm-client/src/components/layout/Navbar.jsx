import { Bell, LogOut, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as notificationApi from "../../api/notificationApi";
import { useAuth } from "../../context/AuthContext";

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

export default function Navbar() {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
    <header className="h-[74px] bg-white/92 border-b border-[#dde6f6] flex items-center justify-between px-6 md:px-8">
      <div>
        <p className="text-xs font-medium text-slate-500">
          Modern Education Consultancy & CRM Platform
        </p>
        <h2 className="font-semibold text-xl text-slate-950">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 w-72 rounded-xl bg-[#f4f6fb] border border-[#e7edf7] px-3 py-2">
          <Search size={17} className="text-slate-400" />
          <span className="text-sm text-slate-400">Search students, leads...</span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="relative h-10 w-10 rounded-xl bg-[#f4f6fb] border border-[#e7edf7] flex items-center justify-center"
          aria-label="View notifications"
        >
          <Bell size={20} className="text-slate-600 hover:text-slate-900" />
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
            className="flex items-center gap-3 hover:bg-[#f4f6fb] p-2 rounded-xl transition"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2558ff] to-[#9b3bff] text-white flex items-center justify-center font-semibold">
              {getInitials(displayName)}
            </div>
            <div className="hidden md:block text-left">
              <p className="font-medium text-sm text-slate-950">{displayName}</p>
              <p className={`text-xs ${getRoleColor(displayRole)}`}>
                {displayRole.toUpperCase()}
              </p>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 min-w-48 bg-white border border-[#e5ebf7] rounded-xl shadow-lg p-2 z-50">
              <div className="px-3 py-2 border-b border-[#edf1f8] mb-1">
                <p className="text-sm font-semibold text-slate-950 truncate">{displayName}</p>
                <p className={`text-xs ${getRoleColor(displayRole)}`}>{displayRole}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-[#f4f6fb] rounded-lg transition w-full text-left text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
