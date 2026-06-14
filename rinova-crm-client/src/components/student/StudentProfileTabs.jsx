const tabs = [
  "Overview",
  "Applications",
  "Documents",
  "Academic",
  "Work Experience",
  "Tests",
  "Visa",
  "Notes",
  "Timeline",
];

export default function StudentProfileTabs({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "bg-violet-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}