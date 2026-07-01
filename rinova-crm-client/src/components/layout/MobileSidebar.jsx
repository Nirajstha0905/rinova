import { X } from "lucide-react";
import { usePresenceTransition } from "../ui/usePresenceTransition";

export default function MobileSidebar({
  open,
  onClose,
}) {
  const { shouldRender, visible } = usePresenceTransition(open);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ease-[var(--motion-ease)] ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <aside className={`fixed left-0 top-0 z-50 h-screen w-72 bg-white shadow-xl transition-all duration-200 ease-[var(--motion-ease)] ${visible ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
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
