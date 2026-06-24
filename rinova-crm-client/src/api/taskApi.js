import api from "../services/axios";

const unwrapData = (response) => response.data?.data ?? response.data;

const asText = (value, fallback = "") =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

export const normalizeTask = (task) => ({
  id: task?.id,
  title: asText(task?.title, "Untitled task"),
  description: asText(task?.description, "No description added"),
  priority: asText(task?.priority, "normal").toLowerCase(),
  category: asText(task?.category, "admin").toLowerCase(),
  status: asText(task?.status, "todo").toLowerCase(),
  dueDate: task?.dueDate ?? task?.due_date ?? null,
  createdAt: task?.createdAt ?? task?.created_at ?? null,
  assignedTo: task?.assignedTo ?? task?.users ?? null,
  relatedTo: asText(task?.relatedTo, "Internal"),
  tags: Array.isArray(task?.tags) ? task.tags : [],
});

export const getTasks = async () => {
  const response = await api.get("/tasks");
  const data = unwrapData(response);

  return Array.isArray(data) ? data.map(normalizeTask) : [];
};

export const createTask = async (data) => {
  const response = await api.post("/tasks", data);

  return normalizeTask(unwrapData(response));
};

export const updateTask = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);

  return normalizeTask(unwrapData(response));
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);

  return unwrapData(response);
};

export const completeTask = async (id) => {
  const response = await api.patch(`/tasks/${id}/complete`);

  return normalizeTask(unwrapData(response));
};
