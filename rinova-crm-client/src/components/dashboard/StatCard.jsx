import { Briefcase, CheckSquare, GraduationCap, Users } from "lucide-react";

const icons = {
  Students: GraduationCap,
  Leads: Users,
  Applications: Briefcase,
  "Pending Tasks": CheckSquare,
};

export default function StatCard({ stats = [] }) {
  const defaultStats = [
    { title: "Students", value: 0 },
    { title: "Leads", value: 0 },
    { title: "Applications", value: 0 },
    { title: "Pending Tasks", value: 0 },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {displayStats.map((item) => (
        <div
          key={item.title}
          className="bg-white border border-[#e4ebf7] p-5 rounded-2xl shadow-[0_16px_35px_rgba(27,39,74,0.05)]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">{item.title}</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-950">{item.value}</h3>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-[#f2f0ff] text-[#6d35ff] flex items-center justify-center">
              {(() => {
                const Icon = icons[item.title] || GraduationCap;
                return <Icon size={21} />;
              })()}
            </div>
          </div>
{item.title === "Students" && (
  <div className="mt-4 flex items-center gap-2">
    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
      +{item.monthlyAdded ?? 0}
    </span>
    <span className="text-xs text-slate-500">
      added this month
    </span>
  </div>
)} 
        </div>
      ))}
    </div>
  );
}
