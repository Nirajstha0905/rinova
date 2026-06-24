export default function RecentActivities({ activities = [] }) {
  const formatDate = (value) => {
    if (!value) return "No date";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "No date" : date.toLocaleDateString();
  };
  const getActionStyle = (action = "") => {
    const normalized = action.toLowerCase();

    if (normalized.includes("create")) return "bg-green-100 text-green-700";

    if (normalized.includes("upload")) return "bg-blue-100 text-blue-700";

    if (normalized.includes("update")) return "bg-yellow-100 text-yellow-700";

    if (normalized.includes("delete")) return "bg-red-100 text-red-700";
    if (normalized.includes("reject")) return "bg-orange-100 text-orange-700";

    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="bg-white border border-[#e4ebf7] rounded-2xl shadow-[0_16px_35px_rgba(27,39,74,0.05)] p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-950">
          Recent Activities
        </h3>
        <p className="text-sm text-slate-500">
          Latest CRM updates from your team
        </p>
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recent activities</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 pb-4 border-b border-[#edf1f8] last:border-b-0"
            >
              <div className="w-2.5 h-2.5 bg-linear-to-br from-[#2558ff] to-[#9b3bff] rounded-full mt-2 shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className=" flex items-start justify-between gap-4">
                  <p className="font-semibold text-sm text-slate-950">
                    {activity.userName}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    {formatDate(activity.createdAt)}
                  </p>
                </div>

                <p className="text-slate-600 text-sm">{activity.description}</p>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getActionStyle(activity.action)}`}
                >
                  {activity.action}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
