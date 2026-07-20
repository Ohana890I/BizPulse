import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";

function SummaryRow({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

export default function SurveyCard({ survey, onOpen }) {
  const { language } = useLanguage();
  const content =
    language === "he"
      ? {
          anonymous: "אנונימי",
          title: "שליחה חדשה",
          industry: "תחום",
          challenge: "אתגר",
          submissionDate: "תאריך שליחה",
          open: "פתח",
        }
      : {
          anonymous: "Anonymous",
          title: "New submission",
          industry: "Industry",
          challenge: "Challenge",
          submissionDate: "Submission Date",
          open: "Open",
        };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {content.anonymous} #{survey.anonymousNumber}
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
            {content.title}
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {survey.submissionDate}
        </span>
      </div>

      <div className="mt-6 grid gap-4">
        <SummaryRow label={content.industry} value={survey.industry} />
        <SummaryRow label={content.challenge} value={survey.challenge} />
        <SummaryRow label={content.submissionDate} value={survey.submissionDate} />
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        {content.open}
        <ArrowRight size={16} />
      </button>
    </motion.article>
  );
}