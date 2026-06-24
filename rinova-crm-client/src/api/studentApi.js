import api from "../services/axios";

const unwrapData = (response) => response.data?.data ?? response.data;

const asText = (value, fallback = "Not provided") => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
};

const buildName = (student) =>
  [student?.first_name, student?.middle_name, student?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim() || "Unnamed Student";

const normalizeStudent = (student) => ({
  id: student?.id,
  name: buildName(student),
  firstName: asText(student?.first_name, ""),
  middleName: asText(student?.middle_name, ""),
  lastName: asText(student?.last_name, ""),
  email: asText(student?.email),
  phone: asText(student?.phone),
  dob: student?.date_of_birth ?? null,
  preferredCourse: asText(student?.preferred_course),
  preferredCountry: asText(student?.preferred_country),
  nationality: asText(student?.nationality),
  status: asText(student?.status, "pending"),
  gender: asText(student?.gender),
  passportNumber: asText(student?.passport_number),
  passportExpiry: student?.passport_expiry ?? null,
  createdAt: student?.created_at ?? null,
});

export const getStudents = async () => {
  const response = await api.get("/students");
  const data = unwrapData(response);
  return Array.isArray(data) ? data.map(normalizeStudent) : [];
};

export const getStudentById = async (id) => {
  const response = await api.get(`/students/${id}`);
  return normalizeStudent(unwrapData(response));
};

export const getStudentProfile = async (id) => {
  const response = await api.get(`/students/${id}/profile`);

  return {
    ...response.data,
    student: normalizeStudent(response.data.student),
  };
};
export const createStudent = async (studentData) => {
  const response = await api.post(
    "/students",
    studentData
  );

  return response.data;
};

export const searchStudents = async (search) => {
  const response = await api.get(
    `/students?search=${search}`
  );

  return response.data;
};
export const updateStudent = async (id, payload) => {
  const response = await  api.put(`/students/${id}`, payload);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};
