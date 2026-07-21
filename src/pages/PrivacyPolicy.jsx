import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageProvider";
import LanguageToggle from "../components/LanguageToggle";

function Section({ title, paragraphs }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-3 space-y-3 text-slate-700">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export default function PrivacyPolicy() {
  const { language } = useLanguage();

  const content =
    language === "he"
      ? {
          back: "חזרה לעמוד הבית",
          title: "מדיניות פרטיות",
          updated: "עודכן לאחרונה: 20 ביולי 2026",
          intro:
            "Pulse מכבדת את הפרטיות שלכם. המסמך הזה מסביר איזה מידע אנחנו אוספים, איך אנחנו משתמשים בו, ואיך אנחנו שומרים עליו.",
          sections: [
            {
              title: "1. איזה מידע נאסף",
              paragraphs: [
                "כאשר אתם ממלאים את הסקר, אנחנו אוספים את התשובות שאתם מזינים לשאלות בטופס.",
                "אם בחרתם להשאיר כתובת אימייל, נאסוף גם את כתובת האימייל שסיפקתם כדי לעדכן אתכם לגבי המוצר.",
              ],
            },
            {
              title: "2. מטרות השימוש במידע",
              paragraphs: [
                "אנחנו משתמשים במידע כדי להבין את הצרכים של עסקים ולשפר את המוצר שלנו.",
                "המידע עשוי לשמש לניתוח מגמות, בניית פיצ'רים חדשים, ושיפור חוויית המשתמש.",
              ],
            },
            {
              title: "3. שיתוף מידע עם צדדים שלישיים",
              paragraphs: [
                "אנחנו לא מוכרים מידע אישי לצדדים שלישיים.",
                "שירותי תשתית טכנולוגיים (כמו אירוח נתונים) עשויים לעבד מידע רק לצורך הפעלת השירות ובכפוף לאמצעי אבטחה מקובלים.",
              ],
            },
            {
              title: "4. אבטחת מידע",
              paragraphs: [
                "אנחנו נוקטים אמצעים סבירים לאבטחת המידע ולמניעת גישה לא מורשית.",
                "עם זאת, אין שיטת אבטחה שמבטיחה הגנה מוחלטת ולכן לא ניתן להבטיח חסינות מלאה מפני כל סיכון.",
              ],
            },
            {
              title: "5. שמירת מידע",
              paragraphs: [
                "המידע נשמר כל עוד הוא נדרש לצורכי המחקר, השירות, עמידה בדרישות חוקיות, או פתרון מחלוקות.",
                "ניתן לפנות אלינו בבקשה למחוק מידע מזהה שסיפקתם, בכפוף לחובות חוקיות החלות עלינו.",
              ],
            },
            {
              title: "6. זכויות ופניה אלינו",
              paragraphs: [
                "באפשרותכם לפנות אלינו לצורך שאלות בנוגע לפרטיות, תיקון מידע, או בקשת מחיקה.",
                "ליצירת קשר: eam@bizpulse.space",
              ],
            },
            {
              title: "7. בסיס משפטי לעיבוד מידע",
              paragraphs: [
                "אנו מעבדים מידע על בסיס הסכמה שאתם מעניקים בעת שליחת הסקר או השארת אימייל.",
                "בנוסף, עיבוד מסוים עשוי להתבצע לצורך אינטרס לגיטימי של שיפור השירות, אבטחת המערכת ומניעת הונאות.",
              ],
            },
            {
              title: "8. עוגיות וטכנולוגיות דומות",
              paragraphs: [
                "האתר עשוי להשתמש בעוגיות או בטכנולוגיות דומות לצורך תפעול בסיסי, שמירת העדפות שפה, ושיפור חוויית שימוש.",
                "ניתן לחסום עוגיות דרך הגדרות הדפדפן, אך חלק מהפונקציות באתר עלולות שלא לפעול כראוי.",
              ],
            },
            {
              title: "9. העברות מידע מחוץ למדינתכם",
              paragraphs: [
                "ייתכן שהמידע יעובד או יאוחסן בשרתים מחוץ למדינה שבה אתם נמצאים, בהתאם לספקי התשתית שלנו.",
                "במקרים כאלה ננקוט אמצעים סבירים כדי לשמור על רמת הגנה נאותה למידע.",
              ],
            },
            {
              title: "10. קטינים",
              paragraphs: [
                "השירות אינו מיועד לקטינים מתחת לגיל 18 ללא אישור הורה או אפוטרופוס, ככל שהדבר נדרש לפי דין.",
                "אם נודע לנו כי נאסף מידע אישי מקטין בניגוד למדיניות זו, נפעל למחיקתו בתוך זמן סביר.",
              ],
            },
            {
              title: "11. שינויים במדיניות",
              paragraphs: [
                "אנו רשאים לעדכן מדיניות זו מעת לעת. תאריך העדכון האחרון יופיע בראש העמוד.",
                "המשך שימוש באתר לאחר עדכון המדיניות ייחשב כהסכמה לנוסח המעודכן.",
              ],
            },
            {
              title: "12. דין חל וסמכות שיפוט",
              paragraphs: [
                "מדיניות זו כפופה לדין החל במדינת ישראל, אלא אם הדין המחייב קובע אחרת.",
                "סמכות השיפוט הבלעדית לכל מחלוקת הנוגעת למדיניות זו תהיה לבתי המשפט המוסמכים בישראל.",
              ],
            },
          ],
        }
      : {
          back: "Back to Home",
          title: "Privacy Policy",
          updated: "Last updated: July 20, 2026",
          intro:
            "Pulse respects your privacy. This policy explains what information we collect, how we use it, and how we protect it.",
          sections: [
            {
              title: "1. Information We Collect",
              paragraphs: [
                "When you complete our survey, we collect the answers you provide in the form.",
                "If you choose to leave your email address, we collect it to send product-related updates.",
              ],
            },
            {
              title: "2. How We Use Information",
              paragraphs: [
                "We use submitted information to understand business needs and improve our product.",
                "Data may be used for trend analysis, feature planning, and experience improvements.",
              ],
            },
            {
              title: "3. Third-Party Sharing",
              paragraphs: [
                "We do not sell personal information to third parties.",
                "Infrastructure providers (such as cloud hosting) may process data only to operate the service under appropriate safeguards.",
              ],
            },
            {
              title: "4. Data Security",
              paragraphs: [
                "We implement reasonable technical and organizational measures to protect data against unauthorized access.",
                "No security method is fully guaranteed, and absolute protection cannot be promised.",
              ],
            },
            {
              title: "5. Data Retention",
              paragraphs: [
                "We retain information as needed for research, service operation, legal compliance, and dispute resolution.",
                "You may request deletion of identifying data you provided, subject to applicable legal obligations.",
              ],
            },
            {
              title: "6. Your Rights and Contact",
              paragraphs: [
                "You can contact us with privacy questions, data correction requests, or deletion requests.",
                "Contact: oilay189@gmail.com",
              ],
            },
            {
              title: "7. Legal Basis for Processing",
              paragraphs: [
                "We process information based on your consent when you submit the survey or provide your email address.",
                "Some processing may also rely on our legitimate interests, including service improvement, system security, and fraud prevention.",
              ],
            },
            {
              title: "8. Cookies and Similar Technologies",
              paragraphs: [
                "The website may use cookies or similar technologies for core functionality, language preference storage, and user experience improvements.",
                "You can block cookies in your browser settings, but some features may not work properly.",
              ],
            },
            {
              title: "9. International Data Transfers",
              paragraphs: [
                "Your data may be processed or stored on servers located outside your country, depending on our infrastructure providers.",
                "In such cases, we implement reasonable safeguards to maintain an adequate level of data protection.",
              ],
            },
            {
              title: "10. Children",
              paragraphs: [
                "The service is not intended for children under 18 without parental or guardian authorization where required by law.",
                "If we learn that personal data from a child was collected in violation of this policy, we will delete it within a reasonable time.",
              ],
            },
            {
              title: "11. Changes to This Policy",
              paragraphs: [
                "We may update this policy from time to time. The latest revision date appears at the top of this page.",
                "Continued use of the website after an update constitutes acceptance of the revised policy.",
              ],
            },
            {
              title: "12. Governing Law and Jurisdiction",
              paragraphs: [
                "This policy is governed by the applicable laws of the State of Israel, unless mandatory law provides otherwise.",
                "Any dispute related to this policy is subject to the exclusive jurisdiction of competent courts in Israel.",
              ],
            },
          ],
        };

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            {content.back}
          </Link>
          <LanguageToggle />
        </div>

        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">{content.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{content.updated}</p>
          <p className="mt-4 text-slate-700">{content.intro}</p>
        </header>

        <div className="space-y-4">
          {content.sections.map((section) => (
            <Section key={section.title} title={section.title} paragraphs={section.paragraphs} />
          ))}
        </div>
      </div>
    </main>
  );
}
