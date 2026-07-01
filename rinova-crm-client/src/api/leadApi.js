import api from "../services/axios";

const unwrapData = (response) => response.data?.data ?? response.data;

const asText = (value, fallback = "") =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

const buildName = (lead) =>
  [lead?.first_name, lead?.middle_name, lead?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim() || "Unnamed Lead";

export const normalizeLead = (lead) => ({
  id: lead?.id,
  name: buildName(lead),
  email: asText(lead?.email),
  phone: asText(lead?.phone),
  status: asText(lead?.status, "new"),
  countryInterest: asText(lead?.country_interest),
  courseInterest: asText(lead?.course_interest),
});

export const getLeads = async () => {
  const response = await api.get("/leads");
  const data = unwrapData(response);

  return Array.isArray(data) ? data.map(normalizeLead) : [];
};
