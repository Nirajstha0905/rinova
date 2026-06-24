import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/Badge";
import {
  formatNotificationTime,
  getNotificationConfig,
} from "./notificationUtils";

const iconToneClasses = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-200",
  green:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200",
  violet:
    "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-200",
  amber:
    "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-200",
};

export default function NotificationItem({ notification, onRead, compact = false }) {
  const navigate = useNavigate();
  const config = getNotificationConfig(notification);
  const Icon = config.icon;

  const openAction = (event) => {
    event.stopPropagation();
    if (!notification.actionUrl) return;
    onRead?.(notification);
    navigate(notification.actionUrl);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onRead?.(notification)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onRead?.(notification);
      }}
      className={`group flex w-full gap-3 rounded-2xl border p-4 text-left transition hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-muted)] ${
        notification.isRead
          ? "border-[var(--color-border)] bg-[var(--color-surface)]"
          : "border-[color-mix(in_srgb,var(--color-primary)_28%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-primary)_7%,var(--color-surface))]"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          iconToneClasses[config.tone] || iconToneClasses.blue
        }`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                {notification.title}
              </p>
              {!notification.isRead && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
              )}
            </div>
            <p
              className={`mt-1 text-sm text-[var(--color-muted)] ${
                compact ? "line-clamp-2" : ""
              }`}
            >
              {notification.message}
            </p>
          </div>

          <span className="shrink-0 text-xs text-[var(--color-muted)]">
            {formatNotificationTime(notification.createdAt)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <Badge tone={config.tone}>{config.label}</Badge>
          {notification.actionUrl && (
            <span
              role="button"
              tabIndex={0}
              onClick={openAction}
              onKeyDown={(event) => {
                if (event.key === "Enter") openAction(event);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)]"
            >
              Open
              <ArrowRight size={13} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
