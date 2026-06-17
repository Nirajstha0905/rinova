import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertCircle,
  CheckCircle2,
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

const getInitials = (name = "Student") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ST";

const statusStyles = {
  verified: "border-emerald-100 bg-emerald-50 text-emerald-700",
  pending: "border-amber-100 bg-amber-50 text-amber-700",
  rejected: "border-rose-100 bg-rose-50 text-rose-700",
};

function StatCard({ title, value, helper, icon: Icon, tone }) {
  const tones = {
    violet: "bg-[#f2f0ff] text-[#6d35ff]",
    blue: "bg-[#edf5ff] text-[#2558ff]",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="rounded-2xl border border-[#e4ebf7] bg-white p-5 shadow-[0_16px_35px_rgba(27,39,74,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-70 flex-col items-center justify-center p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2f0ff] text-[#6d35ff]">
        <FileText size={22} />
      </div>
      <p className="mt-3 font-semibold text-slate-950">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
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
      <div className="h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-[#edf1f8] bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#6d35ff]">
                Document Upload
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Add student document
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close upload drawer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Student
            </span>
            <select
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#dfe8f6] bg-[#f8fbff] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#6d35ff] focus:bg-white"
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
            <span className="text-sm font-semibold text-slate-700">
              Document type
            </span>
            <select
              value={docType}
              onChange={(event) => setDocType(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#dfe8f6] bg-[#f8fbff] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#6d35ff] focus:bg-white"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">File</span>
            <div className="mt-2 rounded-3xl border border-dashed border-[#cfdaf0] bg-[#f8fbff] p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2f0ff] text-[#6d35ff]">
                <Upload size={22} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-950">
                {file?.name || "Choose a file to upload"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                PDF, image, or office document up to 10 MB
              </p>
              <input
                type="file"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="mt-4 w-full rounded-xl border border-[#dfe8f6] bg-white px-3 py-2 text-sm text-slate-600"
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
        err.response?.data?.message || err.message || "Failed to load documents";
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
      icon: CheckCircle2,
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
          <p className="mt-2 text-sm text-slate-500">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-3xl border border-[#e4ebf7] bg-white px-6 py-6 shadow-[0_16px_35px_rgba(27,39,74,0.05)] md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2558ff] to-[#9b3bff] text-white shadow-sm shadow-violet-200">
                <ClipboardCheck size={29} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#6d35ff]">
                  Document Module
                </p>
                <h1 className="text-3xl font-bold text-slate-950">
                  Documents
                </h1>
                <p className="mt-1 text-slate-500">
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
          <div className="rounded-2xl border border-[#e4ebf7] bg-white shadow-[0_16px_35px_rgba(27,39,74,0.05)] xl:col-span-2">
            <div className="flex flex-col gap-4 border-b border-[#edf1f8] p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Document Registry
                </h2>
                <p className="text-sm text-slate-500">
                  {filteredDocuments.length} document
                  {filteredDocuments.length === 1 ? "" : "s"} shown
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex w-full items-center gap-2 rounded-xl border border-[#e7edf7] bg-[#f4f6fb] px-3 py-2 md:w-72">
                  <Search size={17} className="text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search documents..."
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#e7edf7] bg-[#f4f6fb] px-3 py-2">
                  <Filter size={17} className="text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="bg-transparent text-sm text-slate-700 outline-none"
                  >
                    <option value="all">All status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
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
                <table className="min-w-full divide-y divide-[#edf1f8]">
                  <thead className="bg-[#f8fbff]">
                    <tr>
                      {[
                        "Document",
                        "Student",
                        "Status",
                        "Uploaded",
                        "Size",
                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf1f8] bg-white">
                    {filteredDocuments.map((doc) => (
                      <tr
                        key={doc.id}
                        className="transition hover:bg-[#f8fbff]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf5ff] text-[#2558ff]">
                              <FileText size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-64 truncate font-semibold text-slate-950">
                                {doc.fileName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatLabel(doc.docType)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2558ff] to-[#9b3bff] text-xs font-bold text-white">
                              {getInitials(doc.studentName)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-950">
                                {doc.studentName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {doc.studentEmail || doc.studentPhone || "No contact"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                              statusStyles[doc.status] || statusStyles.pending
                            }`}
                          >
                            {doc.status}
                          </span>
                          {doc.rejectionReason && (
                            <p className="mt-1 max-w-48 text-xs text-rose-500">
                              {doc.rejectionReason}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(doc.uploadedAt)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatFileSize(doc.fileSize)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {doc.fileUrl && (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4ebf7] text-slate-500 transition hover:border-[#cfdaf0] hover:bg-[#f8fbff] hover:text-[#2558ff]"
                                title="Preview document"
                              >
                                <Eye size={16} />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDownload(doc.id, doc.fileName)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4ebf7] text-slate-500 transition hover:border-[#cfdaf0] hover:bg-[#f8fbff] hover:text-[#2558ff]"
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
            <section className="rounded-2xl border border-[#e4ebf7] bg-white p-5 shadow-[0_16px_35px_rgba(27,39,74,0.05)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2f0ff] text-[#6d35ff]">
                  <UserRound size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    Student Checklist
                  </h3>
                  <p className="text-sm text-slate-500">
                    Required document completion from the server checklist API.
                  </p>
                </div>
              </div>

              <select
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
                className="mt-5 w-full rounded-2xl border border-[#dfe8f6] bg-[#f8fbff] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#6d35ff] focus:bg-white"
              >
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>

              {selectedStudentId && checklist ? (
                <div className="mt-5">
                  <div className="rounded-2xl border border-[#edf1f8] bg-[#f8fbff] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-950">
                        Completion
                      </p>
                      <p className="text-sm font-bold text-[#6d35ff]">
                        {checklist.completionPercentage}%
                      </p>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white">
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
                    <p className="mt-2 text-xs text-slate-500">
                      {checklist.completed} of {checklist.total} required files
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {checklist.items.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between rounded-xl border border-[#edf1f8] bg-white px-3 py-3"
                      >
                        <span className="text-sm font-medium text-slate-700">
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
                <div className="mt-5 rounded-2xl border border-dashed border-[#d9e3f5] bg-[#f8fbff] p-5 text-center text-sm text-slate-500">
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
    </>
  );
}
