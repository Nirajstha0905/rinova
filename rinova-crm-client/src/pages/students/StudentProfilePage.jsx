import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileText,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";
import * as studentApi from "../../api/studentApi";
import * as documentApi from "../../api/documentApi";
import * as userApi from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Input, Select } from "../../components/ui/Input";

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

function SectionHeading({ title, description, action }) {
  return (
    <div className="flex flex-col gap-3 border-b border-(--color-border) px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-semibold text-(--color-text)">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-(--color-muted)">{description}</p>
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
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
        {Icon ? <Icon size={13} /> : null}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-(--color-text) break-words">
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
  useEffect(() => {
    if (!open) return undefined;

    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_70px_rgba(15,23,42,0.24)] dark:shadow-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
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

        <div className="space-y-4 p-5 sm:p-6">{children}</div>

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
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
  const isPdf = doc.fileUrl?.toLowerCase().endsWith(".pdf");
  const isImage = /\.(png|jpe?g|webp|gif|svg)$/i.test(doc.fileName ?? "");

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
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
  setFile,
  targetLabel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_70px_rgba(15,23,42,0.24)] dark:shadow-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
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

        <div className="space-y-4 p-5 sm:p-6">
          <label className="block">
            <span className="text-sm font-semibold text-[var(--color-text)]">
              Document type
            </span>
            <Input
              value={docType}
              onChange={(event) => setDocType(event.target.value)}
              className="mt-2"
              placeholder="e.g. Passport, transcript, SOP"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[var(--color-text)]">
              File
            </span>
            <input
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="mt-2 block w-full rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
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

    return documents.filter((doc) => !matchedIds.has(doc.id));
  }, [documents, requiredDocuments]);

  const openPersonalEditor = () => {
    setDraft({
      section: "personal",
      first_name: student?.firstName || "",
      middle_name: student?.middleName || "",
      last_name: student?.lastName || "",
      email: student?.email || "",
      phone: student?.phone || "",
      remark: "",
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

  const closeEditor = () => {
    setEditor(null);
    setDraft({});
    setSubmitting(false);
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

      <Card className="overflow-hidden">
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
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
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

          <Card>
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

          <Card>
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
                <Field label="Date of birth" value={formatDate(student.dob)} />
                <Field label="Gender" value={student.gender} />
                <Field label="Passport number" value={student.passportNumber} />
                <Field
                  label="Passport expiry"
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

          <Card>
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
                className="mt-2"
              />
            </label>
            <label className="block sm:col-span-2">
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
                className="mt-2"
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
                className="mt-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Gender
              </span>
              <Select
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
              </Select>
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
        setFile={setUploadFile}
        targetLabel={uploadTarget}
      />
    </div>
  );
}
