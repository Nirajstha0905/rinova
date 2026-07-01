import { Activity, CirclePlus, Pencil, Trash2, FileText } from "lucide-react";
const icons = {
  create: { icon: CirclePlus, bg: "text-green-600" },

  update: { icon: Pencil, bg: "text-blue-600" },
  delete: { icon: Trash2, bg: "text-red-600" },
};

export default function TimelineTab({ timeline = [] }) {
  if (!timeline.length) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
        No Activity yet.
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-(--color-border) bg-white p-6">
      <h2 className="mb-8 text-xl font-semibold">Acitivity Timeline</h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 h-full w-px bg-gray-200" />

        {timeline.map((item) => {
          const config = icons[item.action] || {
            icon: Activity,
            bg: "text-(--color-primary)",
          };

          const Icon = config.icon;

          return (
            <div key={item.id} className="relative mb-8 flex gap-4">
              <div
                className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${config.bg}`}
              >
                <Icon size={16} />
              </div>

              <div className="flex-1">
                <div className="font-semibold capitalize">
                  {item.action} {item.entity}
                </div>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="mt-1 text-xs text-gray-400">{item.user}</p>
              </div>

              <div className="text-sm text-gray-400">
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
