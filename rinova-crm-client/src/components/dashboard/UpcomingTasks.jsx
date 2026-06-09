import { CheckCircle2, Clock } from "lucide-react";

export default function UpcomingTasks({ tasks = [] }) {
  const formatDate = (value) => {
    if (!value) return "No due date";

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "No due date" : date.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-[#e4ebf7] rounded-2xl shadow-[0_16px_35px_rgba(27,39,74,0.05)] p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-950">Upcoming Tasks</h3>
        <p className="text-sm text-slate-500">Pending follow-ups and reminders</p>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No upcoming tasks</p>
      ) : (
        <div className="space-y-3">
          {tasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 bg-[#f7f9ff] border border-[#edf1f8] rounded-xl hover:bg-[#f2f0ff] transition"
            >
              <Clock className="w-4 h-4 text-[#6d35ff] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-950 truncate">{task.title}</p>
                <p className="text-slate-500 text-xs">
                  Due: {formatDate(task.dueDate)}
                </p>
              </div>
              {task.status === "completed" && (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
