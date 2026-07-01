import api from "../services/axios";

const unwrapData = (response) => response.data?.data ?? response.data;

const asText = (value, fallback = "") => {
  if (typeof value !== "string") return fallback;
  return value.trim() || fallback;
};

const asNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
};

export const normalizeAcademicRecord = (record) => ({
  id: record?.id,
  studentId: record?.student_id ?? "",
  documentId: record?.document_id ?? "",
  level: asText(record?.level, ""),
  qualification: asText(record?.qualification, ""),
  schoolName: asText(record?.school_name, ""),
  collegeName: asText(record?.college_name, ""),
  universityName: asText(record?.university_name, ""),
  affiliatedCollege: asText(record?.affiliated_college, ""),
  institutionName: asText(record?.institution_name, ""),
  country: asText(record?.country, ""),
  streamFaculty: asText(record?.stream_faculty, ""),
  boardUniversity: asText(record?.board_university, ""),
  degreeProgram: asText(record?.degree_program, ""),
  majorSpecialization: asText(record?.major_specialization, ""),
  majorSubjects: asText(record?.major_subjects, ""),
  thesisTitle: asText(record?.thesis_title, ""),
  semesterWiseGpa: asText(record?.semester_wise_gpa, ""),
  finalCgpaPercentage: asText(record?.final_cgpa_percentage, ""),
  gpaPercentage: asText(record?.gpa_percentage, ""),
  divisionGrade: asText(record?.division_grade, ""),
  startYear: asNumber(record?.start_year),
  completionYear: asNumber(record?.completion_year),
  enrollmentDate: record?.enrollment_date ?? null,
  graduationDate: record?.graduation_date ?? null,
  grade: asText(record?.grade, ""),
  document: record?.documents ?? null,
});

export const getAcademicRecords = async () => {
  const response = await api.get("/academic-records");
  const data = unwrapData(response);
  return Array.isArray(data) ? data.map(normalizeAcademicRecord) : [];
};

export const createAcademicRecord = async (payload) => {
  const response = await api.post("/academic-records", payload);
  return normalizeAcademicRecord(unwrapData(response));
};

export const updateAcademicRecord = async (id, payload) => {
  const response = await api.put(`/academic-records/${id}`, payload);
  return normalizeAcademicRecord(unwrapData(response));
};

