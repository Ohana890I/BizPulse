import SearchBar from "./SearchBar";
import { useLanguage } from "../../i18n/LanguageProvider";

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-4xl font-semibold tracking-tight text-slate-950">
          {value}
        </p>
        <span className={`h-3 w-3 rounded-full ${accent}`} />
      </div>
    </div>
  );
}

export default function StatsCards({
  responseCount,
  emailCount,
  searchValue,
  onSearchChange,
}) {
  const { language } = useLanguage();
  const labels =
    language === "he"
      ? {
          responses: "סך כל התגובות",
          emails: "סך כל האימיילים",
        }
      : {
          responses: "Total Responses",
          emails: "Total Emails",
        };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <StatCard label={labels.responses} value={responseCount} accent="bg-sky-400" />
      <StatCard label={labels.emails} value={emailCount} accent="bg-emerald-400" />
      <SearchBar value={searchValue} onChange={onSearchChange} />
    </div>
  );
}