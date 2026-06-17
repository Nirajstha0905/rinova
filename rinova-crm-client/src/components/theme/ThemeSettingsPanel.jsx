import { RotateCcw } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { defaultThemeTokens } from "../../config/theme";

const colorFields = [
  ["primary", "Primary color"],
  ["primaryHover", "Primary hover"],
  ["secondary", "Secondary color"],
  ["cta", "CTA color"],
  ["bg", "Background"],
  ["surface", "Card surface"],
  ["surfaceMuted", "Muted surface"],
  ["border", "Border"],
  ["text", "Primary text"],
  ["mutedText", "Muted text"],
];

const fontOptions = [
  "Inter, sans-serif",
  "Arial, sans-serif",
  "system-ui, sans-serif",
  "Georgia, serif",
];

export default function ThemeSettingsPanel() {
  const { mode, setMode, tokens, updateToken, resetTheme } = useTheme();

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_16px_35px_rgba(27,39,74,0.05)] dark:shadow-none">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            Theme System
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[var(--color-text)]">
            Brand and layout tokens
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--color-muted)]">
            Update the core project colors and font here. These values are
            stored locally and applied through CSS variables across the app.
          </p>
        </div>

        <button
          type="button"
          onClick={resetTheme}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-muted)] transition hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
          <label className="text-sm font-semibold text-[var(--color-text)]">
            Mode
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["light", "dark"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${
                  mode === option
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 lg:col-span-2">
          <label
            htmlFor="fontPrimary"
            className="text-sm font-semibold text-[var(--color-text)]"
          >
            Primary font
          </label>
          <select
            id="fontPrimary"
            value={tokens.fontPrimary}
            onChange={(event) => updateToken("fontPrimary", event.target.value)}
            className="mt-3 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {colorFields.map(([key, label]) => (
          <label
            key={key}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3"
          >
            <span className="text-xs font-semibold text-[var(--color-muted)]">
              {label}
            </span>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="color"
                value={tokens[key] || defaultThemeTokens[key]}
                onChange={(event) => updateToken(key, event.target.value)}
                className="h-9 w-11 shrink-0 cursor-pointer rounded-lg border border-[var(--color-border)] bg-transparent"
              />
              <input
                value={tokens[key] || defaultThemeTokens[key]}
                onChange={(event) => updateToken(key, event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2 text-xs font-semibold text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
