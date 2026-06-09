import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function GrowthChart({ applicationsByStatus = [] }) {
  const chartData = applicationsByStatus.filter((item) => item.count > 0);

  return (
    <div className="bg-white border border-[#e4ebf7] rounded-2xl shadow-[0_16px_35px_rgba(27,39,74,0.05)] p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-950">Applications Status</h3>
        <p className="text-sm text-slate-500">Grouped by active application stage</p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No application data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7edf7" />
            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6d35ff"
              strokeWidth={3}
              dot={{ fill: "#6d35ff", strokeWidth: 2 }}
              name="Applications"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
