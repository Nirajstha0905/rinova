import { RotateCcw } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { defaultThemeTokens } from "../../config/theme";
import "../../index.css";

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
    <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-[0_16px_35px_rgba(27,39,74,0.05)] dark:shadow-none">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-(--color-primary)">
            Theme System
          </p>
          <h2 className="mt-1 text-2xl font-bold text-(--color-text)">
            Brand and layout tokens
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-(--color-muted)">
            Update the core project colors and font here. These values are
            stored locally and applied through CSS variables across the app.
          </p>
        </div>

        <button
          type="button"
          onClick={resetTheme}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--color-border) px-4 py-2 text-sm font-semibold text-(--color-muted) transition hover:bg-(--color-surface-muted) hover:text-(--color-text)"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-muted) p-4">
          <label className="text-sm font-semibold text-(--color-text)">
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
                    ? "bg-(--color-primary) text-white"
                    : "border border-(--color-border) bg-(--color-surface) text-(--color-muted) hover:text-(--color-text)"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-muted) p-4 lg:col-span-2">
          <label
            htmlFor="fontPrimary"
            className="text-sm font-semibold text-(--color-text)"
          >
            Primary font
          </label>
          <select
            id="fontPrimary"
            value={tokens.fontPrimary}
            onChange={(event) => updateToken("fontPrimary", event.target.value)}
            className="mt-3 w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-primary)"
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
            className="rounded-2xl border border-(--color-border) bg-(--color-surface-muted) p-3"
          >
            <span className="text-xs font-semibold text-(--color-muted)">
              {label}
            </span>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="color"
                value={tokens[key] || defaultThemeTokens[key]}
                onChange={(event) => updateToken(key, event.target.value)}
                className="h-9 w-11 shrink-0 cursor-pointer rounded-lg border border-(--color-border) bg-transparent"
              />
              <input
                value={tokens[key] || defaultThemeTokens[key]}
                onChange={(event) => updateToken(key, event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-(--color-border) bg-(--color-surface) px-2 py-2 text-xs font-semibold text-(--color-text) outline-none focus:border-(--color-primary)"
              />
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
