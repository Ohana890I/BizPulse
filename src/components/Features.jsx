import { motion } from "framer-motion";
import { Clock3, Lightbulb, Rocket } from "lucide-react";
import { useLanguage } from "../i18n/LanguageProvider";

const features = {
  en: [
    {
      icon: <Clock3 size={34} />,
      title: "Save Time",
      description:
        "Businesses lose hours every week on repetitive work. We want to fix that.",
    },
    {
      icon: <Lightbulb size={34} />,
      title: "Share Your Challenges",
      description:
        "Tell us what's slowing your business down so we can solve real problems.",
    },
    {
      icon: <Rocket size={34} />,
      title: "Build Better Software",
      description:
        "Your feedback directly shapes the products we'll build in the future.",
    },
  ],
  he: [
    {
      icon: <Clock3 size={34} />,
      title: "חוסכים זמן",
      description:
        "עסקים מאבדים שעות בכל שבוע על עבודה שחוזרת על עצמה. אנחנו רוצים לתקן את זה.",
    },
    {
      icon: <Lightbulb size={34} />,
      title: "משתפים את האתגרים",
      description:
        "ספרו לנו מה מאט את העסק שלכם כדי שנוכל לפתור בעיות אמיתיות.",
    },
    {
      icon: <Rocket size={34} />,
      title: "בונים תוכנה טובה יותר",
      description:
        "המשוב שלכם מעצב ישירות את המוצרים שנבנה בהמשך.",
    },
  ],
};

function Features() {
  const { language } = useLanguage();
  const list = features[language] || features.en;
  const sectionTitle =
    language === "he" ? "למה הדעה שלכם חשובה" : "Why Your Opinion Matters";

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center text-4xl font-black text-gray-900"
        >
          {sectionTitle}
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-3">
          {list.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-xl"
            >
              <div className="mb-6 inline-flex rounded-2xl bg-[#D4AF37]/10 p-4 text-[#D4AF37]">
                {feature.icon}
              </div>

              <h3 className="mb-4 text-2xl font-bold">
                {feature.title}
              </h3>

              <p className="leading-7 text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;