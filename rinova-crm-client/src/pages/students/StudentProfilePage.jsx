import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Award,
  PenLine,
  Eye,
  X,
  Download,
} from "lucide-react";
import * as studentApi from "../../api/studentApi";
import StudentProfileTabs from "../../components/student/StudentProfileTabs";

/* -------------------- Helpers -------------------- */
const getInitials = (name = "Student") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ST";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-GB") : "—";

/* -------------------- UI Components -------------------- */
function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4 transition-colors">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-(--color-muted)">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium text-(--color-text) break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="rounded-xl bg-(--color-surface-muted) p-4 border border-(--color-border)">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-(--color-muted)">
        {title}
      </p>
      <p className="mt-2 text-3xl font-semibold text-(--color-text)">{value}</p>
    </div>
  );
}

const STATUS_STYLES = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-(--color-surface-muted) text-(--color-muted)",
  Pending: "bg-amber-50 text-amber-700",
  Offered: "bg-emerald-50 text-emerald-700",
  Submitted: "bg-(--color-surface-muted) text-(--color-muted)",
  Rejected: "bg-red-50 text-red-600",
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? "bg-(--color-surface-muted) text-(--color-muted)";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
}

const DOC_ICONS = {
  Passport: { icon: FileText, bg: "bg-violet-50", color: "text-violet-600" },
  Transcripts: { icon: Award, bg: "bg-emerald-50", color: "text-emerald-600" },
  default: { icon: PenLine, bg: "bg-amber-50", color: "text-amber-600" },
};

function DocIcon({ type }) {
  const key =
    Object.keys(DOC_ICONS).find((k) =>
      type?.toLowerCase().includes(k.toLowerCase()),
    ) ?? "default";
  const { icon: Icon, bg, color } = DOC_ICONS[key];
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bg}`}
    >
      <Icon size={16} className={color} />
    </div>
  );
}

/* -------------------- Document Viewer Overlay -------------------- */
function DocumentViewer({ doc, onClose }) {
  const isPdf = doc.file_name?.toLowerCase().endsWith(".pdf");
  const isImage = /\.(png|jpe?g|webp|gif|svg)$/i.test(doc.file_name ?? "");

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Panel */}
      <div
        className="relative flex w-full max-w-4xl flex-col rounded-2xl bg-(--color-surface) shadow-2xl"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-(--color-border) px-5 py-4">
          <DocIcon type={doc.document_type} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-(--color-text) truncate">
              {doc.document_type}
            </p>
            <p className="text-xs text-(--color-muted) truncate">
              {doc.file_name || "No file name"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {doc.file_url && (
              <a
                href={doc.file_url}
                download={doc.file_name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-xs font-medium text-(--color-muted) hover:bg-(--color-surface-muted)transition-colors"
              >
                <Download size={13} />
                Download
              </a>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-(--color-muted) hover:bg-(--color-surface-muted) hover:text-(--color-text) transition-colors"
              aria-label="Close viewer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto rounded-b-2xl bg-(--color-surface-muted)">
          {doc.file_url ? (
            isPdf ? (
              <iframe
                src={doc.file_url}
                className="h-full w-full"
                style={{ minHeight: "70vh" }}
                title={doc.file_name}
              />
            ) : isImage ? (
              <div
                className="flex items-center justify-center p-6"
                style={{ minHeight: "60vh" }}
              >
                <img
                  src={doc.file_url}
                  alt={doc.document_type}
                  className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-sm"
                />
              </div>
            ) : (
              /* Unsupported format fallback */
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-surface-muted)">
                  <FileText size={24} className="text-(--color-muted)" />
                </div>
                <div>
                  <p className="text-sm font-medium text-(--color-text)">
                    Preview not available
                  </p>
                  <p className="mt-1 text-xs text-(--color-muted)">
                    This file type can't be previewed. Download it to view.
                  </p>
                </div>
                {doc.file_url && (
                  <a
                    href={doc.file_url}
                    download={doc.file_name}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white hover:bg-violet-700 transition-colors"
                  >
                    <Download size={13} />
                    Download file
                  </a>
                )}
              </div>
            )
          ) : (
            /* No URL fallback */
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-surface-muted)">
                <FileText size={24} className="text-(--color-muted)" />
              </div>
              <div>
                <p className="text-sm font-medium text-(--color-text)">
                  No file attached
                </p>
                <p className="mt-1 text-xs text-(--color-muted)">
                  This document has no file URL.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Main Page -------------------- */
export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingDoc, setViewingDoc] = useState(null); // doc being previewed

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await studentApi.getStudentProfile(id);
        setStudent(data.student);
        setProfile(data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to load student";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* -------------------- Loading -------------------- */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-(--color-border) border-t-violet-600" />
          <p className="mt-3 text-sm text-(--color-muted)">
            Loading student profile…
          </p>
        </div>
      </div>
    );
  }

  /* -------------------- Error -------------------- */
  if (error || !student) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
        {error || "Student not found"}
      </div>
    );
  }

  /* -------------------- Layout -------------------- */
  return (
    <div className="space-y-6">
      {/* Document viewer overlay */}
      {viewingDoc && (
        <DocumentViewer doc={viewingDoc} onClose={() => setViewingDoc(null)} />
      )}

      {/* Back */}
      <button
        onClick={() => navigate("/students")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-muted) hover:text-(--color-text) transition-colors"
      >
        <ArrowLeft size={15} />
        Back to students
      </button>

      {/* MAIN GRID */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* ── LEFT SIDEBAR ── */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-6 h-fit">
          {/* Identity card */}
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-lg font-semibold text-violet-700">
              {getInitials(student.name)}
            </div>
            <h1 className="mt-4 text-base font-semibold text-(--color-text)">
              {student.name}
            </h1>
            <p className="mt-0.5 text-sm text-(--color-muted)">
              {student.preferredCourse}
            </p>
            <div className="mt-3">
              <StatusBadge status={student.status} />
            </div>

            <div className="mt-5 space-y-2 border-t border-(--color-border) pt-5 text-left">
              <p className="flex items-center gap-2.5 text-sm text-(--color-muted)">
                <Mail size={14} className="text-(--color-muted) shrink-0" />
                <span className="truncate">{student.email}</span>
              </p>
              <p className="flex items-center gap-2.5 text-sm text-(--color-muted)">
                <Phone size={14} className="text-(--color-muted) shrink-0" />
                {student.phone}
              </p>
            </div>
          </div>

          {/* Program interest */}
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-(--color-muted) mb-3">
              Program interest
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                {student.preferredCourse}
              </span>
              <span className="inline-flex items-center rounded-full bg-(--color-surface-muted) px-3 py-1 text-xs font-medium text-(--color-text)">
                {student.preferredCountry}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div className="lg:col-span-8 space-y-5">
          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard
              title="Applications"
              value={profile?.summary?.applications ?? 0}
            />
            <MetricCard
              title="Documents"
              value={profile?.summary?.documents ?? 0}
            />
            <MetricCard title="Notes" value={profile?.summary?.notes ?? 0} />
            <MetricCard
              title="Visa cases"
              value={profile?.summary?.visa_applications ?? 0}
            />
          </div>

          {/* Tabs */}
          <StudentProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* ── OVERVIEW ── */}
          {activeTab === "Overview" && (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <DetailItem label="Email" value={student.email} />
              <DetailItem label="Phone" value={student.phone} />
              <DetailItem
                label="Date of birth"
                value={formatDate(student.dob)}
              />
              <DetailItem label="Gender" value={student.gender} />
              <DetailItem label="Nationality" value={student.nationality} />
              <DetailItem
                label="Passport number"
                value={student.passportNumber}
              />
              <DetailItem
                label="Preferred country"
                value={student.preferredCountry}
              />
              <DetailItem
                label="Preferred course"
                value={student.preferredCourse}
              />
              <DetailItem label="Status" value={student.status} />
              <div className="sm:col-span-2">
                <DetailItem label="Address" value={student.address} />
              </div>
              <DetailItem
                label="Created at"
                value={formatDate(student.createdAt)}
              />
            </div>
          )}

          {/* ── APPLICATIONS ── */}
          {activeTab === "Applications" && (
            <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-(--color-border)">
                    {["Institution", "Course", "Intake", "Status", "Date"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-(--color-muted)"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {profile?.applications?.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-(--color-border) last:border-none hover:bg-(--color-surface-muted) transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-(--color-text)">
                        {app.institutions?.name}
                      </td>
                      <td className="px-4 py-3 text-(--color-muted)">
                        {app.courses?.name}
                      </td>
                      <td className="px-4 py-3 text-(--color-muted)">
                        {app.intake || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3 text-(--color-muted)">
                        {formatDate(app.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── DOCUMENTS ── */}
          {activeTab === "Documents" && (
            <div className="space-y-2">
              {profile?.documents?.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 hover:border-(--color-border) transition-colors"
                >
                  <DocIcon type={doc.document_type} />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-(--color-text)">
                      {doc.document_type}
                    </p>
                    <p className="text-xs text-(--color-muted) truncate">
                      {doc.file_name || "No file name"}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-(--color-muted) mr-2">
                    {formatDate(doc.created_at)}
                  </span>

                  <button
                    onClick={() =>
                      setViewingDoc({
                        ...doc,
                        file_url: `${
                          import.meta.env.VITE_API_URL?.replace("/api", "") ||
                          "http://localhost:5000"
                        }/${doc.file_url.replace(/\\/g, "/")}`,
                      })
                    }
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-xs font-medium text-(--color-text) hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                  >
                    <Eye size={13} />
                    View
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── TIMELINE ── */}
          {activeTab === "Timeline" && (
            <div className="space-y-0">
              {profile?.timeline?.map((item, i) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                    {i < profile.timeline.length - 1 && (
                      <div className="mt-1 flex-1 w-px bg-(--color-surface-muted)" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium text-(--color-text)">
                      {item.description}
                    </p>
                    <p className="mt-0.5 text-xs text-(--color-muted)">
                      {[item.users?.first_name, item.users?.last_name]
                        .filter(Boolean)
                        .join(" ") || "System"}
                    </p>
                    <p className="mt-0.5 text-xs text-(--color-muted)">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
