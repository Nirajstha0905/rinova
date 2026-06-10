import api from "../services/axios";

const emptyOverview = {
  totalStudents: 0,
  totalLeads: 0,
  totalApplications: 0,
  totalInstitutions: 0,
  totalCourses: 0,
  totalDocuments: 0,
  pendingTasks: 0,
  pendingFollowups: 0,
  todayTasks: 0,
  overdueTasks: 0,
  unreadNotifications: 0,
};

const unwrapData = (response) => response.data?.data ?? response.data;

const asArray = (value) => (Array.isArray(value) ? value : []);

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const asText = (value, fallback = "Unknown") => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
};

const getCount = (item, fieldName) => {
  if (typeof item?._count === "number") return item._count;
  return asNumber(item?._count?._all ?? item?._count?.[fieldName] ?? item?.count);
};

const normalizeOverview = (data) => ({
  ...emptyOverview,
  ...Object.fromEntries(
    Object.keys(emptyOverview).map((key) => [key, asNumber(data?.[key])])
  ),
});

const normalizeApplicationsByStatus = (data) =>
  asArray(data).map((item) => ({
    name: asText(item?.status),
    count: getCount(item, "status"),
  }));

const normalizeStudentsByCountry = (data) =>
  asArray(data).map((item) => ({
    name: asText(item?.preferred_country),
    value: getCount(item, "preferred_country"),
  }));

const normalizeRecentActivities = (data) =>
  asArray(data).map((activity, index) => {
    const firstName = asText(activity?.users?.first_name, "");
    const lastName = asText(activity?.users?.last_name, "");
    const userName = `${firstName} ${lastName}`.trim() || "System";

    return {
      id: activity?.id ?? `activity-${index}`,
      userName,
      action: asText(activity?.action ?? activity?.description, "Activity recorded"),
      createdAt: activity?.created_at ?? null,
      description: asText(activity?.description ?? "None"),
    };
  });

const normalizeUpcomingTasks = (data) =>
  asArray(data).map((task, index) => ({
    id: task?.id ?? `task-${index}`,
    title: asText(task?.title, "Untitled task"),
    dueDate: task?.due_date ?? null,
    status: asText(task?.status, "pending").toLowerCase(),
  }));

export const getDashboardOverview = async () => {
  const response = await api.get("/dashboard/overview");
  return normalizeOverview(unwrapData(response));
};

export const getApplicationsByStatus = async () => {
  const response = await api.get("/dashboard/applications-by-status");
  return normalizeApplicationsByStatus(unwrapData(response));
};

export const getStudentsByCountry = async () => {
  const response = await api.get("/dashboard/students-by-country");
  return normalizeStudentsByCountry(unwrapData(response));
};

export const getRecentActivities = async () => {
  const response = await api.get("/dashboard/recent-activities");
  return normalizeRecentActivities(unwrapData(response));
};

export const getUpcomingTasks = async () => {
  const response = await api.get("/dashboard/upcoming-tasks");
  return normalizeUpcomingTasks(unwrapData(response));
};
