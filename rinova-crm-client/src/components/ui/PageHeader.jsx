export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
}) {
  return (
    <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) px-5 py-5 shadow-[0_16px_35px_rgba(27,39,74,0.05)] dark:shadow-none sm:px-6 md:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {Icon && (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-(--color-secondary) to-(--color-primary) text-white">
              <Icon size={28} />
            </div>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-sm font-semibold text-(--color-primary)">
                {eyebrow}
              </p>
            )}
            <h1 className="text-2xl font-bold text-(--color-text) sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-(--color-muted) sm:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
        {action}
      </div>
    </div>
  );
}
