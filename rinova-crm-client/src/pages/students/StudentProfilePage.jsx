import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, GraduationCap, Mail, Phone } from "lucide-react";
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
    <div className="rounded-xl border bg-white p-4 hover:border-violet-200 transition">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900 wrap-break-word">
        {value || "—"}
      </p>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <p className="text-xs font-semibold text-slate-500 uppercase">
        {title}
      </p>
      <div className="mt-3 flex items-end justify-between">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
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
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-violet-600 mx-auto" />
          <p className="mt-2 text-sm text-slate-500">
            Loading student profile...
          </p>
        </div>
      </div>
    );
  }

  /* -------------------- Error -------------------- */
  if (error || !student) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error || "Student not found"}
      </div>
    );
  }

  /* -------------------- Layout -------------------- */
  return (
    <div className="space-y-6">

      {/* Back */}
      <button
        onClick={() => navigate("/students")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
      >
        <ArrowLeft size={17} />
        Back to Students
      </button>

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-12">

        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-6 h-fit">

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-600 to-violet-600 text-white text-xl font-bold">
                {getInitials(student.name)}
              </div>

              <h1 className="mt-4 text-xl font-bold">{student.name}</h1>
              <p className="text-sm text-slate-500">
                {student.preferredCourse}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                {student.status}
              </span>
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-slate-600">
                <Mail size={14} /> {student.email}
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <Phone size={14} /> {student.phone}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Program Interest
            </p>
            <p className="mt-2 font-semibold">{student.preferredCourse}</p>
            <p className="text-sm text-slate-500">
              {student.preferredCountry}
            </p>
          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-8 space-y-6">

          {/* SUMMARY */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Applications"
              value={profile?.summary?.applications || 0}
            />
            <SummaryCard
              title="Documents"
              value={profile?.summary?.documents || 0}
            />
            <SummaryCard
              title="Notes"
              value={profile?.summary?.notes || 0}
            />
            <SummaryCard
              title="Visa Cases"
              value={profile?.summary?.visa_applications || 0}
            />
          </div>

          {/* TABS */}
          <StudentProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* OVERVIEW */}
          {activeTab === "Overview" && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <DetailItem label="Email" value={student.email} />
              <DetailItem label="Phone" value={student.phone} />
              <DetailItem label="Date of Birth" value={formatDate(student.dob)} />
              <DetailItem label="Gender" value={student.gender} />
              <DetailItem label="Nationality" value={student.nationality} />
              <DetailItem label="Passport Number" value={student.passportNumber} />
              <DetailItem label="Preferred Country" value={student.preferredCountry} />
              <DetailItem label="Preferred Course" value={student.preferredCourse} />
              <DetailItem label="Address" value={student.address} />
              <DetailItem label="Created At" value={formatDate(student.createdAt)} />
              <DetailItem label="Status" value={student.status} />
            </div>
          )}

          {/* APPLICATIONS */}
          {activeTab === "Applications" && (
            <div className="rounded-2xl bg-white p-5">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500 border-b">
                  <tr>
                    <th className="py-2">Institution</th>
                    <th>Course</th>
                    <th>Intake</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {profile?.applications?.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-slate-50">
                      <td className="py-3">{app.institutions?.name}</td>
                      <td>{app.courses?.name}</td>
                      <td>{app.intake || "—"}</td>
                      <td>
                        <span className="px-2 py-1 text-xs rounded-full bg-slate-100">
                          {app.status}
                        </span>
                      </td>
                      <td>{formatDate(app.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* DOCUMENTS */}
          {activeTab === "Documents" && (
            <div className="space-y-3">
              {profile?.documents?.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border bg-white p-4"
                >
                  <div>
                    <p className="font-medium">{doc.document_type}</p>
                    <p className="text-xs text-slate-500">
                      {doc.file_name || "No file name"}
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    {formatDate(doc.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TIMELINE */}
          {activeTab === "Timeline" && (
            <div className="space-y-4">
              {profile?.timeline?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border-l-4 border-violet-500 bg-white p-4"
                >
                  <p className="font-semibold">{item.description}</p>
                  <p className="text-sm text-slate-500">
                    {item.users?.first_name || "System"}{" "}
                    {item.users?.last_name || ""}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}