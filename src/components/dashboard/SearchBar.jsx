import { Search, X } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";

export default function SearchBar({ value, onChange }) {
  const { language } = useLanguage();
  const content =
    language === "he"
      ? {
          label: "חיפוש",
          placeholder: "טכנולוגיה, תשלומים, שיווק...",
          clear: "נקה חיפוש",
        }
      : {
          label: "Search",
          placeholder: "Technology, Payments, Marketing...",
          clear: "Clear search",
        };

  return (
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <Search size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {content.label}
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-slate-400 focus-within:bg-white">
            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={content.placeholder}
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />

            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-950"
                aria-label={content.clear}
              >
                <X size={16} />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}