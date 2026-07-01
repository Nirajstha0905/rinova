import { User, FileText, Building2, Activity } from "lucide-react";

const tabs = [
  {
    key: "personal",
    icon: User,
    label: "Personal Information",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    key: "documents",
    icon: FileText,
    label: "Documents",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    key: "academic",
    icon: Building2,
    label: "Academic",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    key: "timeline",
    icon: Activity,
    label: "Timeline",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
];

export default function ProfileTabs({ activeTab, setActiveTab }) {
  return (
    <div className="sticky top-0 z-10 rounded-2xl border border-[var(--color-border)] bg-gray-50 p-2 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-white text-(--color-primary) shadow-sm ring-1 ring-(--color-border)"
                  : "text-(--color-muted) hover:bg-white hover:text-(--color-text) hover:shadow-sm hover:scale-[1.02]"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  activeTab === tab.key
                    ? `${tab.iconBg} shadow-sm`
                    : "bg-gray-100 group-hover:bg-gray-200"
                }`}
              >
                <tab.icon
                  size={16}
                  className={
                    activeTab === tab.key ? tab.iconColor : "text-gray-500"
                  }
                />
              </span>

              <span
                className={
                  activeTab === tab.key ? tab.iconColor : "text-gray-500"
                }
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
