import { motion } from "framer-motion";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";

function QuestionCard({ question, answer }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
      <p className="text-sm font-semibold tracking-tight text-slate-950 sm:text-base">
        {question}
      </p>
      <div className="mt-4 rounded-2xl border border-white bg-white px-4 py-4 text-sm leading-6 text-slate-700 shadow-sm">
        {answer || "-"}
      </div>
    </div>
  );
}

export default function SurveyDetails({ survey, onBack, onExport, onDelete }) {
  const { language } = useLanguage();

  if (!survey) {
    return null;
  }

  const content =
    language === "he"
      ? {
          back: "חזרה",
          anonymous: "אנונימי",
          details: "פרטי הסקר",
          submissionDate: "תאריך שליחה",
          export: "יצוא לאקסל",
          delete: "מחיקת סקר",
        }
      : {
          back: "Back",
          anonymous: "Anonymous",
          details: "Survey details",
          submissionDate: "Submission date",
          export: "Export to Excel",
          delete: "Delete Survey",
        };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 lg:p-8"
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
      >
        <ArrowLeft size={16} />
        {content.back}
      </button>

      <div className="mt-6 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {content.anonymous} #{survey.anonymousNumber}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {content.details}
          </h2>
        </div>

        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {content.submissionDate}
          <p className="mt-1 font-semibold text-slate-900">{survey.submissionDate}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {survey.answers.map((item, index) => (
          <QuestionCard
            key={`${survey.id}-${index}`}
            question={item?.question ?? "Question"}
            answer={item?.answer ?? "-"}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Download size={16} />
          {content.export}
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          <Trash2 size={16} />
          {content.delete}
        </button>
      </div>
    </motion.section>
  );
}