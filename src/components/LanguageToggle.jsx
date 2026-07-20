import { useLanguage } from "../i18n/LanguageProvider";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
          language === "en"
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
        aria-label="Switch to English"
      >
        🇺🇸 EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage("he")}
        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
          language === "he"
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
        aria-label="החלף לעברית"
      >
        🇮🇱 HE
      </button>
    </div>
  );
}