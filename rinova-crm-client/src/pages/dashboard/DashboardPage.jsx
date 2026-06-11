import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight,
  BellRing,
  Briefcase,
  CalendarClock,
  FileCheck2,
  FilePlus2,
  FileText,
  GraduationCap,
  ListChecks,
  PieChart,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import RecentActivities from "../../components/dashboard/RecentActivities";
import UpcomingTasks from "../../components/dashboard/UpcomingTasks";
import * as dashboardApi from "../../api/dashboardApi";
import { useAuth } from "../../context/AuthContext";

const chartColors = ["#2558ff", "#6d35ff", "#9b3bff", "#69a7ff", "#b4c6ff"];

const formatDate = (value) => {
  if (!value) return "No date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "No date" : date.toLocaleDateString();
};

function MetricCard({ title, value, helper, icon: Icon, tone = "violet" }) {
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
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function Panel({ title, subtitle, children, action }) {
  return (
    <section className="rounded-2xl border border-[#e4ebf7] bg-white p-6 shadow-[0_16px_35px_rgba(27,39,74,0.05)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-[#d9e3f5] bg-[#f8fbff] text-sm text-slate-500">
      {text}
    </div>
  );
}

function ApplicationStatusChart({ data }) {
  const chartData = data.filter((item) => item.count > 0);

  if (chartData.length === 0) {
    return <EmptyState text="No application status data yet" />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData}>
        <CartesianGrid stroke="#e7edf7" strokeDasharray="3 3" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" name="Applications" radius={[10, 10, 0, 0]} fill="#6d35ff" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CountryChart({ data }) {
  const chartData = data.filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return <EmptyState text="No preferred-country data yet" />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={86}
          label={({ name, value }) => `${name}: ${value}`}
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

function ListPanel({ title, subtitle, items, emptyText, renderItem }) {
  return (
    <Panel title={title} subtitle={subtitle}>
      {items.length === 0 ? (
        <EmptyState text={emptyText} />
      ) : (
        <div className="space-y-3">{items.map(renderItem)}</div>
      )}
    </Panel>
  );
}

function QuickAction({ label, icon: Icon, to }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="flex items-center justify-between rounded-2xl border border-[#e4ebf7] bg-white px-4 py-4 text-left shadow-[0_16px_35px_rgba(27,39,74,0.04)] transition hover:-translate-y-0.5 hover:border-[#cfdaf0]"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2f0ff] text-[#6d35ff]">
          <Icon size={19} />
        </span>
        <span className="text-sm font-semibold text-slate-950">{label}</span>
      </span>
      <ArrowRight size={17} className="text-slate-400" />
    </button>
  );
}

const normalizeRole = (role = "") =>
  role.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

function RoleSpecificDashboard({ role, overview, recentActivities, upcomingTasks }) {
  const roleKey = normalizeRole(role);

  const roleConfig = {
    "super admin": {
      label: "Super Admin Dashboard",
      title: "Organization Command Center",
      subtitle: "Monitor total CRM performance, staff activity, revenue signals, and operations.",
      stats: [
        { title: "Total Leads", value: overview?.totalLeads ?? 0, helper: "All leads across the organization", icon: Users, tone: "blue" },
        { title: "Total Students", value: overview?.totalStudents ?? 0, helper: "All active student records", icon: GraduationCap, tone: "green" },
        { title: "Total Applications", value: overview?.totalApplications ?? 0, helper: "Applications across all counsellors", icon: Briefcase, tone: "violet" },
        { title: "Active Staff", value: 0, helper: "Staff endpoint not connected yet", icon: UserPlus, tone: "amber" },
      ],
      actions: [
        { label: "Add User", icon: UserPlus, to: "/settings" },
        { label: "Add Institution", icon: GraduationCap, to: "/institutions" },
        { label: "Create Lead", icon: Users, to: "/leads" },
        { label: "Generate Report", icon: FileText, to: "/reports" },
      ],
    },
    counsellors: {
      label: "Counsellor Dashboard",
      title: "My Counselling Workspace",
      subtitle: "Focus on assigned leads, students, follow-ups, tasks, and counselling notes.",
      stats: [
        { title: "My Leads", value: overview?.totalLeads ?? 0, helper: "Assigned-leads endpoint pending", icon: Users, tone: "blue" },
        { title: "My Students", value: overview?.totalStudents ?? 0, helper: "Assigned-students endpoint pending", icon: GraduationCap, tone: "green" },
        { title: "Follow-ups Due Today", value: overview?.todayTasks ?? 0, helper: "Tasks due today", icon: CalendarClock, tone: "amber" },
        { title: "Applications Submitted", value: overview?.totalApplications ?? 0, helper: "Submitted-applications endpoint pending", icon: Briefcase, tone: "violet" },
      ],
      actions: [
        { label: "Add Lead", icon: UserPlus, to: "/leads" },
        { label: "Add Note", icon: FileText, to: "/notes" },
        { label: "Schedule Follow-up", icon: CalendarClock, to: "/tasks" },
        { label: "Convert Lead", icon: GraduationCap, to: "/students" },
      ],
    },
    "documentation officers": {
      label: "Documentation Officer Dashboard",
      title: "Document Review Desk",
      subtitle: "Review pending documents, recent uploads, and applications awaiting documentation.",
      stats: [
        { title: "Pending Documents", value: overview?.totalDocuments ?? 0, helper: "Pending status split not connected yet", icon: FileText, tone: "amber" },
        { title: "Under Review", value: 0, helper: "Review queue endpoint pending", icon: FileCheck2, tone: "blue" },
        { title: "Approved Documents", value: 0, helper: "Approved status endpoint pending", icon: FileCheck2, tone: "green" },
        { title: "Rejected Documents", value: 0, helper: "Rejected status endpoint pending", icon: FileText, tone: "rose" },
      ],
      actions: [
        { label: "Upload Document", icon: FilePlus2, to: "/documents" },
        { label: "Approve Document", icon: FileCheck2, to: "/documents" },
        { label: "Reject Document", icon: FileText, to: "/documents" },
        { label: "Add Document Note", icon: ListChecks, to: "/documents" },
      ],
    },
    students: {
      label: "Student Dashboard",
      title: "My Application Portal",
      subtitle: "Track documents, applications, notifications, and upcoming appointments.",
      stats: [
        { title: "Documents Uploaded", value: overview?.totalDocuments ?? 0, helper: "Your uploaded documents", icon: FileText, tone: "blue" },
        { title: "Pending Documents", value: 0, helper: "Pending document endpoint not connected yet", icon: CalendarClock, tone: "amber" },
        { title: "Applications", value: overview?.totalApplications ?? 0, helper: "Your application records", icon: Briefcase, tone: "violet" },
        { title: "Notifications", value: overview?.unreadNotifications ?? 0, helper: "Unread messages and alerts", icon: BellRing, tone: "rose" },
      ],
      actions: [
        { label: "Upload Document", icon: FilePlus2, to: "/documents" },
        { label: "View Applications", icon: Briefcase, to: "/applications" },
        { label: "Notifications", icon: BellRing, to: "/notifications" },
        { label: "Profile", icon: Users, to: "/profile" },
      ],
    },
  };

  const config = roleConfig[roleKey] || roleConfig.counsellors;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#e4ebf7] bg-white px-6 py-6 shadow-[0_16px_35px_rgba(27,39,74,0.05)] md:px-8">
        <p className="text-sm font-semibold text-[#6d35ff]">{config.label}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">{config.title}</h1>
        <p className="mt-1 text-slate-500">{config.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {config.stats.map((stat) => (
          <MetricCard key={stat.title} {...stat} />
        ))}
      </div>

      {roleKey === "students" && (
        <Panel title="Progress Tracker" subtitle="Your study abroad journey">
          <div className="grid gap-3 md:grid-cols-3">
            {["Lead Created", "Documents Submitted", "Application Submitted", "Offer Received", "Visa Applied", "Visa Granted"].map((step, index) => (
              <div key={step} className="rounded-xl border border-[#edf1f8] bg-[#f8fbff] p-4">
                <p className="text-sm font-semibold text-slate-950">{step}</p>
                <p className="mt-1 text-xs text-slate-500">{index < 2 ? "Completed" : "Pending"}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentActivities activities={recentActivities} />
        </div>
        <UpcomingTasks tasks={upcomingTasks} />
      </div>

      <Panel title="Quick Actions" subtitle={`Common actions for ${config.label}`}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {config.actions.map((action) => (
            <QuickAction key={action.label} {...action} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

export default function DashboardPage() {
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [applicationsByStatus, setApplicationsByStatus] = useState([]);
  const [studentsByCountry, setStudentsByCountry] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overviewData, appStatus, countries, activities, tasks] =
        await Promise.all([
          dashboardApi.getDashboardOverview(),
          dashboardApi.getApplicationsByStatus(),
          dashboardApi.getStudentsByCountry(),
          dashboardApi.getRecentActivities(),
          dashboardApi.getUpcomingTasks(),
        ]);

      setOverview(overviewData);
      setApplicationsByStatus(appStatus);
      setStudentsByCountry(countries);
      setRecentActivities(activities);
      setUpcomingTasks(tasks);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load dashboard data";

      console.error("Dashboard error:", err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const request = Promise.resolve().then(fetchDashboardData);

    return () => {
      request.catch(() => {});
    };
  }, []);

  const leadSourceData = useMemo(
    () => [
      { name: "Website", count: 0 },
      { name: "Referral", count: 0 },
      { name: "Social", count: 0 },
      { name: "Walk-in", count: 0 },
    ],
    []
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-violet-600" />
          <p className="mt-2 text-gray-600">Loading consultancy dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-red-700">
            Connection Error
          </h3>
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const topStats = [
    {
      title: "Total Leads",
      value: overview?.totalLeads ?? 0,
      helper: "All active leads in the consultancy pipeline",
      icon: Users,
      tone: "blue",
    },
    {
      title: "Converted Students",
      value: overview?.totalStudents ?? 0,
      helper: "Leads converted into student records",
      icon: GraduationCap,
      tone: "green",
    },
    {
      title: "Active Applications",
      value: overview?.totalApplications ?? 0,
      helper: "Applications currently tracked in CRM",
      icon: Briefcase,
      tone: "violet",
    },
    {
      title: "Pending Documents",
      value: overview?.totalDocuments ?? 0,
      helper: "Document tracking endpoint pending status split",
      icon: FileText,
      tone: "amber",
    },
    {
      title: "Visa Applications",
      value: 0,
      helper: "Visa dashboard endpoint not connected yet",
      icon: FileCheck2,
      tone: "rose",
    },
    {
      title: "Follow-ups Due Today",
      value: overview?.pendingFollowups ?? overview?.todayTasks ?? 0,
      helper: "Pending follow-ups requiring attention",
      icon: CalendarClock,
      tone: "violet",
    },
  ];

  const recentLeads = [];
  const studentsNeedingDocuments = [];

  if (normalizeRole(userRole) !== "consultancy admin") {
    return (
      <RoleSpecificDashboard
        role={userRole}
        overview={overview}
        recentActivities={recentActivities}
        upcomingTasks={upcomingTasks}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#e4ebf7] bg-white px-6 py-6 shadow-[0_16px_35px_rgba(27,39,74,0.05)] md:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2558ff] to-[#9b3bff] text-white shadow-sm shadow-violet-200">
              <PieChart size={30} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#6d35ff]">
                Consultancy Admin Dashboard
              </p>
              <h1 className="text-3xl font-bold text-slate-950">
                Operations Overview
              </h1>
              <p className="mt-1 text-slate-500">
                Track leads, student conversion, applications, documents, and follow-ups.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:min-w-[390px]">
            <div className="rounded-2xl border border-[#e5ebf7] bg-[#f7f9ff] px-4 py-3">
              <p className="text-xs text-slate-500">Today Tasks</p>
              <p className="text-lg font-bold text-slate-950">{overview?.todayTasks ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-[#e5ebf7] bg-[#f7f9ff] px-4 py-3">
              <p className="text-xs text-slate-500">Overdue</p>
              <p className="text-lg font-bold text-slate-950">{overview?.overdueTasks ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-[#e5ebf7] bg-[#f7f9ff] px-4 py-3">
              <p className="text-xs text-slate-500">Unread</p>
              <p className="text-lg font-bold text-slate-950">{overview?.unreadNotifications ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topStats.map((stat) => (
          <MetricCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel title="Lead Sources" subtitle="Source breakdown for new enquiries">
          {leadSourceData.some((item) => item.count > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={leadSourceData}>
                <CartesianGrid stroke="#e7edf7" strokeDasharray="3 3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="#2558ff" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="Lead source endpoint is not connected yet" />
          )}
        </Panel>

        <Panel title="Application Status Breakdown" subtitle="Current application stages">
          <ApplicationStatusChart data={applicationsByStatus} />
        </Panel>

        <Panel title="Student Preferred Countries" subtitle="Most requested study destinations">
          <CountryChart data={studentsByCountry} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentActivities activities={recentActivities} />
        </div>
        <UpcomingTasks tasks={upcomingTasks} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ListPanel
          title="Recent Leads"
          subtitle="Newest enquiries awaiting counselling"
          items={recentLeads}
          emptyText="Recent leads endpoint is not connected yet"
          renderItem={(lead) => (
            <div key={lead.id} className="rounded-xl border border-[#edf1f8] bg-[#f8fbff] p-4">
              {lead.name}
            </div>
          )}
        />

        <ListPanel
          title="Students Needing Documents"
          subtitle="Students blocked by missing or pending files"
          items={studentsNeedingDocuments}
          emptyText="Document requirement endpoint is not connected yet"
          renderItem={(student) => (
            <div key={student.id} className="rounded-xl border border-[#edf1f8] bg-[#f8fbff] p-4">
              {student.name}
            </div>
          )}
        />
      </div>

      <Panel title="Quick Actions" subtitle="Common Consultancy Admin workflows">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <QuickAction label="Add Lead" icon={UserPlus} to="/leads" />
          <QuickAction label="Add Student" icon={GraduationCap} to="/students" />
          <QuickAction label="Create Application" icon={FilePlus2} to="/applications" />
          <QuickAction label="Assign Task" icon={ListChecks} to="/tasks" />
        </div>
      </Panel>

      <Panel title="Notifications" subtitle="Latest alerts and messages">
        <div className="flex items-center gap-3 rounded-2xl border border-[#edf1f8] bg-[#f8fbff] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2f0ff] text-[#6d35ff]">
            <BellRing size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">
              {overview?.unreadNotifications ?? 0} unread notification(s)
            </p>
            <p className="text-xs text-slate-500">
              Last synced {formatDate(new Date())}
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
