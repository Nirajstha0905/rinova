export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) outline-none transition placeholder:text-(--color-muted) focus:border-(--color-primary) focus:bg-(--color-surface) ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`rounded-xl border border-(--color-border) bg-(--color-surface-muted) px-3 py-2 text-sm text-(--color-text) outline-none transition focus:border-(--color-primary) focus:bg-(--color-surface) ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
