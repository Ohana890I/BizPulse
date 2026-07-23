import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageProvider";

const MISSION_START = { year: 2026, month: 6, day: 23 };
const DECISION_DAY = { year: 2026, month: 7, day: 23 };
const TOTAL_MISSION_DAYS = 30;

const timelineStages = [
  {
    icon: "✅",
    unlockDay: 1,
    label: { en: "Mission Started", he: "המשימה התחילה" },
  },
  {
    icon: "🔄",
    unlockDay: 8,
    label: { en: "Collecting Business Insights", he: "אוספים תובנות מבעלי עסקים" },
  },
  {
    icon: "⏳",
    unlockDay: 16,
    label: { en: "Finding Patterns", he: "מזהים דפוסים" },
  },
  {
    icon: "⏳",
    unlockDay: 24,
    label: { en: "Choosing the Biggest Problem", he: "בוחרים את הבעיה הכי גדולה" },
  },
  {
    icon: "🎉",
    unlockDay: 30,
    label: { en: "Product Reveal", he: "חשיפת המוצר" },
  },
];

const particles = [
  { size: "h-2 w-2", top: "top-16", left: "left-[14%]", delay: 0 },
  { size: "h-3 w-3", top: "top-28", left: "right-[18%]", delay: 0.7 },
  { size: "h-2.5 w-2.5", top: "bottom-24", left: "left-[20%]", delay: 1.1 },
  { size: "h-1.5 w-1.5", top: "bottom-16", left: "right-[24%]", delay: 1.6 },
  { size: "h-2 w-2", top: "top-1/2", left: "left-[8%]", delay: 2.1 },
  { size: "h-2.5 w-2.5", top: "top-[42%]", left: "right-[9%]", delay: 2.7 },
];

function toUtcTimestamp({ year, month, day }) {
  return Date.UTC(year, month, day);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getMissionProgress() {
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const startUtc = toUtcTimestamp(MISSION_START);
  const endUtc = toUtcTimestamp(DECISION_DAY);
  const totalSpanDays = Math.max(1, Math.round((endUtc - startUtc) / 86400000));
  const elapsedDays = clamp(Math.round((todayUtc - startUtc) / 86400000), 0, totalSpanDays);
  const normalizedProgress = elapsedDays / totalSpanDays;
  const missionDay = clamp(
    Math.round(normalizedProgress * (TOTAL_MISSION_DAYS - 1)) + 1,
    1,
    TOTAL_MISSION_DAYS
  );

  return {
    missionDay,
    progressPercent: (missionDay / TOTAL_MISSION_DAYS) * 100,
  };
}

export default function MissionProgressCard() {
  const { language } = useLanguage();
  const isHebrew = language === "he";
  const { missionDay, progressPercent } = getMissionProgress();
  const content = isHebrew
    ? {
        badge: "משימה לייב",
        title: "מחקר עסקי ל-30 יום",
        descriptionOne:
          "במקום לנחש מה עסקים צריכים, אנחנו מקדישים 30 יום להקשבה לבעלי עסקים לפני שנכתוב שורת קוד אחת של מוצר.",
        descriptionTwo: "כל תשובה לסקר עוזרת לעצב את המוצר הראשון של BizPulse.",
        progressLabel: "התקדמות המשימה",
        dayLabel: "יום",
        ofLabel: "מתוך 30",
        decisionDay: "יום ההחלטה: 23 באוגוסט 2026",
        footer: "מקשיבים קודם. בונים אחר כך.",
        startLabel: "יום 1",
        endLabel: "יום 30",
      }
    : {
        badge: "Live Mission",
        title: "30-Day Business Research",
        descriptionOne:
          "Instead of guessing what businesses need, we're spending 30 days listening to business owners before writing a single line of product code.",
        descriptionTwo: "Every survey response helps shape the first BizPulse product.",
        progressLabel: "Mission Progress",
        dayLabel: "Day",
        ofLabel: "of 30",
        decisionDay: "Decision Day: August 23, 2026",
        footer: "Listening first. Building second.",
        startLabel: "Day 1",
        endLabel: "Day 30",
      };

  return (
    <section className="relative px-6 pb-8 sm:pb-14">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 42, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6, scale: 1.01 }}
          className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/72 p-7 shadow-[0_28px_80px_rgba(15,23,42,0.12),0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition duration-500 sm:p-10"
        >
          <div className="absolute inset-x-10 top-0 h-px bg-[#D4AF37]/70" />
          <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-[#D4AF37]/12 blur-3xl" />
          <div className="absolute bottom-8 right-12 h-32 w-32 rounded-full bg-slate-200/70 blur-3xl" />

          {particles.map((particle, index) => (
            <motion.span
              key={index}
              aria-hidden="true"
              className={`absolute ${particle.top} ${particle.left} ${particle.size} rounded-full bg-[#D4AF37]/40 shadow-[0_0_24px_rgba(212,175,55,0.45)]`}
              animate={{ y: [0, -10, 0], opacity: [0.35, 0.9, 0.35], scale: [1, 1.08, 1] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: particle.delay }}
            />
          ))}

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.55 }}
              className={`inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/25 bg-white/80 px-4 py-2 text-[0.72rem] font-semibold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.05)] ${
                isHebrew ? "tracking-[0.08em]" : "uppercase tracking-[0.28em]"
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/55" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              {content.badge}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.65 }}
              className={`mt-7 ${isHebrew ? "text-right" : "text-left"}`}
            >
              <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[3.35rem] sm:leading-[1.02]">
                {content.title}
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                {content.descriptionOne}
              </p>
              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                {content.descriptionTwo}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.65 }}
              className="mt-10 rounded-[28px] border border-white/75 bg-white/78 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_38px_rgba(15,23,42,0.06)] sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className={`text-sm font-medium text-slate-500 ${isHebrew ? "tracking-[0.08em]" : "uppercase tracking-[0.18em]"}`}>
                    {content.progressLabel}
                  </p>
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                      {content.dayLabel} {missionDay}
                    </span>
                    <span className="text-lg text-slate-400">{content.ofLabel}</span>
                  </div>
                </div>

                <div className={isHebrew ? "text-right" : "text-left sm:text-right"}>
                  <p className="text-sm font-medium text-slate-500">{content.decisionDay}</p>
                  <p className="mt-2 text-sm font-medium italic text-slate-700 sm:text-base">
                    {content.footer}
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <div className="relative h-3 overflow-hidden rounded-full bg-slate-200/80 shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progressPercent}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative h-full rounded-full bg-[#D4AF37]"
                  >
                    <span className="absolute inset-y-0 right-0 w-16 bg-white/35 blur-md" />
                  </motion.div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm font-medium text-slate-500">
                  <span>{content.startLabel}</span>
                  <span>{Math.round(progressPercent)}%</span>
                  <span>{content.endLabel}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.42, duration: 0.65 }}
              className="mt-8"
            >
              <div className="grid gap-3 sm:gap-4">
                {timelineStages.map((stage, index) => {
                  const isComplete = missionDay >= stage.unlockDay;

                  return (
                    <motion.div
                      key={stage.label.en}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.48 + index * 0.08, duration: 0.45 }}
                      className={`flex items-center gap-4 rounded-[22px] border px-4 py-4 sm:px-5 ${
                        isComplete
                          ? "border-[#D4AF37]/35 bg-[#D4AF37]/10 text-slate-900 shadow-[0_10px_24px_rgba(212,175,55,0.12)]"
                          : "border-slate-200/80 bg-white/65 text-slate-400"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg ${
                          isComplete ? "bg-white text-slate-900 shadow-sm" : "bg-slate-100/90"
                        }`}
                      >
                        {stage.icon}
                      </div>

                      <div className="flex-1">
                        <p
                          className={`text-base font-semibold tracking-[-0.02em] sm:text-lg ${
                            isComplete ? "text-slate-950" : "text-slate-500"
                          }`}
                        >
                          {stage.label[language]}
                        </p>
                      </div>

                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          isComplete ? "bg-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.5)]" : "bg-slate-300"
                        }`}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}