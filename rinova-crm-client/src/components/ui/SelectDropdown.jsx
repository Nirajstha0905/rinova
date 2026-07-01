import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

const toLabel = (option) =>
  typeof option === "string" ? option : (option?.label ?? option?.value ?? "");

const toValue = (option) =>
  typeof option === "string" ? option : (option?.value ?? option?.label ?? "");

export function SelectDropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  error,
  renderOption,
  renderSelected,
  direction = "down",
  searchPlaceholder = "Search...",
  emptyText = "No results",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);
  const showSearch = options.length > 4;
  const selectedOption = useMemo(
    () => options.find((option) => toValue(option) === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return options;

    return options.filter((option) =>
      toLabel(option).toLowerCase().includes(trimmed),
    );
  }, [options, query]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (open && showSearch) {
      searchRef.current?.focus();
    }
  }, [open, showSearch]);

  const handleSelect = (option) => {
    onChange?.(toValue(option));
    setOpen(false);
    setQuery("");
  };

  const displayValue = selectedOption
    ? renderSelected
      ? renderSelected(selectedOption)
      : toLabel(selectedOption)
    : "";

  return (
    <div className="relative space-y-1" ref={containerRef}>
      {label ? (
        <label className="text-sm font-medium text-(--color-text)">
          {label}
        </label>
      ) : null}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={[
          "flex w-full items-center justify-between gap-3 rounded-xl border bg-(--color-surface) px-4 py-2.5 text-left text-sm text-(--color-text) shadow-sm outline-none transition",
          "hover:border-(--color-border)",
          disabled ? "cursor-not-allowed opacity-60" : "",
          open
            ? "border-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/10"
            : "border-(--color-border)",
          error ? "border-red-400 ring-0" : "",
        ].join(" ")}
      >
        <span
          className={
            displayValue ? "text-(--color-text)" : "text-(--color-muted)"
          }
        >
          {displayValue || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-(--color-muted) transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          className={`absolute z-50 w-full overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) shadow-xl ${
            direction === "up" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {showSearch && (
            <div className="border-b border-(--color-border) px-3 py-2">
              <div className="flex items-center gap-2 rounded-lg bg-(--color-surface-muted) px-3 py-2">
                <Search size={14} className="shrink-0 text-(--color-muted)" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-sm text-(--color-text) outline-none placeholder:text-(--color-muted)"
                />
              </div>
            </div>
          )}
          <ul className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length ? (
              filteredOptions.map((option) => {
                const optionValue = toValue(option);
                const isSelected = optionValue === value;

                return (
                  <li
                    key={optionValue}
                    onMouseDown={() => handleSelect(option)}
                    className={[
                      "flex cursor-pointer items-center gap-2 px-4 py-2 text-sm transition",
                      isSelected
                        ? "bg-[var(--color-primary)]/10 font-medium text-[var(--color-primary)]"
                        : "text-(--color-text) hover:bg-(--color-surface-muted)",
                    ].join(" ")}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {renderOption ? renderOption(option) : toLabel(option)}
                    </span>
                    {isSelected ? (
                      <Check size={14} className="shrink-0" />
                    ) : null}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-3 text-sm text-(--color-muted)">
                {emptyText}
              </li>
            )}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p className="text-xs font-medium text-red-500">{error.message}</p>
      ) : null}
    </div>
  );
}
