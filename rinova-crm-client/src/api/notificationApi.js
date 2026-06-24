import api from "../services/axios";

const unwrapData = (response) => response.data?.data ?? response.data;

const asText = (value, fallback = "") =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

export const normalizeNotification = (notification) => ({
  id: notification?.id,
  userId: notification?.user_id,
  title: asText(notification?.title, "Notification"),
  message: asText(notification?.message, "No message provided"),
  isRead: Boolean(notification?.is_read),
  createdAt: notification?.created_at ?? null,
  type: asText(notification?.type, "info").toLowerCase(),
  actionUrl: asText(notification?.action_url, ""),
  entityId: notification?.entity_id ?? "",
  entityType: asText(notification?.entity_type, "").toLowerCase(),
  raw: notification,
});

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  const data = unwrapData(response);

  return Array.isArray(data) ? data.map(normalizeNotification) : [];
};

export const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread-count");

  return Number(response.data?.count ?? 0);
};

export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);

  return normalizeNotification(unwrapData(response));
};

export const markAllAsRead = async () => {
  const response = await api.put("/notifications/read-all");

  return unwrapData(response);
};
