export default function RecentActivities({ activities = [] }) {
  const formatDate = (value) => {
    if (!value) return "No date";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "No date" : date.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-[#e4ebf7] rounded-2xl shadow-[0_16px_35px_rgba(27,39,74,0.05)] p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-950">Recent Activities</h3>
        <p className="text-sm text-slate-500">Latest CRM updates from your team</p>
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recent activities</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-[#edf1f8] last:border-b-0">
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-[#2558ff] to-[#9b3bff] rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-950">
                  {activity.userName}
                </p>
                <p className="text-slate-600 text-sm">{activity.action}</p>
                <p className="text-slate-400 text-xs mt-1">
                  {formatDate(activity.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
