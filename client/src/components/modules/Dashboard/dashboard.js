import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const stats = [
  {
    title: "Total Students",
    value: "1,248",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Applications",
    value: "342",
    change: "+8%",
    icon: FileText,
    color: "text-purple-600",
  },
  {
    title: "Accepted",
    value: "156",
    change: "+23%",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Pending Review",
    value: "89",
    change: "-5%",
    icon: Clock,
    color: "text-orange-600",
  },
];

const applicationData = [
  { month: "Jan", applications: 45, accepted: 20 },
  { month: "Feb", applications: 52, accepted: 28 },
  { month: "Mar", applications: 61, accepted: 35 },
  { month: "Apr", applications: 58, accepted: 30 },
  { month: "May", applications: 72, accepted: 43 },
  { month: "Jun", applications: 68, accepted: 38 },
];

const programData = [
  { name: "Business", value: 35, color: "#3b82f6" },
  { name: "Engineering", value: 28, color: "#8b5cf6" },
  { name: "Medicine", value: 18, color: "#10b981" },
  { name: "Arts", value: 12, color: "#f59e0b" },
  { name: "Law", value: 7, color: "#ef4444" },
];

const recentActivities = [
  {
    student: "Emma Thompson",
    action: "Submitted application to MIT",
    time: "2 hours ago",
    status: "success",
  },
  {
    student: "James Wilson",
    action: "Document verification pending",
    time: "4 hours ago",
    status: "warning",
  },
  {
    student: "Sarah Chen",
    action: "Accepted to Stanford",
    time: "5 hours ago",
    status: "success",
  },
  {
    student: "Michael Brown",
    action: "Interview scheduled",
    time: "1 day ago",
    status: "info",
  },
  {
    student: "Lisa Anderson",
    action: "Application rejected - UCB",
    time: "1 day ago",
    status: "error",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your education consultancy operations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>

                <p className="text-xs text-muted-foreground">
                  <span
                    className={
                      stat.change.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {stat.change}
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
          </CardHeader>

          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="accepted"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Programs Distribution</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={programData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {programData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                        ? "bg-orange-500"
                        : activity.status === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  />

                  <div>
                    <p className="font-medium">{activity.student}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                </div>

                <span className="text-sm text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}