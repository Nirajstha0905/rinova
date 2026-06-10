export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <h2 className="font-semibold text-lg">
        Welcome Back
      </h2>

      <div className="flex items-center gap-4">
        <button>
          🔔
        </button>

        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
          A
        </div>
      </div>
    </header>
  );
}