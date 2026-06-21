import api from "../services/axios";

const unwarpData = (response) => 
  response.data?.data ?? response.data;

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return unwarpData(response);
};

export const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread-count");
  return response.data.count;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`
  );

  return unwarpData(response);
};

export const markAllAsRead = async () => {
  const response = await api.put(
    "/notifications/read-all"
  );
  return unwarpData(response);
}