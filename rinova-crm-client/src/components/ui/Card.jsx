export function Card({ children, className = "", ...props }) {
  return (
    <section
      className={`rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-[0_16px_35px_rgba(27,39,74,0.05)] dark:shadow-none ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`border-b border-(--color-border) px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
