import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { X, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import * as notificationApi from "../../api/notificationApi";
import NotificationItem from "./NotificationItem";

export default function NotificationPanel({ open, onClose }) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("all");

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadNotifications();
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filtered = useMemo(() => {
    if (tab === "unread") {
      return notifications.filter((n) => !n.is_read);
    }
    return notifications;
  }, [tab, notifications]);

  const grouped = useMemo(() => {
    const now = new Date();

    const groups = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    filtered.forEach((n) => {
      const date = new Date(n.created_at);
      const diff = (now - date) / (1000 * 60 * 60 * 24);

      if (diff < 1) groups.Today.push(n);
      else if (diff < 2) groups.Yesterday.push(n);
      else groups.Earlier.push(n);
    });

    return groups;
  }, [filtered]);

  const markAllRead = async () => {
    await notificationApi.markAllAsRead();
    loadNotifications();
  };

  const markAsRead = async (id) => {
    await notificationApi.markAsRead(id);
    loadNotifications();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-40"
          />

          {/* PANEL */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed right-4 top-16 max-h-[75vh] w-105 rounded-2xl border border-(--color-border)/30 bg-(--color-surface)/85 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-50 flex flex-col border-l"
          >
            {/* HEADER */}
            <div className="px-6 py-5 border-b border-(--color-border)/60">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-(--color-text)">
                    Notifications
                  </h2>
                  <p className="text-xs text-(--color-muted)">
                    {unreadCount} unread
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-(--color-primary) rounded-xl text-(--color-text)"
                >
                  <X size={18} />
                </button>
              </div>

              {/* TABS */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setTab("all")}
                  className={`px-3 py-1 rounded-lg text-xs ${
                    tab === "all"
                      ? "bg-(--color-primary) text-white"
                      : "bg-(--color-surface-muted) text-(--color-text)"
                  }`}
                >
                  All
                </button>

                <button
                  onClick={() => setTab("unread")}
                  className={`px-3 py-1 rounded-lg text-xs ${
                    tab === "unread"
                      ? "bg-(--color-primary) text-white"
                      : "bg-(--color-surface-muted)/50"
                  }`}
                >
                  Unread
                </button>

                <button
                  onClick={markAllRead}
                  className="ml-auto text-xs text-(--color-primary) hover:underline"
                >
                  Mark all read
                </button>
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {loading ? (
                <p className="text-sm text-(--color-muted)">Loading...</p>
              ) : (
                Object.entries(grouped).map(
                  ([label, items]) =>
                    items.length > 0 && (
                      <div key={label}>
                        <h3 className="text-xs font-semibold text-(--color-muted) mb-2">
                          {label}
                        </h3>

                        <div className="space-y-3">
                          {items.map((n) => (
                            <NotificationItem
                              key={n.id}
                              notification={n}
                              onClick={() => markAsRead(n.id)}
                            />
                          ))}
                        </div>
                      </div>
                    ),
                )
              )}
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-(--color-border)/60">
              <button
                onClick={() => {
                  navigate("/notifications");
                  onClose();
                }}
                className="w-full text-sm font-medium text-slate-700 hover:text-(--color-text)"
              >
                View notification history →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
