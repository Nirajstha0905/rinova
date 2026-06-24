export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface-muted) p-8 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-(--color-primary)">
          <Icon size={22} />
        </div>
      )}
      <p className="mt-3 font-semibold text-(--color-text)">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-(--color-muted)">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
