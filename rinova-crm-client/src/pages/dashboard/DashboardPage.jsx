import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/dashboard/StatCard";
import GrowthChart from "../../components/dashboard/GrowthChart";
import RevenueChart from "../../components/dashboard/RevenueChart";
import RecentActivities from "../../components/dashboard/RecentActivities";
import UpcomingTasks from "../../components/dashboard/UpcomingTasks";
import * as dashboardApi from "../../api/dashboardApi";

export default function DashboardPage() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Connection Error
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-red-500 mb-4">
            Make sure your server is running at{" "}
            <code className="bg-red-100 px-2 py-1 rounded">
              http://localhost:5000
            </code>
          </p>
          <button
            onClick={fetchDashboardData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Students", value: overview?.totalStudents ?? 0 },
    { title: "Leads", value: overview?.totalLeads ?? 0 },
    { title: "Applications", value: overview?.totalApplications ?? 0 },
    { title: "Pending Tasks", value: overview?.pendingTasks ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-[#e4ebf7] shadow-[0_16px_35px_rgba(27,39,74,0.05)] px-6 py-6 md:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2558ff] to-[#9b3bff] text-white flex items-center justify-center shadow-sm shadow-violet-200">
              <GraduationCap size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2558ff] to-[#9b3bff] bg-clip-text text-transparent">
                Rinova Creation
              </h1>
              <p className="text-slate-500 mt-1">
                Modern Education Consultancy & CRM Platform
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:min-w-[360px]">
            <div className="rounded-2xl bg-[#f7f9ff] border border-[#e5ebf7] px-4 py-3">
              <p className="text-xs text-slate-500">Today</p>
              <p className="text-lg font-bold text-slate-950">{overview?.todayTasks ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-[#f7f9ff] border border-[#e5ebf7] px-4 py-3">
              <p className="text-xs text-slate-500">Overdue</p>
              <p className="text-lg font-bold text-slate-950">{overview?.overdueTasks ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-[#f7f9ff] border border-[#e5ebf7] px-4 py-3">
              <p className="text-xs text-slate-500">Unread</p>
              <p className="text-lg font-bold text-slate-950">{overview?.unreadNotifications ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <StatCard stats={statCards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GrowthChart applicationsByStatus={applicationsByStatus} />
        <RevenueChart studentsByCountry={studentsByCountry} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivities activities={recentActivities} />
        </div>
        <div>
          <UpcomingTasks tasks={upcomingTasks} />
        </div>
      </div>
    </div>
  );
}
