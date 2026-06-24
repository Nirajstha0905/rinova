import api from "../services/axios";

const unwrapData = (response) => response.data?.data ?? response.data;

const buildName = (user) =>
  [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() ||
  user?.full_name ||
  user?.email ||
  "Unnamed User";

export const normalizeUser = (user) => ({
  id: user?.id,
  name: buildName(user),
  email: user?.email ?? "",
  role: user?.roles?.name ?? user?.role ?? "",
});

export const getUsers = async () => {
  const response = await api.get("/users");
  const data = unwrapData(response);

  return Array.isArray(data) ? data.map(normalizeUser) : [];
};
