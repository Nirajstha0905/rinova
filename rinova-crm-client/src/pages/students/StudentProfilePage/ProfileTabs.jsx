import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  ClipboardList,
  Clock3,
} from "lucide-react";

const tabs = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "applications",
    label: "Applications",
    icon: FileText,
  },
  {
    id: "documents",
    label: "Documents",
    icon: FolderOpen,
  },
  {
    id: "notes",
    label: "Notes & Activity",
    icon: ClipboardList,
  },
  {
    id: "timeline",
    label: "Timeline",
    icon: Clock3,
  },
];

export default function ProfileTabs({ activeTab, setActiveTab }) {
  return (
    <div className="mt-8">
      <div className="inline-flex flex-wrap gap-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-2 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col gap-3 border-b border-(--color-border) px-5 py-2 sm:flex-row sm:items-center sm:justify-between transition-all ${
                active
                  ? "text-lg font-bold tracking-tight text-[var(--color-primary)]"
                  : "text-(--color-muted) hover: bg-(--color-surface-muted)"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
