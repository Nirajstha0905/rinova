import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight,
  GraduationCap,
  Mail,
  Phone,
  Search,
  Users,
  Plus,
} from "lucide-react";
import * as studentApi from "../../api/studentApi";
import CreateStudentDrawer from "./CreateStudentDrawer";  

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

export default function StudentPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreateStudent, setShowCreateStudent] = useState(false);

  useEffect(() => {
    const request = Promise.resolve()
      .then(async () => {
        setLoading(true);
        setError("");
        const data = await studentApi.getStudents();
        setStudents(data);
      })
      .catch((err) => {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to load students";
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));

    return () => {
      request.catch(() => {});
    };
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;

    return students.filter((student) =>
      [
        student.name,
        student.email,
        student.phone,
        student.preferredCourse,
        student.preferredCountry,
        student.nationality,
        student.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search, students]);

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-3xl border border-[#e4ebf7] bg-white px-6 py-6 shadow-[0_16px_35px_rgba(27,39,74,0.05)] md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2558ff] to-[#9b3bff] text-white shadow-sm shadow-violet-200">
                <GraduationCap size={29} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#6d35ff]">
                  Student Module
                </p>
                <h1 className="text-3xl font-bold text-slate-950">Students</h1>
                <p className="mt-1 text-slate-500">
                  View student contact details, preferred programs, countries,
                  and profile status.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-[#e5ebf7] bg-[#f7f9ff] px-4 py-3">
                <p className="text-xs text-slate-500">Total Students</p>
                <p className="text-xl font-bold text-slate-950">
                  {students.length}
                </p>
              </div>

              <button
                onClick={() => setShowCreateStudent(true)}
                className="flex items-center gap-2 rounded-2xl bg-[#6d35ff] px-5 py-3 text-white font-semibold hover:bg-[#5a29db] transition"
              >
                <Plus size={18} />
                New Student
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e4ebf7] bg-white shadow-[0_16px_35px_rgba(27,39,74,0.05)]">
          <div className="flex flex-col gap-4 border-b border-[#edf1f8] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Student Directory
              </h2>
              <p className="text-sm text-slate-500">
                {filteredStudents.length} student
                {filteredStudents.length === 1 ? "" : "s"} shown
              </p>
            </div>

            <div className="flex w-full items-center gap-2 rounded-xl border border-[#e7edf7] bg-[#f4f6fb] px-3 py-2 md:w-80">
              <Search size={17} className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-violet-600" />
                <p className="mt-2 text-sm text-slate-500">
                  Loading students...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[280px] items-center justify-center p-6">
              <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                <p className="font-semibold text-red-700">
                  Could not load students
                </p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2f0ff] text-[#6d35ff]">
                <Users size={22} />
              </div>
              <p className="mt-3 font-semibold text-slate-950">
                No students found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Try a different search term."
                  : "Student records will appear here once added."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#edf1f8]">
                <thead className="bg-[#f8fbff]">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Student
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Program
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Preferred Country
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Nationality
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Joined
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf1f8] bg-white">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="transition hover:bg-[#f8fbff]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2558ff] to-[#9b3bff] text-sm font-bold text-white">
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-950">
                              {student.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {student.id?.slice(0, 8) || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2 text-slate-700">
                            <Mail size={14} className="text-slate-400" />
                            {student.email}
                          </p>
                          <p className="flex items-center gap-2 text-slate-500">
                            <Phone size={14} className="text-slate-400" />
                            {student.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {student.preferredCourse}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {student.preferredCountry}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {student.nationality}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClass(student.status)}`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(student.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
                        >
                          View Details
                          <ArrowRight size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <CreateStudentDrawer
        open={showCreateStudent}
        onClose={() => setShowCreateStudent(false)}
      />
    </>
  );
}
