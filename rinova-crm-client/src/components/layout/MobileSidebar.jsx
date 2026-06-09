import { X } from "lucide-react";

export default function MobileSidebar({
  open,
  onClose,
}) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      <aside className="fixed left-0 top-0 h-screen w-72 bg-white z-50 shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="font-bold text-xl text-indigo-600">
              Rinova Creation
            </h2>

            <p className="text-sm text-slate-500">
              Education CRM
            </p>
          </div>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>
      </aside>
    </>
  );
}