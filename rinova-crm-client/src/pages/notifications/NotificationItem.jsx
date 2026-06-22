import { motion } from "framer-motion";
import { User, FileText, Briefcase, Clock, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const typeConfig = {
  student: {
    icon: User,
    color: "bg-blue-500/10 text-blue-500",
    dot: "bg-blue-500",
    border: "border-l-blue-500",
    button: "bg-blue-500 hover:bg-blue-600",
    label: "View Student",
  },

  document: {
    icon: FileText,
    color: "bg-emerald-500/10 text-emerald-500",
    dot: "bg-emerald-500",
    border: "border-l-emerald-500",
    button: "bg-emerald-500 hover:bg-emerald-600",
    label: "View Document",
  },

  lead: {
    icon: Briefcase,
    color: "bg-purple-500/10 text-purple-500",
    dot: "bg-purple-500",
    border: "border-l-purple-500",
    button: "bg-purple-500 hover:bg-purple-600",
    label: "View Lead",
  },

  task: {
    icon: Clock,
    color: "bg-orange-500/10 text-orange-500",
    dot: "bg-orange-500",
    border: "border-l-orange-500",
    button: "bg-orange-500 hover:bg-orange-600",
    label: "Open Task",
  },

  info: {
    icon: Info,
    color: "bg-(--color-surface-muted) text-(--color-primary)",
    dot: "bg-(--color-primary)",
    border: "border-l-(--color-primary)",
    button: "bg-(--color-primary) hover:opacity-90",
    label: "View Details",
  },
};

export default function NotificationItem({ notification, onClick }) {
  const config =
    typeConfig[notification.entity_type || notification.type] ||
    typeConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`
        relative
        cursor-pointer
        rounded-xl
        border
        p-4
        transition-all
        duration-200
        hover:border-(--color-primary)
        hover:bg-(--color-surface-muted)

        ${
          notification.is_read
            ? "border-(--color-border) bg-(--color-surface)"
            : "border-(--color-primary)/20 bg-(--color-surface-muted)"
        }
      `}
    >
      <div className="flex gap-3">
        <div
          className={`
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl
            ${config.color}
          `}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-semibold text-(--color-text)">
              {notification.title}
            </p>

            {!notification.is_read && (
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${config.dot}`}
              />
            )}
          </div>

          <p className="mt-1 line-clamp-2 text-xs text-(--color-muted)">
            {notification.message}
          </p>

          <p className="mt-2 text-[11px] text-(--color-muted)">
            {new Date(notification.created_at).toLocaleString()}
          </p>

          {notification.action_url && (
            <button
              className={`
                mt-3
                rounded-lg
                px-3
                py-1.5
                text-xs
                font-medium
                text-(--color-)
                transition-all
                ${config.button}
              `}
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = notification.action_url;
              }}
            >
              {config.label} →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
