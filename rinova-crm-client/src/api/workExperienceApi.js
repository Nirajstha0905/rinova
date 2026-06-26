import api from "../services/axios";

const unwrapData = (response) => response.data?.data ?? response.data;

const asText = (value, fallback = "") => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
};

const asBool = (value) =>
  typeof value === "boolean" ? value : String(value).toLowerCase() === "true";

export const normalizeWorkExperience = (experience) => ({
  id: experience?.id,
  studentId: experience?.student_id ?? "",
  jobTitle: asText(experience?.job_title || experience?.position, ""),
  companyName: asText(experience?.company_name, ""),
  country: asText(experience?.country, ""),
  startDate: experience?.start_date ?? null,
  endDate: experience?.end_date ?? null,
  currentlyWorking: asBool(experience?.currently_working),
  responsibilities: asText(experience?.responsibilities, ""),
  documents: Array.isArray(experience?.documents) ? experience.documents : [],
});

export const getWorkExperiences = async () => {
  const response = await api.get("/work-experiences");
  const data = unwrapData(response);
  return Array.isArray(data) ? data.map(normalizeWorkExperience) : [];
};

export const createWorkExperience = async (payload) => {
  const response = await api.post("/work-experiences", payload);
  return normalizeWorkExperience(unwrapData(response));
};

export const updateWorkExperience = async (id, payload) => {
  const response = await api.put(`/work-experiences/${id}`, payload);
  return normalizeWorkExperience(unwrapData(response));
};

export const deleteWorkExperience = async (id) => {
  const response = await api.delete(`/work-experiences/${id}`);
  return unwrapData(response);
};
