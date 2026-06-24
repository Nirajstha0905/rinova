import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Bell, CheckCheck, Search } from "lucide-react";
import * as notificationApi from "../../api/notificationApi";
import NotificationItem from "../../components/notifications/NotificationItem";
import { groupNotifications } from "../../components/notifications/notificationUtils";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input, Select } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setNotifications(await notificationApi.getNotifications());
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const request = Promise.resolve().then(loadNotifications);
    return () => request.catch(() => {});
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const visibleNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !notification.isRead) ||
        notification.type === filter ||
        notification.entityType === filter;

      const matchesSearch =
        !query ||
        [
          notification.title,
          notification.message,
          notification.type,
          notification.entityType,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [filter, notifications, search]);

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
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        eyebrow="Notification Center"
        title="Notifications"
        description="Review assignments, document updates, reminders, and system messages."
        icon={Bell}
        action={
          <Button variant="secondary" onClick={handleMarkAllRead}>
            <CheckCheck size={17} />
            Mark all read
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-2xl font-bold text-(--color-text)">
              {notifications.length}
            </p>
            <p className="mt-1 text-sm text-(--color-muted)">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-2xl font-bold text-(--color-text)">
              {unreadCount}
            </p>
            <p className="mt-1 text-sm text-(--color-muted)">Unread</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-2xl font-bold text-(--color-text)">
              {notifications.filter((item) => item.type === "task").length}
            </p>
            <p className="mt-1 text-sm text-(--color-muted)">Tasks</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notifications..."
              className="pl-9"
            />
          </div>
          <Select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="lg:w-48"
          >
            <option value="all">All notifications</option>
            <option value="unread">Unread</option>
            <option value="task">Tasks</option>
            <option value="document">Documents</option>
            <option value="student">Students</option>
            <option value="lead">Leads</option>
          </Select>
          <Badge tone="blue">{visibleNotifications.length} shown</Badge>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="text-center text-(--color-muted)">
            Loading notifications...
          </CardContent>
        </Card>
      ) : visibleNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You are all caught up, or no notifications match your filters."
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([label, items]) => (
            <section key={label} className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                {label}
              </h2>
              <div className="space-y-3">
                {items.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={handleRead}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
