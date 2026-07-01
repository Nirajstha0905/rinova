import { ChevronRight } from "lucide-react";

export default function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between border-b border-(--color-border) py-3 last:border-0">
      <span className="text-sm text-(--color-muted)">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-(--color-text)">
          {value || "-"}
        </span>
        <ChevronRight size={14} className="text-(--color-muted)" />
      </div>
    </div>
  );
}
