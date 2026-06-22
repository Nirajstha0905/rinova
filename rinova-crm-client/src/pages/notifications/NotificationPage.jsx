import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import * as notificationApi from "../../api/notificationApi";

const getTypeConfig = (notification) => {
  const text =
    `${notification.title || ""} ${notification.message || ""}`.toLowerCase();

  if (text.includes("approved")) {
    return {
      Icon: CheckCircle2,
      iconColor: "text-emerald-600",
      bg: "bg-emerald-50",
    };
  }

  if (text.includes("rejected") || text.includes("expired")) {
    return {
      Icon: AlertCircle,
      iconColor: "text-amber-600",
      bg: "bg-amber-50",
    };
  }

  return {
    Icon: Info,
    iconColor: "text-blue-600",
    bg: "bg-blue-50",
  };
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = date.toDateString();

  if (dateOnly === today.toDateString()) {
    return "Today";
  }

  if (dateOnly === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString();
};

const formatTime = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const data = await notificationApi.getNotifications();

      setNotifications(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notification) => {
    if (notification.is_read) return;

    try {
      await notificationApi.markAsRead(notification.id);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                is_read: true,
              }
            : item,
        ),
      );
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          is_read: true,
        })),
      );

      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  const displayedNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((notification) => !notification.is_read);
    }

    return notifications;
  }, [notifications, filter]);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  const groupedNotifications = displayedNotifications.reduce(
    (groups, notification) => {
      const group = formatDate(notification.created_at);

      if (!groups[group]) {
        groups[group] = [];
      }

      groups[group].push(notification);

      return groups;
    },
    {},
  );

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      {/* Header */}
      <div className="app-surface rounded-2xl border border-(--color-border) p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Bell className="text-(--color-text)" size={24} />
              <h1 className="text-2xl font-bold text-(--color-text)">
                Notifications
              </h1>
            </div>

            <p className="mt-2 text-sm text-(--color-muted)">
              Stay updated with approvals, rejections, assignments and system
              activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {unreadCount} unread
            </div>

            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 rounded-xl border border-(--color-border) px-4 py-2 text-sm font-medium transition hover:bg-(--color-surface-muted)"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "border border-(--color-border) hover:bg-(--color-surface-muted)"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("unread")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "border border-(--color-border) hover:bg-(--color-surface-muted)"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="mt-6">
        {loading ? (
          <div className="app-surface rounded-2xl border border-(--color-border) p-8 text-center">
            <p className="text-(--color-muted)">Loading notifications...</p>
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="app-surface rounded-2xl border border-(--color-border) p-12 text-center">
            <Bell size={48} className="mx-auto mb-4 text-(--color-muted)" />

            <h3 className="text-lg font-semibold text-(--color-text)">
              No notifications
            </h3>

            <p className="mt-2 text-sm text-(--color-muted)">
              You're all caught up.
            </p>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([group, items]) => (
            <div key={group} className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-(--color-muted)">
                {group}
              </h2>

              <div className="overflow-hidden rounded-2xl border border-(--color-border)">
                {items.map((notification) => {
                  const config = getTypeConfig(notification);

                  const Icon = config.Icon;

                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleMarkAsRead(notification)}
                      className={`app-surface flex cursor-pointer gap-4 border-b border-(--color-border) p-5 transition hover:bg-(--color-surface-muted) ${
                        !notification.is_read ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}
                      >
                        <Icon size={18} className={config.iconColor} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-(--color-text)">
                                {notification.title}
                              </h3>

                              {!notification.is_read && (
                                <span className="h-2 w-2 rounded-full bg-blue-600" />
                              )}
                            </div>

                            <p className="mt-1 text-sm text-(--color-muted)">
                              {notification.message}
                            </p>
                          </div>

                          <span className="whitespace-nowrap text-xs text-(--color-muted)">
                            {formatTime(notification.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
