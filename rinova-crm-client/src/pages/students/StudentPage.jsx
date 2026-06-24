import { useCallback, useEffect, useMemo, useState } from "react";
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
  SquarePen,
  Trash2
} from "lucide-react";
import * as studentApi from "../../api/studentApi";
import CreateStudentDrawer from "./CreateStudentDrawer";
import EditStudentDrawer from "./EditStudentDrawer";

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
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditDrawer, setShowEditDrawer] = useState(false);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentApi.getStudents();
      setStudents(data);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to load students";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const request = Promise.resolve().then(loadStudents);
    return () => {
      request.catch(() => {});
    };
  }, [loadStudents]);

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
        student.passportNumber,
        student.id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search, students]);
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this student?");

    if (!confirmed) return;

    try {
      await studentApi.deleteStudent(id);

      toast.success("Student deleted");

      loadStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete student");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) px-6 py-6 shadow-[0_16px_35px_rgba(27,39,74,0.05)] md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#2558ff] to-[#9b3bff] text-white shadow-sm shadow-violet-200">
                <GraduationCap size={29} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#6d35ff]">
                  Student Module
                </p>
                <h1 className="text-3xl font-bold text-(--color-text)">Students</h1>
                <p className="mt-1 text-(--color-muted)">
                  View student contact details, preferred programs, countries,
                  and profile status.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-muted) px-4 py-3">
                <p className="text-xs text-(--color-muted)">Total Students</p>
                <p className="text-xl font-bold text-(--color-text)">
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

        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-[0_16px_35px_rgba(27,39,74,0.05)]">
          <div className="flex flex-col gap-4 border-b border-(--color-border) p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-(--color-text)">
                Student Directory
              </h2>
              <p className="text-sm text-(--color-muted)">
                {filteredStudents.length} student
                {filteredStudents.length === 1 ? "" : "s"} shown
              </p>
            </div>

            <div className="flex w-full items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 md:w-80">
              <Search size={17} className="text-(--color-muted)" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full bg-transparent text-sm text-(--color-text) outline-none placeholder:text-(--color-muted)"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-70 items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-violet-600" />
                <p className="mt-2 text-sm text-(--color-muted)">
                  Loading students...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-70 items-center justify-center p-6">
              <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                <p className="font-semibold text-red-700">
                  Could not load students
                </p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex min-h-70 flex-col items-center justify-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2f0ff] text-[#6d35ff]">
                <Users size={22} />
              </div>
              <p className="mt-3 font-semibold text-(--color-text)">
                No students found
              </p>
              <p className="mt-1 text-sm text-(--color-muted)">
                {search
                  ? "Try a different search term."
                  : "Student records will appear here once added."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed divide-y divide-(--color-border)">
                <thead className="bg-(--color-surface-muted)">
                  <tr>
                    <th className="w-[22%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                      Student
                    </th>
                    <th className="w-[22%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                      Contact
                    </th>
                    <th className="w-[20%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                      Program
                    </th>
                    <th className="w-[12%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                      Preferred Country
                    </th>
                    <th className="w-[12%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                      Nationality
                    </th>
                    <th className="w-[10%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                      Status
                    </th>
                    <th className="w-[10%] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-(--color-muted)">
                      Joined
                    </th>
                    <th
                      colSpan={3}
                      className="w-[14%] px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-(--color-muted)"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--color-border) bg-(--color-surface)">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="transition hover:bg-(--color-surface-muted)"
                    >
                      <td className="px-5 py-3 " >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#2558ff] to-[#9b3bff] text-sm font-bold text-white">
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <p className="font-medium text-(--color-text)">
                              {student.name}
                            </p>
                            <p className="text-xs text-(--color-muted)">
                              ID: {student.id?.slice(0, 8) || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2 text-(--color-text)">
                            <Mail size={14} className="text-(--color-muted)" />
                            {student.email}
                          </p>
                          <p className="flex items-center gap-2 text-(--color-muted)">
                            <Phone size={14} className="text-(--color-muted)" />
                            {student.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-2 text-sm font-medium text-(--color-text)">
                        {student.preferredCourse}
                      </td>
                      <td className="px-5 py-2 text-sm text-(--color-text)">
                        {student.preferredCountry}
                      </td>
                      <td className="px-5 py-2 text-sm text-(--color-text)">
                        {student.nationality}
                      </td>
                      <td className="px-5 py-2">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClass(student.status)}`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-5 py-2 text-sm text-(--color-muted)">
                        {formatDate(student.createdAt)}
                      </td>
                      <td className="px-5 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowEditDrawer(true);
                          }}
                          className="rounded-xl border px-3 py-2 text-sm text-(--color-text) border-(--color-border) transition hover:bg-(--color-primary) hover:text-(--color-surface) "
                        >
                          <SquarePen size={20} />
                        </button>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-700"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </td>
                      <td className="px-5 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
                        >
                          View
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
        onSuccess={loadStudents}
      />
      <EditStudentDrawer
        open={showEditDrawer}
        student={selectedStudent}
        onClose={() => setShowEditDrawer(false)}
        onSuccess={loadStudents}
      />
    </>
  );
}
