import ThemeSettingsPanel from "../../components/theme/ThemeSettingsPanel";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-6 shadow-[0_16px_35px_rgba(27,39,74,0.05)] dark:shadow-none md:px-8">
        <p className="text-sm font-semibold text-[var(--color-primary)]">
          Settings
        </p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--color-text)]">
          Project Preferences
        </h1>
        <p className="mt-1 text-[var(--color-muted)]">
          Configure the visual system used across the CRM.
        </p>
      </div>

      <ThemeSettingsPanel />
    </div>
  );
}
