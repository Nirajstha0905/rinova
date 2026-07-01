import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Activity,
  Hash,
  BookUser,
  Building2,
  Calendar,
  ClipboardList,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  BriefcaseBusiness,
  Eye,
  FileText,
  FileUp,
  Mail,
  MapPin,
  GraduationCap,
  PencilLine,
  Phone,
  Plus,
  ShieldCheck,
  ShieldAlert,
  User,
  X,
} from "lucide-react";
import ProfileHero from "./ProfileHero";
import ProfileTabs from "./ProfileTabs";
import * as studentApi from "../../../api/studentApi";
import * as documentApi from "../../../api/documentApi";
import * as academicApi from "../../../api/academicRecordApi";
import * as workExperienceApi from "../../../api/workExperienceApi";
import * as userApi from "../../../api/userApi";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent } from "../../../components/ui/Card";
import { Input, Select } from "../../../components/ui/Input";
import { SelectDropdown } from "../../../components/ui/SelectDropdown";
import { usePresenceTransition } from "../../../components/ui/usePresenceTransition";
import TimelineTab from "./TimelineTab";

const localStorageKey = (id, suffix) => `student-profile-${id}-${suffix}`;

const getInitials = (name = "Student") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ST";

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString();
};

const formatDateTime = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
};

const safeText = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : "Not provided";

const normalizeKey = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "");

const formatUserName = (user) =>
  [user?.first_name, user?.middle_name, user?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim() ||
  user?.full_name ||
  user?.name ||
  user?.email ||
  "Unknown user";

const ACADEMIC_LEVELS = [
  "SEE or Equivalent",
  "+2 or Equivalent",
  "Bachelor's Degree",
];
const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "enrolled", label: "Enrolled" },
  { value: "inactive", label: "Inactive" },
];
const ACADEMIC_FIELD_SETS = {
  "SEE or Equivalent": [
    { key: "school_name", label: "School Name" },
    { key: "year_of_completion", label: "Year of Completion", type: "number" },
    { key: "gpa_percentage", label: "GPA / Percentage" },
    { key: "division_grade", label: "Division / Grade" },
  ],
  "+2 or Equivalent": [
    { key: "college_name", label: "College Name" },
    { key: "stream_faculty", label: "Stream / Faculty" },
    { key: "board_university", label: "Board / University" },
    { key: "year_of_completion", label: "Year of Completion", type: "number" },
    { key: "gpa_percentage", label: "GPA / Percentage" },
    { key: "major_subjects", label: "Major Subjects" },
  ],
  "Bachelor's Degree": [
    { key: "university_name", label: "University Name" },
    { key: "affiliated_college", label: "Affiliated College / Campus" },
    { key: "degree_program", label: "Degree Program" },
    { key: "major_specialization", label: "Major / Specialization" },
    { key: "enrollment_date", label: "Enrollment Date", type: "date" },
    { key: "graduation_date", label: "Graduation Date", type: "date" },
    { key: "semester_wise_gpa", label: "Semester-wise GPA" },
    { key: "final_cgpa_percentage", label: "Final CGPA / Percentage" },
    { key: "thesis_title", label: "Thesis / Research Project Title" },
  ],
};

const getStatusClass = (status = "") => {
  const normalized = status.toLowerCase();

  if (normalized.includes("active") || normalized.includes("enrolled")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }
  if (normalized.includes("reject") || normalized.includes("inactive")) {
    return "bg-rose-50 text-rose-700 border-rose-100";
  }
  if (normalized.includes("pending")) {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }

  return "bg-slate-50 text-slate-600 border-slate-200";
};

const describeAcademicRecord = (record) => {
  const level = record?.level || record?.qualification || "Academic record";

  if (level === "SEE or Equivalent") {
    return [
      record?.schoolName || record?.institutionName || "School not set",
      record?.completionYear ? `Completed ${record.completionYear}` : null,
      record?.gpaPercentage ? `GPA : ${record.gpaPercentage} ` : null,
      record?.divisionGrade ? `Grade:  ${record.divisionGrade} %` : null,
    ]
      .filter(Boolean)
      .join("• ");
  }

  if (level === "+2 or Equivalent") {
    return [
      record?.collegeName || record?.institutionName || "College not set",
      record?.streamFaculty || null,
      record?.boardUniversity || null,
      record?.completionYear ? `Completed ${record.completionYear}` : null,
      record?.gpaPercentage ? `GPA / % ${record.gpaPercentage}` : null,
      record?.majorSubjects || null,
    ]
      .filter(Boolean)
      .join("• ");
  }

  return [
    record?.universityName || record?.institutionName || "University not set",
    record?.degreeProgram || null,
    record?.majorSpecialization || null,
    record?.finalCgpaPercentage ? `Final ${record.finalCgpaPercentage}` : null,
    record?.thesisTitle || null,
  ]
    .filter(Boolean)
    .join("• ");
};

const describeWorkExperience = (record) =>
  [
    record?.jobTitle || record?.position || "Job title not set",
    record?.companyName || "Company not set",
    record?.country || null,
    record?.startDate ? `Started ${formatDate(record.startDate)}` : null,
    record?.currentlyWorking
      ? "Currently working"
      : record?.endDate
        ? `Ended ${formatDate(record.endDate)}`
        : null,
  ]
    .filter(Boolean)
    .join("• ");

function SectionHeading({ title, description, action }) {
  return (
    <div className="flex flex-col gap-3 border-b border-(--color-border) px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-[var(--color-primary)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-[var(--color-text)]/75">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function StatCard({ title, value, helper, icon: Icon }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-(--color-muted)">{title}</p>
          <p className="mt-2 text-2xl font-bold text-(--color-text)">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-surface-muted)] text-[var(--color-primary)]">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-xs text-(--color-muted)">{helper}</p>
    </Card>
  );
}

function Field({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-muted) p-4">
      <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-[var(--color-primary)]">
        {Icon ? <Icon size={13} /> : null}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-base font-medium text-(--color-text) break-words">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function SectionModal({
  open,
  title,
  description,
  onClose,
  onSubmit,
  submitting,
  children,
}) {
  const { shouldRender, visible } = usePresenceTransition(open);

  useEffect(() => {
    if (!open) return undefined;

    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-md transition-opacity duration-200 ease-[var(--motion-ease)] ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className={`flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_70px_rgba(15,23,42,0.24)] dark:shadow-none transition-all duration-200 ease-[var(--motion-ease)] ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.985] opacity-0"}`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text)]">
              {title}
            </h3>
            {description ? (
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
            aria-label="Close section editor"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {children}
        </div>

        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function DocumentViewer({ doc, onClose }) {
  const { shouldRender, visible } = usePresenceTransition(Boolean(doc));
  const isPdf = doc.fileUrl?.toLowerCase().endsWith(".pdf");
  const isImage = /\.(png|jpe?g|webp|gif|svg)$/i.test(doc.fileName ?? "");

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-md transition-opacity duration-200 ease-[var(--motion-ease)] ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`relative flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl transition-all duration-200 ease-[var(--motion-ease)] ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.985] opacity-0"}`}
      >
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface-muted)] text-[var(--color-primary)]">
            <FileText size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--color-text)]">
              {doc.displayName || doc.docType}
            </p>
            <p className="truncate text-xs text-[var(--color-muted)]">
              {doc.fileName || "No file name"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {doc.fileUrl ? (
              <a
                href={doc.fileUrl}
                download={doc.fileName}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-medium text-[var(--color-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
              >
                <Download size={13} />
                Download
              </a>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-[var(--color-surface-muted)]">
          {doc.fileUrl ? (
            isPdf ? (
              <iframe
                src={doc.fileUrl}
                className="h-full w-full"
                style={{ minHeight: "70vh" }}
                title={doc.fileName}
              />
            ) : isImage ? (
              <div
                className="flex items-center justify-center p-6"
                style={{ minHeight: "60vh" }}
              >
                <img
                  src={doc.fileUrl}
                  alt={doc.displayName || doc.docType}
                  className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-sm"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface)]">
                  <FileText size={24} className="text-[var(--color-muted)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    Preview not available
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    Download the file to view it.
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface)]">
                <FileText size={24} className="text-[var(--color-muted)]" />
              </div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                No file attached
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UploadDocumentModal({
  open,
  onClose,
  onSubmit,
  submitting,
  docType,
  setDocType,
  file,
  setFile,
  targetLabel,
}) {
  const { shouldRender, visible } = usePresenceTransition(open);
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const isPdf = file?.type === "application/pdf";
  const isImage = file?.type?.startsWith("image/");

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-md transition-opacity duration-200 ease-[var(--motion-ease)] ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className={`flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_70px_rgba(15,23,42,0.24)] dark:shadow-none transition-all duration-200 ease-[var(--motion-ease)] ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.985] opacity-0"}`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text)]">
              Upload document
            </h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {targetLabel || "Add an additional student document"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
            aria-label="Close upload modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid flex-1 gap-6 overflow-y-auto p-5 sm:p-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-primary)]">
                Document type
              </span>
              <Input
                value={docType}
                onChange={(event) => setDocType(event.target.value)}
                className="mt-2 text-base"
                placeholder="e.g. Passport, transcript, SOP"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-primary)]">
                File
              </span>
              <input
                type="file"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="mt-2 block w-full rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </label>

            <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface-muted) p-4">
              <p className="text-sm font-semibold text-[var(--color-primary)]">
                Preview
              </p>
              <p className="mt-1 text-xs text-(--color-muted)">
                The file is only uploaded after you confirm.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface-muted)">
            {file ? (
              isImage ? (
                <img
                  src={previewUrl}
                  alt="Document preview"
                  className="h-full w-full max-h-[60vh] object-contain"
                />
              ) : isPdf ? (
                <iframe
                  src={previewUrl}
                  title="Document preview"
                  className="h-[60vh] w-full"
                />
              ) : (
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
                  <FileText size={28} className="text-[var(--color-primary)]" />
                  <p className="text-sm font-semibold text-(--color-text)">
                    Preview not available
                  </p>
                  <p className="text-xs text-(--color-muted)">{file.name}</p>
                </div>
              )
            ) : (
              <div className="flex min-h-[60vh] items-center justify-center p-6 text-center">
                <p className="text-sm text-(--color-muted)">
                  Choose a file to preview it here.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function AcademicRecordModal({
  open,
  onClose,
  onSubmit,
  submitting,
  draft,
  setDraft,
  files,
  setFiles,
}) {
  const { shouldRender, visible } = usePresenceTransition(open);
  const previewFile = files[0] || null;
  const previewUrl = useMemo(
    () => (previewFile ? URL.createObjectURL(previewFile) : ""),
    [previewFile],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const selectedFields = ACADEMIC_FIELD_SETS[draft.level] || [];
  const isPdf = previewFile?.type === "application/pdf";
  const isImage = previewFile?.type?.startsWith("image/");

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-md transition-opacity duration-200 ease-[var(--motion-ease)] ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className={`flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_70px_rgba(15,23,42,0.24)] dark:shadow-none transition-all duration-200 ease-[var(--motion-ease)] ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.985] opacity-0"}`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text)]">
              Add academic record
            </h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Fill the record and attach the supporting file before confirming.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid flex-1 gap-6 overflow-y-auto p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-primary)]">
                Academic level
              </span>
              <SelectDropdown
                label=""
                value={draft.level}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    level: value,
                    qualification: value,
                  }))
                }
                options={ACADEMIC_LEVELS.map((level) => ({
                  value: level,
                  label: level,
                }))}
                placeholder="Select academic level"
                searchPlaceholder="Search academic level"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              {selectedFields.map((field) => (
                <label key={field.key} className="block">
                  <span className="text-sm font-semibold text-[var(--color-primary)]">
                    {field.label}
                  </span>
                  <Input
                    type={field.type || "text"}
                    value={draft[field.key] || ""}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                    className="mt-2 text-base"
                  />
                </label>
              ))}
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-primary)]">
                Supporting documents
              </span>
              <input
                type="file"
                multiple
                onChange={(event) =>
                  setFiles(Array.from(event.target.files || []))
                }
                className="mt-2 block w-full rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              <p className="mt-2 text-xs text-(--color-muted)">
                Add a grade sheet, transcript, or any other backing file.
              </p>
              {files.length ? (
                <div className="mt-3 space-y-2 rounded-xl border border-(--color-border) bg-[var(--color-surface)] p-3">
                  {files.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="truncate text-sm text-(--color-text)">
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFiles((current) =>
                            current.filter(
                              (_, fileIndex) => fileIndex !== index,
                            ),
                          )
                        }
                        className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-primary)]">
                Remark
              </span>
              <textarea
                value={draft.remark || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    remark: event.target.value,
                  }))
                }
                rows={4}
                className="mt-2 w-full rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)]"
                placeholder="Add a note for the record and attachment"
              />
            </label>
          </div>

          <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface-muted)">
            {previewFile ? (
              isImage ? (
                <img
                  src={previewUrl}
                  alt="Academic document preview"
                  className="h-full w-full max-h-[68vh] object-contain"
                />
              ) : isPdf ? (
                <iframe
                  src={previewUrl}
                  title="Academic document preview"
                  className="h-[68vh] w-full"
                />
              ) : (
                <div className="flex min-h-[68vh] flex-col items-center justify-center gap-3 p-6 text-center">
                  <FileUp size={28} className="text-[var(--color-primary)]" />
                  <p className="text-sm font-semibold text-(--color-text)">
                    Preview not available
                  </p>
                  <p className="text-xs text-(--color-muted)">
                    {previewFile?.name}
                  </p>
                </div>
              )
            ) : (
              <div className="flex min-h-[68vh] items-center justify-center p-6 text-center">
                <p className="text-sm text-(--color-muted)">
                  Choose the backing documents to preview them here.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save record"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function WorkExperienceModal({
  open,
  onClose,
  onSubmit,
  submitting,
  draft,
  setDraft,
  files,
  setFiles,
}) {
  const { shouldRender, visible } = usePresenceTransition(open);
  const previewFile = files[0] || null;
  const previewUrl = useMemo(
    () => (previewFile ? URL.createObjectURL(previewFile) : ""),
    [previewFile],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const isPdf = previewFile?.type === "application/pdf";
  const isImage = previewFile?.type?.startsWith("image/");

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-md transition-opacity duration-200 ease-[var(--motion-ease)] ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className={`flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_70px_rgba(15,23,42,0.24)] dark:shadow-none transition-all duration-200 ease-[var(--motion-ease)] ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.985] opacity-0"}`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text)]">
              Add work experience
            </h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Add employment details and the supporting certificates.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
            aria-label="Close work experience modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid flex-1 gap-6 overflow-y-auto p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-[var(--color-primary)]">
                  Job title
                </span>
                <Input
                  value={draft.job_title || ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      job_title: event.target.value,
                    }))
                  }
                  className="mt-2 text-base"
                  placeholder="e.g. Account Manager"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[var(--color-primary)]">
                  Company name
                </span>
                <Input
                  value={draft.company_name || ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      company_name: event.target.value,
                    }))
                  }
                  className="mt-2 text-base"
                  placeholder="e.g. Bright Future Ltd."
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[var(--color-primary)]">
                  Country
                </span>
                <Input
                  value={draft.country || ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      country: event.target.value,
                    }))
                  }
                  className="mt-2 text-base"
                  placeholder="e.g. Nepal"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[var(--color-primary)]">
                  Employment start
                </span>
                <Input
                  type="date"
                  value={draft.start_date || ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      start_date: event.target.value,
                    }))
                  }
                  className="mt-2 text-base"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[var(--color-primary)]">
                  Employment end
                </span>
                <Input
                  type="date"
                  value={draft.end_date || ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      end_date: event.target.value,
                    }))
                  }
                  className="mt-2 text-base"
                  disabled={Boolean(draft.currently_working)}
                />
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-4 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(draft.currently_working)}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      currently_working: event.target.checked,
                      end_date: event.target.checked ? "" : current.end_date,
                    }))
                  }
                  className="h-4 w-4 rounded border-(--color-border) text-[var(--color-primary)]"
                />
                <span className="text-sm font-semibold text-(--color-text)">
                  Currently working
                </span>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-primary)]">
                Responsibilities
              </span>
              <textarea
                value={draft.responsibilities || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    responsibilities: event.target.value,
                  }))
                }
                rows={5}
                className="mt-2 w-full rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)]"
                placeholder="Summarize what the role involved"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-primary)]">
                Experience certificates
              </span>
              <input
                type="file"
                multiple
                onChange={(event) =>
                  setFiles(Array.from(event.target.files || []))
                }
                className="mt-2 block w-full rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              <p className="mt-2 text-xs text-(--color-muted)">
                You can attach more than one certificate.
              </p>
              {files.length ? (
                <div className="mt-3 space-y-2 rounded-xl border border-(--color-border) bg-[var(--color-surface)] p-3">
                  {files.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="truncate text-sm text-(--color-text)">
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFiles((current) =>
                            current.filter(
                              (_, fileIndex) => fileIndex !== index,
                            ),
                          )
                        }
                        className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </label>
          </div>

          <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface-muted)">
            {previewFile ? (
              isImage ? (
                <img
                  src={previewUrl}
                  alt="Certificate preview"
                  className="h-full w-full max-h-[68vh] object-contain"
                />
              ) : isPdf ? (
                <iframe
                  src={previewUrl}
                  title="Certificate preview"
                  className="h-[68vh] w-full"
                />
              ) : (
                <div className="flex min-h-[68vh] flex-col items-center justify-center gap-3 p-6 text-center">
                  <BriefcaseBusiness
                    size={28}
                    className="text-[var(--color-primary)]"
                  />
                  <p className="text-sm font-semibold text-(--color-text)">
                    Preview not available
                  </p>
                  <p className="text-xs text-(--color-muted)">
                    {previewFile.name}
                  </p>
                </div>
              )
            ) : (
              <div className="flex min-h-[68vh] items-center justify-center p-6 text-center">
                <p className="text-sm text-(--color-muted)">
                  Choose certificate files to preview them here.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save experience"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasAnyRole } = useAuth();

  const [profile, setProfile] = useState(null);
  const [student, setStudent] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingDoc, setViewingDoc] = useState(null);
  const [editor, setEditor] = useState(null);
  const [draft, setDraft] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [localRemarks, setLocalRemarks] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(null);
  const [uploadDocType, setUploadDocType] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [academicOpen, setAcademicOpen] = useState(false);
  const [academicDraft, setAcademicDraft] = useState({
    level: "SEE or Equivalent",
  });
  const [academicFiles, setAcademicFiles] = useState([]);
  const [academicSubmitting, setAcademicSubmitting] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const [workDraft, setWorkDraft] = useState({
    job_title: "",
    company_name: "",
    country: "",
    start_date: "",
    end_date: "",
    currently_working: false,
    responsibilities: "",
  });
  const [workFiles, setWorkFiles] = useState([]);
  const [workSubmitting, setWorkSubmitting] = useState(false);
  const storageReadyRef = useRef(false);
  const canVerifyDocuments = hasAnyRole([
    "Documentation Officer",
    "Documentation Officers",
  ]);

  const loadStudentProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [profileData, checklistData, usersData] = await Promise.all([
        studentApi.getStudentProfile(id),
        documentApi.getDocumentChecklist(id).catch(() => null),
        userApi.getUsers().catch(() => []),
      ]);

      setStudent(profileData.student);
      setProfile(profileData);
      setChecklist(checklistData);
      setUsers(usersData);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to load student";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const request = Promise.resolve().then(loadStudentProfile);
    return () => {
      request.catch(() => {});
    };
  }, [loadStudentProfile]);

  useEffect(() => {
    if (!id) return;
    const request = Promise.resolve().then(() => {
      storageReadyRef.current = false;

      try {
        const remarks = window.localStorage.getItem(
          localStorageKey(id, "remarks"),
        );
        setLocalRemarks(remarks ? JSON.parse(remarks) : []);
      } catch {
        setLocalRemarks([]);
      }

      storageReadyRef.current = true;
    });

    return () => {
      request.catch(() => {});
    };
  }, [id]);

  const activityFeed = useMemo(() => {
    const serverNotes = (profile?.notes ?? []).map((note) => ({
      id: note.id,
      label: "Note",
      title: note.content,
      createdAt: note.created_at,
      author:
        [note.users?.first_name, note.users?.last_name]
          .filter(Boolean)
          .join(" ") || "System",
    }));

    const edits = localRemarks.map((entry) => ({
      id: entry.id,
      label: entry.section,
      title: entry.remark,
      createdAt: entry.createdAt,
      author: "You",
    }));

    return [...edits, ...serverNotes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [localRemarks, profile?.notes]);

  const userNameById = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.id] = formatUserName(user);
      return acc;
    }, {});
  }, [users]);

  const documents = useMemo(() => {
    return (profile?.documents ?? []).map((doc) => {
      const normalized = documentApi.normalizeDocument(doc);

      return {
        ...normalized,
        displayName: normalized.docType,
      };
    });
  }, [profile?.documents]);

  const requiredDocuments = useMemo(() => {
    const checklistItems = checklist?.items ?? [];

    return checklistItems.map((item) => {
      const matched = documents.find(
        (doc) =>
          normalizeKey(doc.docType) === normalizeKey(item.key) ||
          normalizeKey(doc.docType) === normalizeKey(item.label),
      );

      return {
        key: item.key,
        label: item.label,
        completed: item.completed,
        document: matched || null,
      };
    });
  }, [checklist?.items, documents]);

  const additionalDocuments = useMemo(() => {
    const matchedIds = new Set(
      requiredDocuments.map((item) => item.document?.id).filter(Boolean),
    );

    return documents.filter((doc) => {
      const key = normalizeKey(doc.docType);
      const isAcademicAttachment = key.includes("academic");
      const isWorkAttachment = key.includes("experiencecertificate");
      return (
        !matchedIds.has(doc.id) && !isAcademicAttachment && !isWorkAttachment
      );
    });
  }, [documents, requiredDocuments]);

  const academicRecords = useMemo(() => {
    return (profile?.academic_records ?? []).map((record) =>
      academicApi.normalizeAcademicRecord(record),
    );
  }, [profile?.academic_records]);

  const workExperiences = useMemo(() => {
    return (profile?.work_experiences ?? []).map((experience) =>
      workExperienceApi.normalizeWorkExperience(experience),
    );
  }, [profile?.work_experiences]);

  const openPersonalEditor = () => {
    setDraft({
      section: "personal",
      first_name: student?.firstName || "",
      middle_name: student?.middleName || "",
      last_name: student?.lastName || "",
      email: student?.email || "",
      phone: student?.phone || "",
      remark: "",
      status: student?.status || "",
    });
    setEditor({ section: "personal" });
  };

  const openOtherEditor = () => {
    setDraft({
      section: "other",
      date_of_birth: student?.dob ? student.dob.slice(0, 10) : "",
      gender: student?.gender || "",
      nationality: student?.nationality || "",
      passport_number: student?.passportNumber || "",
      passport_expiry: student?.passportExpiry
        ? student.passportExpiry.slice(0, 10)
        : "",
      preferred_country: student?.preferredCountry || "",
      preferred_course: student?.preferredCourse || "",
      address: profile?.student?.address || "",
      remark: "",
    });
    setEditor({ section: "other" });
  };

  const openUploadModal = (docType = "", targetLabel = "") => {
    setUploadTarget(targetLabel || docType || "Additional document");
    setUploadDocType(docType || "");
    setUploadFile(null);
    setUploadOpen(true);
  };

  const openAcademicModal = () => {
    setAcademicDraft({
      level: "SEE or Equivalent",
      qualification: "SEE or Equivalent",
      remark: "",
      school_name: "",
      college_name: "",
      university_name: "",
      affiliated_college: "",
      institution_name: "",
      country: "",
      stream_faculty: "",
      board_university: "",
      degree_program: "",
      major_specialization: "",
      major_subjects: "",
      thesis_title: "",
      semester_wise_gpa: "",
      final_cgpa_percentage: "",
      gpa_percentage: "",
      division_grade: "",
      year_of_completion: "",
      enrollment_date: "",
      graduation_date: "",
    });
    setAcademicFiles([]);
    setAcademicOpen(true);
  };

  const openWorkModal = () => {
    setWorkDraft({
      job_title: "",
      company_name: "",
      country: "",
      start_date: "",
      end_date: "",
      currently_working: false,
      responsibilities: "",
    });
    setWorkFiles([]);
    setWorkOpen(true);
  };

  const closeEditor = () => {
    setEditor(null);
    setDraft({});
    setSubmitting(false);
  };

  const closeAcademicModal = () => {
    setAcademicOpen(false);
    setAcademicFiles([]);
    setAcademicSubmitting(false);
  };

  const closeWorkModal = () => {
    setWorkOpen(false);
    setWorkFiles([]);
    setWorkSubmitting(false);
  };

  const pushRemark = (section, remark) => {
    if (!remark?.trim()) return;

    setLocalRemarks((current) => [
      {
        id: `${section}-${Date.now()}`,
        section,
        remark: remark.trim(),
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editor) return;

    if (!draft.remark?.trim()) {
      toast.error("Please add a remark for this edit");
      return;
    }

    try {
      setSubmitting(true);

      if (editor.section === "personal") {
        if (
          !draft.first_name?.trim() ||
          !draft.last_name?.trim() ||
          !draft.email?.trim()
        ) {
          toast.error("First name, last name, and email are required");
          return;
        }

        await studentApi.updateStudent(id, {
          first_name: draft.first_name?.trim() || null,
          middle_name: draft.middle_name?.trim() || null,
          last_name: draft.last_name?.trim() || null,
          email: draft.email?.trim() || null,
          phone: draft.phone?.trim() || null,
          status: draft.status || null,
        });

        toast.success("Personal information updated");
        pushRemark("Personal", draft.remark);
        await loadStudentProfile();
      } else if (editor.section === "other") {
        await studentApi.updateStudent(id, {
          date_of_birth: draft.date_of_birth || null,
          gender: draft.gender || null,
          nationality: draft.nationality || null,
          passport_number: draft.passport_number || null,
          passport_expiry: draft.passport_expiry || null,
          preferred_country: draft.preferred_country || null,
          preferred_course: draft.preferred_course || null,
          address: draft.address || null,
        });

        toast.success("Student details updated");
        pushRemark("Other", draft.remark);
        await loadStudentProfile();
      }

      closeEditor();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!uploadDocType.trim()) {
      toast.error("Document type is required");
      return;
    }

    if (!uploadFile) {
      toast.error("Please choose a file to upload");
      return;
    }

    try {
      setUploading(true);
      await documentApi.uploadDocument({
        studentId: id,
        docType: uploadDocType.trim(),
        file: uploadFile,
      });
      toast.success("Document uploaded");
      setUploadOpen(false);
      setUploadTarget(null);
      setUploadDocType("");
      setUploadFile(null);
      await loadStudentProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleAcademicSubmit = async (event) => {
    event.preventDefault();

    if (!academicDraft.remark?.trim()) {
      toast.error("Please add a remark for this academic record");
      return;
    }

    if (!academicFiles.length) {
      toast.error("Please choose at least one backing document");
      return;
    }

    try {
      setAcademicSubmitting(true);

      const [primaryFile, ...extraFiles] = academicFiles;
      const uploadedDocuments = [];
      const uploadedDocument = await documentApi.uploadDocument({
        studentId: id,
        docType: `Academic - ${academicDraft.level}`,
        file: primaryFile,
      });
      uploadedDocuments.push(uploadedDocument);

      const payload = {
        student_id: id,
        document_id: uploadedDocument.id,
        level: academicDraft.level,
        qualification: academicDraft.qualification || academicDraft.level,
        institution_name:
          academicDraft.school_name ||
          academicDraft.college_name ||
          academicDraft.university_name ||
          academicDraft.institution_name ||
          null,
        school_name: academicDraft.school_name || null,
        college_name: academicDraft.college_name || null,
        university_name: academicDraft.university_name || null,
        affiliated_college: academicDraft.affiliated_college || null,
        country: academicDraft.country || null,
        stream_faculty: academicDraft.stream_faculty || null,
        board_university: academicDraft.board_university || null,
        degree_program: academicDraft.degree_program || null,
        major_specialization: academicDraft.major_specialization || null,
        major_subjects: academicDraft.major_subjects || null,
        thesis_title: academicDraft.thesis_title || null,
        semester_wise_gpa: academicDraft.semester_wise_gpa || null,
        final_cgpa_percentage: academicDraft.final_cgpa_percentage || null,
        gpa_percentage: academicDraft.gpa_percentage || null,
        division_grade: academicDraft.division_grade || null,
        start_year: academicDraft.start_year || null,
        completion_year:
          academicDraft.year_of_completion ||
          academicDraft.completion_year ||
          null,
        enrollment_date: academicDraft.enrollment_date || null,
        graduation_date: academicDraft.graduation_date || null,
        grade: academicDraft.division_grade || academicDraft.grade || null,
      };

      try {
        await academicApi.createAcademicRecord(payload);
      } catch (recordError) {
        await Promise.all(
          uploadedDocuments.map((item) =>
            documentApi.deleteDocument(item.id).catch(() => {}),
          ),
        );
        throw recordError;
      }

      for (let index = 0; index < extraFiles.length; index += 1) {
        const extraDocument = await documentApi.uploadDocument({
          studentId: id,
          docType: `Academic - ${academicDraft.level} - Attachment ${index + 2}`,
          file: extraFiles[index],
        });
        uploadedDocuments.push(extraDocument);
      }

      pushRemark("Academic", academicDraft.remark);
      toast.success("Academic record saved");
      closeAcademicModal();
      await loadStudentProfile();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save academic record",
      );
    } finally {
      setAcademicSubmitting(false);
    }
  };

  const handleWorkSubmit = async (event) => {
    event.preventDefault();

    if (!workDraft.company_name?.trim() || !workDraft.job_title?.trim()) {
      toast.error("Company name and job title are required");
      return;
    }

    try {
      setWorkSubmitting(true);

      const createdWork = await workExperienceApi.createWorkExperience({
        student_id: id,
        position: workDraft.job_title.trim(),
        job_title: workDraft.job_title.trim(),
        company_name: workDraft.company_name.trim(),
        country: workDraft.country.trim() || null,
        start_date: workDraft.start_date || null,
        end_date: workDraft.currently_working
          ? null
          : workDraft.end_date || null,
        currently_working: workDraft.currently_working,
        responsibilities: workDraft.responsibilities.trim() || null,
      });

      const attachedDocuments = [];
      for (let index = 0; index < workFiles.length; index += 1) {
        const document = await documentApi.uploadDocument({
          studentId: id,
          docType: `Experience certificate - ${workDraft.company_name} - ${index + 1}`,
          file: workFiles[index],
        });
        attachedDocuments.push(document);
      }

      toast.success("Work experience saved");
      pushRemark(
        "Work experience",
        `${workDraft.job_title.trim()} at ${workDraft.company_name.trim()} was added`,
      );
      closeWorkModal();
      await loadStudentProfile();
      return { createdWork, attachedDocuments };
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save work experience",
      );
    } finally {
      setWorkSubmitting(false);
    }
  };

  const formatUploader = (doc) => {
    if (doc.uploadedByName && doc.uploadedByName !== "Unknown user") {
      return doc.uploadedByName;
    }

    const resolved =
      userNameById[doc.uploadedById || doc.uploadedBy || doc.createdById] ||
      userNameById[doc.uploaded_by || doc.created_by] ||
      doc.uploadedBy ||
      doc.uploadedById ||
      "System";

    return safeText(resolved);
  };

  const fileUrlForView = (doc) =>
    doc.fileUrl ||
    (doc.rawFileUrl
      ? `${(
          import.meta.env.VITE_API_URL || "http://localhost:5000/api"
        ).replace(/\/api\/?$/, "")}/${doc.rawFileUrl.replace(/\\/g, "/")}`
      : "");

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-(--color-border) border-t-[var(--color-primary)]" />
          <p className="mt-3 text-sm text-(--color-muted)">
            Loading student profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
        {error || "Student not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {viewingDoc ? (
        <DocumentViewer doc={viewingDoc} onClose={() => setViewingDoc(null)} />
      ) : null}

      <button
        type="button"
        onClick={() => navigate("/students")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-muted) transition-colors hover:text-(--color-text)"
      >
        <ArrowLeft size={15} />
        Back to students
      </button>
      <ProfileHero
        student={student}
        applications={profile}
        documents={documents}
        getInitials={getInitials}
        onEdit={() => openPersonalEditor(true)}
      />
      {/* <Card className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-(--color-border) p-5 lg:border-b-0 lg:border-r">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--color-primary)] text-lg font-bold text-white">
                  {getInitials(student.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-primary)]">
                    Student Profile
                  </p>
                  <h1 className="mt-1 text-3xl font-bold text-(--color-text)">
                    {student.name}
                  </h1>
                  <p className="mt-1 text-sm text-(--color-muted)">
                    {student.preferredCourse || "No preferred course set"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                        student.status,
                      )}`}
                    >
                      {student.status}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-medium text-(--color-muted)">
                      {student.preferredCountry || "Preferred country not set"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openPersonalEditor}
                >
                  <PencilLine size={15} />
                  Personal
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openUploadModal("", "Additional document")}
                >
                  <FileText size={15} />
                  Upload
                </Button>
                <Button variant="secondary" size="sm" onClick={openOtherEditor}>
                  <ShieldCheck size={15} />
                  Other
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Field label="Email" value={student.email} icon={Mail} />
              <Field label="Phone" value={student.phone} icon={Phone} />
              <Field
                label="Nationality"
                value={student.nationality}
                icon={MapPin}
              />
              <Field
                label="Joined"
                value={formatDate(student.createdAt)}
                icon={CalendarDays}
              />
            </div>
          </div>

          <div className="grid gap-0 p-5">
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                title="Applications"
                value={profile?.summary?.applications ?? 0}
                helper="Linked applications"
                icon={Clock3}
              />
              <StatCard
                title="Documents"
                value={profile?.summary?.documents ?? 0}
                helper="Uploaded files"
                icon={FileText}
              />
              <StatCard
                title="Notes"
                value={profile?.summary?.notes ?? 0}
                helper="Profile notes"
                icon={PencilLine}
              />
              <StatCard
                title="Visa cases"
                value={profile?.summary?.visa_applications ?? 0}
                helper="Tracked visa records"
                icon={CheckCircle2}
              />
            </div>
          </div>
        </div>
      </Card> */}
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className={activeTab === "personal" ? "" : "hidden"}>
            <SectionHeading
              title="Personal Information"
              description="Core contact details for the student record."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openPersonalEditor}
                >
                  <PencilLine size={15} />
                  Edit section
                </Button>
              }
            />
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <Field label="First name" value={student.firstName} />
                <Field label="Middle name" value={student.middleName} />
                <Field label="Last name" value={student.lastName} />
                <Field label="Email" value={student.email} />
                <Field label="Phone" value={student.phone} />
                <Field
                  label="Created at"
                  value={formatDate(student.createdAt)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className={activeTab === "documents" ? "" : "hidden"}>
            <SectionHeading
              title="Documents"
              description="Required and additional documents for this student."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openUploadModal("", "Additional document")}
                >
                  <Plus size={15} />
                  Add document
                </Button>
              }
            />
            <CardContent className="space-y-5">
              {checklist ? (
                <div className="space-y-3">
                  {requiredDocuments.map((item) => {
                    const doc = item.document;
                    const missing = !doc;
                    const fileUrl = doc ? fileUrlForView(doc) : "";
                    return (
                      <div
                        key={item.key}
                        className={`rounded-2xl border p-4 transition ${
                          missing
                            ? "border-rose-200 bg-rose-50/80"
                            : "border-(--color-border) bg-(--color-surface-muted)"
                        }`}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-(--color-text)">
                                {item.label}
                              </p>
                              {missing ? (
                                <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                                  Missing
                                </span>
                              ) : (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                  {doc.status || "pending"}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-(--color-text)">
                              {missing
                                ? "Required document not uploaded yet."
                                : doc.fileName}
                            </p>
                            <p className="mt-1 text-xs text-(--color-muted)">
                              Created at{" "}
                              {missing
                                ? "Not available"
                                : formatDate(doc.uploadedAt)}{" "}
                              by{" "}
                              {missing ? "Not available" : formatUploader(doc)}
                            </p>
                            {!missing && doc.remark ? (
                              <p className="mt-1 text-xs text-(--color-muted)">
                                Remark: {doc.remark}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 md:justify-end">
                            {missing ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  openUploadModal(item.key, item.label)
                                }
                              >
                                <Plus size={14} />
                                Upload
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    setViewingDoc({ ...doc, fileUrl })
                                  }
                                >
                                  <Eye size={14} />
                                  View
                                </Button>
                                {canVerifyDocuments &&
                                !String(doc.status || "")
                                  .toLowerCase()
                                  .includes("verified") ? (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        await documentApi.verifyDocument(
                                          doc.id,
                                        );
                                        toast.success("Document verified");
                                        await loadStudentProfile();
                                      } catch (err) {
                                        toast.error(
                                          err.response?.data?.message ||
                                            "Failed to verify document",
                                        );
                                      }
                                    }}
                                  >
                                    <CheckCircle2 size={14} />
                                    Verify
                                  </Button>
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {additionalDocuments.length ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-(--color-text)">
                      Additional documents
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openUploadModal("", "Additional document")}
                    >
                      <Plus size={14} />
                      Add additional
                    </Button>
                  </div>

                  {additionalDocuments.map((doc) => {
                    const fileUrl = fileUrlForView(doc);
                    return (
                      <div
                        key={doc.id}
                        className="rounded-2xl border border-(--color-border) bg-(--color-surface-muted) p-4"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-(--color-text)">
                              {doc.docType}
                            </p>
                            <p className="mt-1 text-sm text-(--color-text)">
                              {doc.fileName}
                            </p>
                            <p className="mt-1 text-xs text-(--color-muted)">
                              Created at {formatDate(doc.uploadedAt)} by{" "}
                              {formatUploader(doc)}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 md:justify-end">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setViewingDoc({ ...doc, fileUrl })}
                            >
                              <Eye size={14} />
                              View
                            </Button>
                            {canVerifyDocuments &&
                            !String(doc.status || "")
                              .toLowerCase()
                              .includes("verified") ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await documentApi.verifyDocument(doc.id);
                                    toast.success("Document verified");
                                    await loadStudentProfile();
                                  } catch (err) {
                                    toast.error(
                                      err.response?.data?.message ||
                                        "Failed to verify document",
                                    );
                                  }
                                }}
                              >
                                <CheckCircle2 size={14} />
                                Verify
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {!requiredDocuments.length && !additionalDocuments.length ? (
                <div className="rounded-2xl border border-dashed border-(--color-border) p-6 text-center text-sm text-(--color-muted)">
                  No documents uploaded yet.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className={activeTab === "documents" ? "" : "hidden"}>
            <SectionHeading
              title="Work Experience"
              description="Employment history and supporting certificates."
              action={
                <Button variant="secondary" size="sm" onClick={openWorkModal}>
                  <BriefcaseBusiness size={15} />
                  Add experience
                </Button>
              }
            />
            <CardContent className="space-y-3">
              {workExperiences.length ? (
                workExperiences.map((record) => {
                  const attachedDocuments = documents.filter(
                    (doc) =>
                      normalizeKey(doc.docType).includes(
                        "experiencecertificate",
                      ) &&
                      normalizeKey(doc.docType).includes(
                        normalizeKey(record.companyName),
                      ),
                  );

                  return (
                    <div
                      key={record.id}
                      className="rounded-2xl border border-(--color-border) bg-(--color-surface-muted) p-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-[var(--color-primary)]">
                              {record.jobTitle ||
                                record.position ||
                                "Job title not set"}
                            </p>
                            <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-xs font-semibold text-(--color-text)">
                              {record.currentlyWorking
                                ? "Currently working"
                                : "Completed"}
                            </span>
                          </div>
                          <p className="mt-2 text-base font-medium text-(--color-text)">
                            {describeWorkExperience(record)}
                          </p>
                          <p className="mt-1 text-sm text-(--color-muted)">
                            {record.responsibilities ||
                              "No responsibilities added yet."}
                          </p>
                          <p className="mt-2 text-xs text-(--color-muted)">
                            Certificates: {attachedDocuments.length || 0}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:justify-end">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={openWorkModal}
                          >
                            <PencilLine size={14} />
                            Update
                          </Button>
                        </div>
                      </div>
                      {attachedDocuments.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {attachedDocuments.map((doc) => (
                            <Button
                              key={doc.id}
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                setViewingDoc({
                                  ...doc,
                                  fileUrl: fileUrlForView(doc),
                                })
                              }
                            >
                              <Eye size={14} />
                              {doc.docType}
                            </Button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-(--color-border) p-6 text-center text-sm text-(--color-muted)">
                  No work experience added yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={activeTab === "academic" ? "" : "hidden"}>
            <SectionHeading
              title="Academic"
              description="Educational history with the backing document attached to each record."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openAcademicModal}
                >
                  <GraduationCap size={15} />
                  Add academic
                </Button>
              }
            />
            <CardContent className="space-y-3">
              {academicRecords.length ? (
                academicRecords.map((record) => {
                  const attachedDocs = documents.filter(
                    (doc) =>
                      normalizeKey(doc.docType).includes("academic") &&
                      normalizeKey(doc.docType).includes(
                        normalizeKey(record.level),
                      ),
                  );

                  return (
                    <div
                      key={record.id}
                      className="rounded-2xl border border-(--color-border) bg-(--color-surface-muted) p-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-[var(--color-primary)]">
                              {record.level ||
                                record.qualification ||
                                "Academic record"}
                            </p>
                            <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-xs font-semibold text-(--color-text)">
                              {record.completionYear || "In progress"}
                            </span>
                          </div>
                          <p className="mt-2 text-base font-medium text-(--color-text)">
                            {describeAcademicRecord(record)}
                          </p>
                          <p className="mt-1 text-sm text-(--color-muted)">
                            {attachedDocs.length
                              ? `${attachedDocs.length} supporting document${attachedDocs.length === 1 ? "" : "s"} attached`
                              : "No supporting documents linked"}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 md:justify-end">
                          {attachedDocs.length
                            ? attachedDocs.map((doc) => (
                                <Button
                                  key={doc.id}
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    setViewingDoc({
                                      ...doc,
                                      fileUrl: fileUrlForView(doc),
                                    })
                                  }
                                >
                                  <Eye size={14} />
                                  {doc.docType}
                                </Button>
                              ))
                            : null}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={openAcademicModal}
                          >
                            <PencilLine size={14} />
                            Add / update
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-(--color-border) p-6 text-center text-sm text-(--color-muted)">
                  No academic records yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={activeTab === "personal" ? "" : "hidden"}>
            <SectionHeading
              title="Other Details"
              description="Additional profile data such as passport, course interest, and address."
              action={
                <Button variant="secondary" size="sm" onClick={openOtherEditor}>
                  <ShieldCheck size={15} />
                  Edit section
                </Button>
              }
            />
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <Field
                  label="Date of birth"
                  icon={Calendar}
                  value={formatDate(student.dob)}
                />
                <Field label="Gender" value={student.gender} />
                <Field
                  label="Passport number"
                  icon={Hash}
                  value={student.passportNumber}
                />
                <Field
                  label="Passport expiry"
                  icon={Clock3}
                  value={formatDate(student.passportExpiry)}
                />
                <Field
                  label="Preferred country"
                  value={student.preferredCountry}
                />
                <Field
                  label="Preferred course"
                  value={student.preferredCourse}
                />
                <div className="xl:col-span-3">
                  <Field label="Address" value={profile?.student?.address} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={activeTab === "personal" ? "" : "hidden"}>
            <SectionHeading
              title="Applications"
              description="Linked applications pulled from the server."
            />
            <CardContent className="overflow-x-auto p-0">
              <table className="min-w-full text-sm">
                <thead className="bg-(--color-surface-muted)">
                  <tr className="border-b border-(--color-border)">
                    {["Institution", "Course", "Intake", "Status", "Date"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-(--color-muted)"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(profile?.applications ?? []).map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-(--color-border) last:border-none hover:bg-(--color-surface-muted)"
                    >
                      <td className="px-5 py-3 font-medium text-(--color-text)">
                        {app.institutions?.name || "Not available"}
                      </td>
                      <td className="px-5 py-3 text-(--color-muted)">
                        {app.courses?.name || "Not available"}
                      </td>
                      <td className="px-5 py-3 text-(--color-muted)">
                        {app.intake || "Not available"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClass(
                            app.status,
                          )}`}
                        >
                          {app.status || "pending"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-(--color-muted)">
                        {formatDate(app.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className={activeTab === "timeline" ? "" : "hidden"}>
            <TimelineTab timeline={profile.timeline} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <SectionHeading
              title="Recent Remarks"
              description="Section edits and profile notes appear here."
            />
            <CardContent className="space-y-4">
              {activityFeed.length ? (
                activityFeed.slice(0, 8).map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-primary)]">
                      <PencilLine size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-(--color-text)">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm text-(--color-muted)">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-(--color-muted)">
                        {item.author} - {formatDateTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-(--color-muted)">No remarks yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <SectionHeading
              title="Quick Facts"
              description="A compact snapshot of the student record."
            />
            <CardContent className="space-y-3">
              <Field
                label="Student ID"
                value={student.id?.slice(0, 8) || "Not available"}
              />
              <Field label="Record type" value="Student profile" />
              <Field label="Status" value={student.status} />
              <Field label="Created" value={formatDate(student.createdAt)} />
            </CardContent>
          </Card>
        </div>
      </div>

      <SectionModal
        open={Boolean(editor?.section)}
        title={
          editor?.section === "personal"
            ? "Edit personal information"
            : "Edit other details"
        }
        description="Add a remark with every edit so the change history stays clear."
        onClose={closeEditor}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        {editor?.section === "personal" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                First name
              </span>
              <Input
                value={draft.first_name || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    first_name: event.target.value,
                  }))
                }
                placeholder="Enter first name"
                className="mt-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Middle name
              </span>
              <Input
                value={draft.middle_name || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    middle_name: event.target.value,
                  }))
                }
                placeholder="Enter middle name"
                className="mt-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Last name
              </span>
              <Input
                value={draft.last_name || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    last_name: event.target.value,
                  }))
                }
                placeholder="Enter last name"
                className="mt-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Email
              </span>
              <Input
                type="email"
                value={draft.email || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="Enter email address"
                className="mt-2"
              />
            </label>
            <label className="block ">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Phone
              </span>
              <Input
                value={draft.phone || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder="Enter phone number"
                className="mt-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Status
              </span>
              <SelectDropdown
                value={student.status}
                onChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
                options={STATUSES}
                placeholder="Select status"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Remark
              </span>
              <textarea
                value={draft.remark || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    remark: event.target.value,
                  }))
                }
                rows={4}
                className="mt-2 w-full rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)]"
                placeholder="What changed?"
              />
            </label>
          </div>
        ) : null}

        {editor?.section === "other" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Date of birth
              </span>
              <Input
                type="date"
                value={draft.date_of_birth || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    date_of_birth: event.target.value,
                  }))
                }
                placeholder="Select date of birth"
                className="mt-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Gender
              </span>
              <SelectDropdown
                value={draft.gender || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    gender: event.target.value,
                  }))
                }
                className="mt-2 w-full"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </SelectDropdown>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Nationality
              </span>
              <Input
                value={draft.nationality || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    nationality: event.target.value,
                  }))
                }
                className="mt-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Passport number
              </span>
              <Input
                value={draft.passport_number || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    passport_number: event.target.value,
                  }))
                }
                className="mt-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Passport expiry
              </span>
              <Input
                type="date"
                value={draft.passport_expiry || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    passport_expiry: event.target.value,
                  }))
                }
                className="mt-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Preferred country
              </span>
              <Input
                value={draft.preferred_country || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    preferred_country: event.target.value,
                  }))
                }
                className="mt-2"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Preferred course
              </span>
              <Input
                value={draft.preferred_course || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    preferred_course: event.target.value,
                  }))
                }
                className="mt-2"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Address
              </span>
              <textarea
                value={draft.address || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                rows={3}
                className="mt-2 w-full rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)]"
                placeholder="Street, city, region"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Remark
              </span>
              <textarea
                value={draft.remark || ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    remark: event.target.value,
                  }))
                }
                rows={4}
                className="mt-2 w-full rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)]"
                placeholder="Note the reason for this update"
              />
            </label>
          </div>
        ) : null}
      </SectionModal>

      <UploadDocumentModal
        open={uploadOpen}
        onClose={() => {
          setUploadOpen(false);
          setUploadTarget(null);
          setUploadDocType("");
          setUploadFile(null);
        }}
        onSubmit={handleUpload}
        submitting={uploading}
        docType={uploadDocType}
        setDocType={setUploadDocType}
        file={uploadFile}
        setFile={setUploadFile}
        targetLabel={uploadTarget}
      />

      <AcademicRecordModal
        open={academicOpen}
        onClose={closeAcademicModal}
        onSubmit={handleAcademicSubmit}
        submitting={academicSubmitting}
        draft={academicDraft}
        setDraft={setAcademicDraft}
        files={academicFiles}
        setFiles={setAcademicFiles}
      />

      <WorkExperienceModal
        open={workOpen}
        onClose={closeWorkModal}
        onSubmit={handleWorkSubmit}
        submitting={workSubmitting}
        draft={workDraft}
        setDraft={setWorkDraft}
        files={workFiles}
        setFiles={setWorkFiles}
      />
    </div>
  );
}
