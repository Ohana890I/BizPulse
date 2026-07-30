import { motion } from "framer-motion";
import { Lightbulb, MessageCircle, Target } from "lucide-react";
import { useLanguage } from "../i18n/LanguageProvider";

function About() {
  const { language } = useLanguage();
  const content =
    language === "he"
      ? {
          eyebrow: "מי עומד מאחורי BizPulse?",
          title: "נעים להכיר, אני Ilay Yohana.",
          description:
            "BizPulse היא יוזמה עצמאית שהקמתי מתוך מטרה פשוטה: לבנות כלים שבאמת עוזרים לבעלי עסקים, על בסיס מה שהם צריכים ביום־יום — לא על בסיס ניחושים.",
          mission:
            "ב־30 הימים האלה אני משוחח עם בעלי עסקים, אוסף את האתגרים שחוזרים על עצמם ומחפש את הבעיה שהכי נכון לפתור קודם. כל תשובה משפיעה ישירות על המוצר הראשון שנבנה.",
          values: [
            [MessageCircle, "מקשיבים קודם", "מתחילים מהשטח ומהניסיון האמיתי של בעלי עסקים."],
            [Target, "פותרים בעיה אמיתית", "מתמקדים במה שחוסך זמן, כסף ותסכול בפועל."],
            [Lightbulb, "בונים בשקיפות", "משתפים את הדרך ונותנים למשתתפים השפעה על התוצאה."],
          ],
        }
      : {
          eyebrow: "Who is behind BizPulse?",
          title: "Nice to meet you, I'm Ilay Yohana.",
          description:
            "BizPulse is an independent initiative I started with a simple goal: to build tools that genuinely help business owners, based on what they need every day — not on guesswork.",
          mission:
            "During this 30-day mission, I'm speaking with business owners, collecting recurring challenges and looking for the most important problem to solve first. Every response directly shapes the first product we build.",
          values: [
            [MessageCircle, "Listen first", "Start with real experience from business owners in the field."],
            [Target, "Solve a real problem", "Focus on what truly saves time, money and frustration."],
            [Lightbulb, "Build transparently", "Share the journey and give participants a voice in the outcome."],
          ],
        };

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#bf9827]">
            {content.eyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-black text-gray-900 md:text-5xl">
            {content.title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">{content.description}</p>
          <p className="mt-4 text-lg leading-8 text-gray-600">{content.mission}</p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {content.values.map(([Icon, title, description]) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              className="rounded-3xl border border-gray-200 bg-[#FAFAFA] p-7 text-center"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-[#a98216]">
                <Icon size={24} />
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-gray-900">{title}</h3>
              <p className="mt-3 leading-7 text-gray-600">{description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
