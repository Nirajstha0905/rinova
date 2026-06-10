import api from "../services/axios";

const unwrapData = (response) => response.data?.data ?? response.data;

export const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread-count");
  const data = unwrapData(response);
  const count = Number(data?.count);

  return Number.isFinite(count) ? count : 0;
};

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  const data = unwrapData(response);

  return Array.isArray(data) ? data : [];
};
