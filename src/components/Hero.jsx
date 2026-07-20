import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageProvider";

function Hero({ onStartSurvey }) {
  const { language } = useLanguage();
  const content =
    language === "he"
      ? {
          badge: "🚀 עזרו לנו לבנות תוכנה טובה יותר לעסקים",
          title1: "די לנחש.",
          title2: "מתחילים להקשיב.",
          description:
            "אנחנו מדברים עם בעלי עסקים כדי להבין את האתגרים הגדולים ביותר שלהם. התשובות שלכם יעזרו לנו לבנות תוכנה שבאמת תחסוך זמן, כסף ותסכול.",
          benefitsTitle: "מה יוצא לכם מזה?",
          benefitsText:
            "בתמורה למענה מלא על הסקר, תקבלו חודש שלם בחינם עם גישה למוצר שלנו. במהלך החודש תוכלו לעבוד עם הכלים, לבדוק איך הם חוסכים זמן בניהול היומיומי, ולראות בפועל איך המערכת מפחיתה עומס ותקלות. זו הזדמנות אמיתית להתנסות ללא עלות ולתת לנו פידבק שישפיע על הפיתוח הבא.",
          cta: "התחל סקר",
          points: ["✅ אנונימי", "⏱️ 3 דקות", "💡 השפעה עסקית אמיתית"],
        }
      : {
          badge: "🚀 Help Build Better Business Software",
          title1: "Stop Guessing.",
          title2: "Start Listening.",
          description:
            "We're talking to business owners to understand their biggest challenges. Your answers will help us build software that actually saves time, money and frustration.",
          benefitsTitle: "What's in it for you?",
          benefitsText:
            "When you complete the survey, you'll receive one full month of free access to our product. Use this time to explore the platform, test real workflows in your business, and see how much time you can save week by week. Your feedback will directly shape what we build next, and you'll be among the first to benefit from it.",
          cta: "Start Survey",
          points: ["✅ Anonymous", "⏱️ 3 Minutes", "💡 Real Business Impact"],
        };

  return (
    <section className="relative overflow-hidden pt-40 pb-32">
      {/* Background Blur */}
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-yellow-200/40 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-sky-700"
        >
          {content.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-5xl font-black leading-tight text-gray-900 md:text-7xl"
        >
          {content.title1}
          <br />
          <span className="text-[#D4AF37]">
            {content.title2}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 max-w-2xl text-xl leading-8 text-gray-600"
        >
          {content.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-8 max-w-3xl rounded-3xl border border-[#D4AF37]/30 bg-white/80 p-6 text-center shadow-lg"
        >
          <h3 className="text-2xl font-extrabold text-gray-900">
            {content.benefitsTitle}
          </h3>
          <p className="mt-3 text-base leading-7 text-gray-700 sm:text-lg">
            {content.benefitsText}
          </p>
        </motion.div>

        <motion.button
          type="button"
          onClick={onStartSurvey}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="mt-12 flex items-center gap-2 rounded-2xl bg-[#D4AF37] px-8 py-4 text-lg font-semibold text-white shadow-xl transition"
        >
          {content.cta}
          <ArrowRight size={20} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-wrap justify-center gap-6 text-gray-500"
        >
          {content.points.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;