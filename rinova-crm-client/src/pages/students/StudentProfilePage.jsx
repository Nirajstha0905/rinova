import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, GraduationCap, Mail, Phone } from "lucide-react";
import * as studentApi from "../../api/studentApi";
import StudentProfileTabs from "../../components/student/StudentProfileTabs";

const getInitials = (name = "Student") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ST";
function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#edf1f8] bg-[#f8fbff] p-4">
         
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>   
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>   
    </div>
  );
}
function SummaryCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}
export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const request = Promise.resolve()
      .then(async () => {
        setLoading(true);
        setError("");
        const data = await studentApi.getStudentProfile(id);
        setStudent(data.student);
        setProfile(data);
      })
      .catch((err) => {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to load student";
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
    return () => {
      request.catch(() => { });
    };
  }, [id]);
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
           
        <div className="text-center">
             
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-violet-600" />   
          <p className="mt-2 text-sm text-slate-500">
            Loading student profile...
          </p>   
        </div>   
      </div>
    );
  }
  if (error || !student) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
           
        {error || "Student not found"}   
      </div>
    );
  }
  return (
    <div className="space-y-6">
         
      <button
        type="button"
        onClick={() => navigate("/students")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
      >
           
        <ArrowLeft size={17} /> Back to Students   
      </button>   
      
      <div className="rounded-3xl border border-[#e4ebf7] bg-white px-6 py-6 shadow-[0_16px_35px_rgba(27,39,74,0.05)] md:px-8">
           
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
             
          <div className="flex items-center gap-4">
               
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-[#2558ff] to-[#9b3bff] text-lg font-bold text-white">
                 
              {getInitials(student.name)}   
            </div>   
            <div>
                 
              <p className="text-sm font-semibold text-[#6d35ff]">
                Student Profile
              </p>   
              <h1 className="text-3xl font-bold text-slate-950">
                {student.name}
              </h1>   
              <p className="mt-1 text-slate-500">
                {student.preferredCourse}
              </p>   
            </div>   
          </div>   
          <span className="inline-flex w-fit rounded-full border border-[#e4ebf7] bg-[#f8fbff] px-3 py-1 text-sm font-semibold capitalize text-slate-700">
               
            {student.status}   
          </span>   
        </div>   
      </div>   
      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          title="Applications"
          value={profile?.summary?.applications || 0}
        />

        <SummaryCard title="Documents" value={profile.summary.documents} />

        <SummaryCard title="Notes" value={profile.summary.notes} />

        <SummaryCard
          title="Visa Cases"
          value={profile.summary.visa_applications}
        />
      </div>
      <StudentProfileTabs
  activeTab={activeTab}
  setActiveTab={setActiveTab}
/>
{activeTab === "Overview" && (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <DetailItem
        label="Email"
        value={student.email}
      />

      <DetailItem
        label="Phone"
        value={student.phone}
      />

      <DetailItem
        label="Nationality"
        value={student.nationality}
      />

      <DetailItem
        label="Preferred Country"
        value={student.preferredCountry}
      />

      <DetailItem
        label="Preferred Course"
        value={student.preferredCourse}
      />

      <DetailItem
        label="Passport Number"
        value={student.passportNumber}
      />
    </div>
  </div>
)} 
{activeTab === "Applications" && (
  <div className="rounded-2xl bg-white p-5">
    <table className="w-full">
      <thead>
        <tr>
          <th>Institution</th>
          <th>Course</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {profile.applications.map((app) => (
          <tr key={app.id}>
            <td>{app.institutions?.name}</td>
            <td>{app.courses?.name}</td>
            <td>{app.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{activeTab === "Documents" && (
  <div className="space-y-3">
    {profile.documents.map((doc) => (
      <div
        key={doc.id}
        className="rounded-xl border p-4"
      >
        <p className="font-medium">
          {doc.document_type}
        </p>
      </div>
    ))}
  </div>
)}

{activeTab === "Timeline" && (
  <div className="space-y-4">
    {profile.timeline.map((item) => (
      <div
        key={item.id}
        className="rounded-xl border-l-4 border-violet-500 bg-white p-4"
      >
        <p className="font-semibold">
          {item.description}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {item.users?.first_name}{" "}
          {item.users?.last_name}
        </p>

        <p className="text-xs text-slate-400">
          {new Date(
            item.created_at
          ).toLocaleString()}
        </p>
      </div>
    ))}
  </div>
)}
      <div className="grid gap-4 md:grid-cols-2">
           
        <div className="rounded-2xl border border-[#e4ebf7] bg-white p-6 shadow-[0_16px_35px_rgba(27,39,74,0.05)]">
             
          <div className="flex items-center gap-3">
               
            <GraduationCap className="text-[#6d35ff]" size={22} />   
            <div>
                 
              <h2 className="font-semibold text-slate-950">
                Program Interest
              </h2>   
              <p className="text-sm text-slate-500">
                {student.preferredCourse}
              </p>   
            </div>   
          </div>   
        </div>   
        
        <div className="rounded-2xl border border-[#e4ebf7] bg-white p-6 shadow-[0_16px_35px_rgba(27,39,74,0.05)]">
             
          <div className="space-y-2 text-sm">
               
            <p className="flex items-center gap-2 text-slate-700">
                 
              <Mail size={16} className="text-slate-400" /> {student.email}   
            </p>   
            <p className="flex items-center gap-2 text-slate-700">
                 
              <Phone size={16} className="text-slate-400" />
              {student.phone}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
