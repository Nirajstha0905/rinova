import { Menu, Bell } from "lucide-react";

export default function Header({
  onMenuClick,
}) {
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="font-semibold text-lg">
            Dashboard
          </h2>

          <p className="text-xs text-slate-500">
            Welcome back
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell size={20} />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-4 w-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <div className="h-9 w-9 rounded-full bg-indigo-500 text-white flex items-center justify-center">
          A
        </div>
      </div>
    </header>
  );
}