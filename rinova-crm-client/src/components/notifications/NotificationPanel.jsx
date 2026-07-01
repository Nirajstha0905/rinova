import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Bell, CheckCheck, X } from "lucide-react";
import * as notificationApi from "../../api/notificationApi";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import NotificationItem from "./NotificationItem";
import { groupNotifications } from "./notificationUtils";
import { usePresenceTransition } from "../ui/usePresenceTransition";

export default function NotificationPanel({
  open,
  onClose,
  onUnreadChange,
}) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const { shouldRender, visible } = usePresenceTransition(open);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getNotifications();
      setNotifications(data);
      onUnreadChange?.(data.filter((item) => !item.isRead).length);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [onUnreadChange]);

  useEffect(() => {
    if (!open) return;
    const request = Promise.resolve().then(loadNotifications);
    return () => request.catch(() => {});
  }, [loadNotifications, open]);

  const visibleNotifications = useMemo(
    () =>
      filter === "unread"
        ? notifications.filter((notification) => !notification.isRead)
        : notifications,
    [filter, notifications],
  );

  const grouped = useMemo(
    () => groupNotifications(visibleNotifications),
    [visibleNotifications],
  );

  const handleRead = async (notification) => {
    if (notification.isRead) return;

    try {
      await notificationApi.markAsRead(notification.id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item,
        ),
      );
      onUnreadChange?.(Math.max(unreadCount - 1, 0));
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true })),
      );
      onUnreadChange?.(0);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-200 ease-[var(--motion-ease)] ${visible ? "opacity-100" : "opacity-0"}`}>
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"
        aria-label="Close notification panel"
      />

      <aside className={`absolute right-3 top-20 flex max-h-[calc(100vh-6rem)] w-[calc(100vw-1.5rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_70px_rgba(15,23,42,0.22)] dark:shadow-none sm:right-6 transition-all duration-200 ease-[var(--motion-ease)] ${visible ? "translate-x-0 scale-100 opacity-100" : "translate-x-2 scale-[0.985] opacity-0"}`}>
        <div className="border-b border-[var(--color-border)] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-[var(--color-primary)]" />
                <h2 className="text-lg font-bold text-[var(--color-text)]">
                  Notifications
                </h2>
              </div>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {unreadCount} unread update{unreadCount === 1 ? "" : "s"}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {["all", "unread"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold capitalize transition ${
                  filter === option
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {option}
              </button>
            ))}
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-[var(--color-muted)]">
              Loading notifications...
            </p>
          ) : visibleNotifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You are all caught up."
            />
          ) : (
            Object.entries(grouped).map(([label, items]) => (
              <section key={label} className="space-y-2">
                <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                  {label}
                </h3>
                {items.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    compact
                    onRead={handleRead}
                  />
                ))}
              </section>
            ))
          )}
        </div>

        <div className="border-t border-[var(--color-border)] p-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              navigate("/notifications");
              onClose();
            }}
          >
            View notification history
          </Button>
        </div>
      </aside>
    </div>
  );
}
