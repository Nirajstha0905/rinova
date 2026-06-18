import { useCallback, useEffect, useMemo, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import {
  AlertCircle,
  CircleCheckBig,
  Clock3,
  ClipboardCheck,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import * as documentApi from "../../api/documentApi";
import * as studentApi from "../../api/studentApi";

const DOCUMENT_TYPES = [
  "passport",
  "transcript",
  "ielts",
  "cv",
  "sop",
  "offer_letter",
  "financial_documents",
  "work_experience",
];

const formatLabel = (value = "") =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString();
};

const formatFileSize = (bytes = 0) => {
  if (!bytes) return "Unknown size";
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getStatusConfig = (doc) => {
  switch (doc.status) {
    case "verified":
      return {
        icon: CircleCheckBig,
        classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        label: `Verified${
          doc.verifiedByName ? ` • ${doc.verifiedByName}` : ""
        }`,
      };

    case "rejected":
      return {
        icon: AlertCircle,
        classes: "bg-rose-50 text-rose-700 border border-rose-200",
        label: `Rejected${
          doc.rejectedByName ? ` • ${doc.rejectedByName}` : ""
        }`,
      };

    default:
      return {
        icon: Clock3,
        classes: "bg-amber-50 text-amber-700 border border-amber-200",
        label: "Pending",
      };
  }
};

const statusStyles = {
  verified: "border-emerald-100 bg-emerald-50 text-emerald-700",
  pending: "border-amber-100 bg-amber-50 text-amber-700",
  rejected: "border-rose-100 bg-rose-50 text-rose-700",
};

function StatCard({ title, value, helper, icon: Icon, tone }) {
  const tones = {
    violet: "bg-[#f2f0ff] text-[#6d35ff]",
    blue: "bg-(--color-surface) text-[#2558ff]",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-[0_16px_35px_rgba(27,39,74,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-(--color-muted)">{title}</p>
          <p className="mt-2 text-3xl font-bold text-(--color-text)">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 text-xs text-(--color-muted)">{helper}</p>
    </div>
  );
}

function StudentDropdown({ students, selectedStudentId, onChange }) {
  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const [query, setQuery] = useState("");
  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return students;

    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [students, query]);
  return (
    <Menu as="div" className="relative w-full">
      <MenuButton className="flex w-full items-center justify-between rounded-2xl border border-(--color-border) bg-(--color-surface-muted) px-4 py-2 text-sm text-(--color-text)">
        <span>{selectedStudent?.name || "Select student"}</span>
        <ChevronDownIcon className="h-4 w-4 text-(--color-muted)" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom"
        className="
              z-50 mt-2 w-(--button-width)
              max-h-40 overflow-y-auto
              rounded-2xl border border-(--color-border)
            bg-(--color-surface) p-2 shadow-xl outline-none"
      >
        {/* SEARCH BOX */}
        <div className="sticky top-0 z-10 bg-(--color-surface) p-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student..."
            className="w-full rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-1.5 text-xs outline-none focus:border-[#6d35ff] focus:bg-(--color-surface)"
          />
        </div>
        {filteredStudents.map((student) => (
          <MenuItem key={student.id}>
            <button
              onClick={() => onChange(student.id)}
              className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm
                data-focus:bg-(--color-surface-muted)
                ${
                  selectedStudentId === student.id
                    ? "bg-[#f2f0ff] text-[#6d35ff] font-semibold"
                    : "text-(--color-text)"
                }`}
            >
              {student.name}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-70 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2f0ff] text-[#6d35ff]">
        <FileText size={22} />
      </div>
      <p className="mt-3 font-semibold text-(--color-text)">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-(--color-muted)">
        {description}
      </p>
    </div>
  );
}

function UploadDrawer({ open, students, onClose, onSuccess }) {
  const [studentId, setStudentId] = useState("");
  const [docType, setDocType] = useState(DOCUMENT_TYPES[0]);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setStudentId("");
    setDocType(DOCUMENT_TYPES[0]);
    setFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!studentId) {
      toast.error("Please select a student");
      return;
    }

    if (!file) {
      toast.error("Please choose a document file");
      return;
    }

    try {
      setSubmitting(true);
      await documentApi.uploadDocument({
        studentId,
        docType,
        file,
      });
      toast.success("Document uploaded successfully");
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload document",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-sm">
      <div className="h-full w-full max-w-lg overflow-y-auto bg-(--color-surface) shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-(--color-border) bg-(--color-surface) px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#6d35ff]">
                Document Upload
              </p>
              <h2 className="mt-1 text-2xl font-bold text-(--color-text)">
                Add student document
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-(--color-muted) transition hover:bg-(--color-surface-muted) hover:text-(--color-text)"
              aria-label="Close upload drawer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <label className="block">
            <span className="text-sm font-semibold text-(--color-text)">
              Student
            </span>
            <select
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-(--color-border) bg-(--color-surface-muted) px-4 py-3 text-sm text-(--color-text) outline-none transition focus:border-[#6d35ff] focus:bg-(--color-surface)"
            >
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-(--color-text)">
              Document type
            </span>
            <select
              value={docType}
              onChange={(event) => setDocType(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-(--color-border) bg-(--color-surface-muted) px-4 py-3 text-sm text-(--color-text) outline-none transition focus:border-[#6d35ff] focus:bg-(--color-surface)"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-(--color-text)">
              File
            </span>
            <div className="mt-2 rounded-3xl border border-dashed border-(--color-border) bg-(--color-surface-muted) p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2f0ff] text-[#6d35ff]">
                <Upload size={22} />
              </div>
              <p className="mt-3 text-sm font-semibold text-(--color-text)">
                {file?.name || "Choose a file to upload"}
              </p>
              <p className="mt-1 text-xs text-(--color-muted)">
                PDF, image, or office document up to 10 MB
              </p>
              <input
                type="file"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="mt-4 w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-muted)"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6d35ff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a29db] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <RefreshCw size={17} className="animate-spin" />
            ) : (
              <Upload size={17} />
            )}
            {submitting ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DocumentPage() {
  const [documents, setDocuments] = useState([]);
  const [students, setStudents] = useState([]);
  const [checklist, setChecklist] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const computedStats = useMemo(
    () => ({
      total: documents.length,
      verified: documents.filter((doc) => doc.status === "verified").length,
      pending: documents.filter((doc) => doc.status === "pending").length,
      rejected: documents.filter((doc) => doc.status === "rejected").length,
    }),
    [documents],
  );

  const loadDocuments = useCallback(async () => {
    try {
      setError("");
      const data = await documentApi.getDocuments();
      setDocuments(data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load documents";
      setError(message);
      toast.error(message);
    }
  }, []);

  const loadPageData = useCallback(async () => {
    try {
      setLoading(true);
      const [documentData, studentData] = await Promise.all([
        documentApi.getDocuments(),
        studentApi.getStudents(),
      ]);
      setDocuments(documentData);
      setStudents(studentData);
      setSelectedStudentId((current) => current || studentData[0]?.id || "");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load document module";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const request = Promise.resolve().then(loadPageData);
    return () => {
      request.catch(() => {});
    };
  }, [loadPageData]);

  useEffect(() => {
    if (!selectedStudentId) {
      return;
    }

    const request = documentApi
      .getDocumentChecklist(selectedStudentId)
      .then(setChecklist)
      .catch(() => setChecklist(null));

    return () => {
      request.catch(() => {});
    };
  }, [selectedStudentId]);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return documents.filter((doc) => {
      const matchesSearch =
        !query ||
        [
          doc.fileName,
          doc.docType,
          doc.studentName,
          doc.studentEmail,
          doc.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" || doc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [documents, search, statusFilter]);

  const handleVerify = async (documentId) => {
    try {
      setActionLoadingId(documentId);
      await documentApi.verifyDocument(documentId);
      toast.success("Document verified");
      await loadDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify document");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleReject = async (documentId) => {
    const reason = window.prompt("Reason for rejection?");
    if (reason === null) return;

    try {
      setActionLoadingId(documentId);
      await documentApi.rejectDocument(
        documentId,
        reason.trim() || "Document rejected",
      );
      toast.success("Document rejected");
      await loadDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject document");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm("Delete this document?");
    if (!confirmed) return;

    try {
      setActionLoadingId(documentId);
      await documentApi.deleteDocument(documentId);
      toast.success("Document deleted");
      await loadDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete document");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      setActionLoadingId(documentId);
      await documentApi.downloadDocument(documentId, fileName);
    } catch (err) {
      toast.error(err.response?.data?.message || "Download failed");
    } finally {
      setActionLoadingId("");
    }
  };

  const stats = [
    {
      title: "Total Documents",
      value: computedStats.total,
      helper: "Active uploaded files",
      icon: FileText,
      tone: "blue",
    },
    {
      title: "Pending Review",
      value: computedStats.pending,
      helper: "Waiting for verification",
      icon: AlertCircle,
      tone: "amber",
    },
    {
      title: "Verified",
      value: computedStats.verified,
      helper: "Approved student files",
      icon: CircleCheckBig,
      tone: "green",
    },
    {
      title: "Rejected",
      value: computedStats.rejected,
      helper: "Needs student action",
      icon: XCircle,
      tone: "rose",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-violet-600" />
          <p className="mt-2 text-sm text-(--color-muted)">
            Loading documents...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) px-6 py-6 shadow-[0_16px_35px_rgba(27,39,74,0.05)] md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#2558ff] to-[#9b3bff] text-white shadow-sm shadow-violet-200">
                <ClipboardCheck size={29} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#6d35ff]">
                  Document Module
                </p>
                <h1 className="text-3xl font-bold text-(--color-text)">
                  Documents
                </h1>
                <p className="mt-1 text-(--color-muted)">
                  Upload, verify, reject, and track student document readiness.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#6d35ff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a29db]"
            >
              <Plus size={18} />
              Upload Document
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-[0_16px_35px_rgba(27,39,74,0.05)] xl:col-span-2">
            <div className="flex flex-col gap-4 border-b border-(--color-border) p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-(--color-text)">
                  Document Registry
                </h2>
                <p className="text-sm text-(--color-muted)">
                  {filteredDocuments.length} document
                  {filteredDocuments.length === 1 ? "" : "s"} shown
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex w-full items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 md:w-72">
                  <Search size={17} className="text-(--color-muted)" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search documents..."
                    className="w-full bg-transparent text-sm text-(--color-text) outline-none placeholder:text-(--color-muted)"
                  />
                </div>
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) hover:bg-(--color-surface)">
                    <Filter size={17} className="text-(--color-muted)" />

                    {statusFilter === "all"
                      ? "All Status"
                      : formatLabel(statusFilter)}

                    <ChevronDownIcon className="h-4 w-4 text-(--color-muted)" />
                  </MenuButton>

                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="z-50 mt-2 w-48 origin-top-right rounded-2xl border border-(--color-border) bg-(--color-surface) p-2 shadow-xl outline-none transition
      data-closed:scale-95
      data-closed:opacity-0"
                  >
                    {[
                      { value: "all", label: "All Status" },
                      { value: "pending", label: "Pending" },
                      { value: "verified", label: "Verified" },
                      { value: "rejected", label: "Rejected" },
                    ].map((option) => (
                      <MenuItem key={option.value}>
                        <button
                          onClick={() => setStatusFilter(option.value)}
                          className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition
            data-focus:bg-(--color-surface-muted)
            ${
              statusFilter === option.value
                ? "bg-[#f2f0ff] font-semibold text-[#6d35ff]"
                : "text-(--color-text)"
            }`}
                        >
                          {option.label}
                        </button>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>

            {error ? (
              <div className="p-6">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                  {error}
                </div>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <EmptyState
                title="No documents found"
                description={
                  search || statusFilter !== "all"
                    ? "Try changing the search or status filter."
                    : "Uploaded student documents will appear here."
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-(--color-border)">
                  <thead className="bg-(--color-surface-muted)">
                    <tr>
                      {[
                        "Document",
                        "Document Type",
                        "Student",
                        "Status",
                        "Uploaded",
                        "Size",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-(--color-muted)"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--color-border) bg-(--color-surface)">
                    {filteredDocuments.map((doc) => (
                      <tr
                        key={doc.id}
                        className="transition hover:bg-(--color-surface-muted)"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--color-surface) text-[#2558ff]">
                              <FileText size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-64 truncate text-[13px] font-semibold text-(--color-text)">
                                {" "}
                                {doc.fileName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-xl bg-(--color-surface-muted) px-3 py-1 text-xs font-medium text-(--color-text)">
                            {formatLabel(doc.docType)}
                          </span>
                        </td>
                        <td className="px-5 py-4 min-w-52">
                          <div>
                            <p className="font-medium text-(--color-text)">
                              {doc.studentName}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {(() => {
                            const status = getStatusConfig(doc);
                            const StatusIcon = status.icon;

                            return (
                              <>
                                <div
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status.classes}`}
                                >
                                  <StatusIcon size={14} />
                                  {status.label}
                                </div>

                                {doc.rejectionReason && (
                                  <p className="mt-1 text-xs text-rose-500">
                                    {doc.rejectionReason}
                                  </p>
                                )}
                              </>
                            );
                          })()}
                        </td>
                        <td className="px-5 py-4 text-sm text-(--color-muted)">
                          {formatDate(doc.uploadedAt)}
                        </td>
                        <td className="px-5 py-4 text-sm text-(--color-muted)">
                          {formatFileSize(doc.fileSize)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {doc.fileUrl && (
                              <button
                                type="button"
                                onClick={() => setPreviewUrl(doc.fileUrl)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text) transition hover:text-(--color-primary) hover:bg-(--color-surface-muted)"
                                title="Preview document"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                handleDownload(doc.id, doc.fileName)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text) transition hover:bg-(--color-surface-muted) hover:text-(--color-primary)"
                              title="Download document"
                              disabled={actionLoadingId === doc.id}
                            >
                              <Download size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVerify(doc.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                              title="Verify document"
                              disabled={actionLoadingId === doc.id}
                            >
                              <ShieldCheck size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(doc.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                              title="Reject document"
                              disabled={actionLoadingId === doc.id}
                            >
                              <XCircle size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(doc.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                              title="Delete document"
                              disabled={actionLoadingId === doc.id}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-[0_16px_35px_rgba(27,39,74,0.05)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2f0ff] text-[#6d35ff]">
                  <UserRound size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-(--color-text)">
                    Student Checklist
                  </h3>
                  <p className="text-sm text-(--color-muted)">
                    Track required documents and completion progress for each
                    student.
                  </p>
                </div>
              </div>

              <StudentDropdown
                students={students}
                selectedStudentId={selectedStudentId}
                onChange={setSelectedStudentId}
              />

              {selectedStudentId && checklist ? (
                <div className="mt-5">
                  <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-muted) p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-(--color-text)">
                        Completion
                      </p>
                      <p className="text-sm font-bold text-[#6d35ff]">
                        {checklist.completionPercentage}%
                      </p>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-(--color-surface)">
                      <div
                        className="h-2 rounded-full bg-[#6d35ff]"
                        style={{
                          width: `${Math.min(
                            checklist.completionPercentage,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-(--color-muted)">
                      {checklist.completed} of {checklist.total} required files
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {checklist.items.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between rounded-xl border border-(--color-border) bg-(--color-surface) px-3 py-3"
                      >
                        <span className="text-sm font-medium text-(--color-text)">
                          {item.label}
                        </span>
                        {item.completed ? (
                          <FileCheck2 size={18} className="text-emerald-600" />
                        ) : (
                          <XCircle size={18} className="text-rose-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface-muted) p-5 text-center text-sm text-(--color-muted)">
                  Select a student to view document requirements.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <UploadDrawer
        open={uploadOpen}
        students={students}
        onClose={() => setUploadOpen(false)}
        onSuccess={loadPageData}
      />
      {previewUrl && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="relative h-[90vh] w-[95vw] overflow-hidden rounded-3xl bg-(--color-surface)">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute right-4 top-4 z-10 rounded-xl bg-(--color-surface) p-2 shadow-lg"
            >
              <X size={18} />
            </button>

            <iframe
              src={previewUrl}
              title="Document Preview"
              className="h-full w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
