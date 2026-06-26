import api from "../services/axios";

const unwrapData = (response) => response.data?.data ?? response.data;

const apiOrigin = () =>
  (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(
    /\/api\/?$/,
    "",
  );

const asText = (value, fallback = "Not provided") => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
};

const buildUserName = (user) =>
  [user?.first_name, user?.middle_name, user?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim() || user?.full_name || user?.name || user?.email || "Unknown user";

const buildStudentName = (student) =>
  [student?.first_name, student?.middle_name, student?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim() || "Unassigned Student";

const buildFileUrl = (fileUrl) => {
  if (!fileUrl) return "";
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;

  return `${apiOrigin()}/${fileUrl.replace(/\\/g, "/").replace(/^\/+/, "")}`;
};

export const normalizeDocument = (document) => ({
  id: document?.id,
  studentId: document?.student_id ?? document?.students?.id ?? "",
  applicationId: document?.application_id ?? "",
  fileName: asText(document?.file_name, "Untitled document"),
  fileUrl: buildFileUrl(document?.file_url),
  rawFileUrl: document?.file_url ?? "",
  docType: asText(document?.doc_type, "General Document"),
  uploadedById: document?.uploaded_by ?? "",
  uploadedByName: buildUserName(document?.users),
  uploadedBy: buildUserName(document?.users),
  uploadedAt: document?.created_at ?? null,
  fileSize: Number(document?.file_size ?? 0),
  status: asText(document?.verification_status, "pending").toLowerCase(),
  rejectionReason: asText(document?.rejection_reason, ""),
  studentName: buildStudentName(document?.students),
  studentEmail: asText(document?.students?.email, ""),
  studentPhone: asText(document?.students?.phone, ""),
});

export const normalizeChecklist = (payload) => {
  const checklist = payload?.checklist ?? {};

  return {
    total: Number(payload?.total ?? 0),
    completed: Number(payload?.completed ?? 0),
    completionPercentage: Number(payload?.completion_percentage ?? 0),
    items: Object.entries(checklist).map(([key, completed]) => ({
      key,
      label: key
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      completed: Boolean(completed),
    })),
  };
};

export const getDocuments = async () => {
  const response = await api.get("/documents");
  const data = unwrapData(response);

  return Array.isArray(data) ? data.map(normalizeDocument) : [];
};

export const getDocumentStats = async () => {
  const response = await api.get("/documents/stats");
  const data = unwrapData(response);

  return {
    total: Number(data?.total ?? 0),
    verified: Number(data?.verified ?? 0),
    pending: Number(data?.pending ?? 0),
    rejected: Number(data?.rejected ?? 0),
  };
};

export const getStudentDocuments = async (studentId) => {
  const response = await api.get(`/documents/student/${studentId}`);
  const data = unwrapData(response);

  return Array.isArray(data) ? data.map(normalizeDocument) : [];
};

export const getDocumentChecklist = async (studentId) => {
  const response = await api.get(`/students/${studentId}/checklist`);

  return normalizeChecklist(unwrapData(response));
};

export const uploadDocument = async ({ studentId, applicationId, docType, file }) => {
  const formData = new FormData();
  formData.append("student_id", studentId);
  formData.append("doc_type", docType);
  formData.append("file", file);

  if (applicationId) {
    formData.append("application_id", applicationId);
  }

  const response = await api.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return normalizeDocument(unwrapData(response));
};

export const verifyDocument = async (id) => {
  const response = await api.put(`/documents/${id}/verify`, {
    verification_status: "verified",
  });

  return normalizeDocument(unwrapData(response));
};

export const rejectDocument = async (id, rejectionReason) => {
  const response = await api.put(`/documents/${id}/reject`, {
    rejection_reason: rejectionReason,
  });

  return normalizeDocument(unwrapData(response));
};

export const deleteDocument = async (id) => {
  const response = await api.delete(`/documents/${id}`);

  return unwrapData(response);
};

export const downloadDocument = async (id, fileName = "document") => {
  const response = await api.get(`/documents/${id}/download`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
