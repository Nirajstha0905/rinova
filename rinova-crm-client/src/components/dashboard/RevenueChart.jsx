import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#2558ff", "#6d35ff", "#9b3bff", "#69a7ff", "#b4c6ff"];

export default function RevenueChart({ studentsByCountry = [] }) {
  const chartData = studentsByCountry.filter((item) => item.value > 0);

  return (
    <div className="bg-white border border-[#e4ebf7] rounded-2xl shadow-[0_16px_35px_rgba(27,39,74,0.05)] p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-950">Students by Country</h3>
        <p className="text-sm text-slate-500">Preferred destinations from student profiles</p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No country data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={88}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
