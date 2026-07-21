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

export default function TermsOfUse() {
  const { language } = useLanguage();

  const content =
    language === "he"
      ? {
          back: "חזרה לעמוד הבית",
          title: "תנאי שימוש",
          updated: "עודכן לאחרונה: 20 ביולי 2026",
          intro:
            "השימוש באתר ובשירותי Pulse כפוף לתנאים הבאים. שימוש באתר מהווה הסכמה לתנאים אלו.",
          sections: [
            {
              title: "1. קבלת התנאים",
              paragraphs: [
                "בשימוש באתר אתם מאשרים שקראתם והסכמתם לתנאי השימוש.",
                "אם אינכם מסכימים לתנאים, אנא הימנעו משימוש באתר.",
              ],
            },
            {
              title: "2. השימוש בשירות",
              paragraphs: [
                "השירות מיועד לצרכים עסקיים, מחקריים ומידעיים בלבד.",
                "אין להשתמש באתר למטרה בלתי חוקית או באופן שעלול לפגוע בשירות או במשתמשים אחרים.",
              ],
            },
            {
              title: "3. תוכן משתמשים",
              paragraphs: [
                "האחריות לתוכן שאתם מזינים בטפסים היא שלכם בלבד.",
                "אין להזין תוכן פוגעני, מטעה, בלתי חוקי, או תוכן שמפר זכויות של צד שלישי.",
              ],
            },
            {
              title: "4. קניין רוחני",
              paragraphs: [
                "כל הזכויות באתר, בעיצוב, במותג, ובתוכן המקורי שמורות ל-Pulse אלא אם צוין אחרת.",
                "אין להעתיק, להפיץ, או להשתמש בתכנים ללא אישור מראש ובכתב.",
              ],
            },
            {
              title: "5. זמינות השירות ושינויים",
              paragraphs: [
                "אנחנו רשאים לעדכן, לשנות או להפסיק חלקים מהשירות בכל עת.",
                "ייתכנו תקלות, השבתות זמניות או שינויים בפיצ'רים ללא הודעה מוקדמת.",
              ],
            },
            {
              title: "6. הגבלת אחריות",
              paragraphs: [
                "השירות ניתן כפי שהוא (AS IS) וללא התחייבות להתאמה מלאה לצרכים ספציפיים.",
                "בכפוף לדין החל, Pulse לא תהיה אחראית לנזק עקיף, תוצאתי, או אובדן נתונים או רווחים הנובע מהשימוש בשירות.",
              ],
            },
            {
              title: "7. יצירת קשר",
              paragraphs: [
                "לשאלות בנוגע לתנאי השימוש ניתן לפנות אלינו בכתובת: team@bizpulse.space",
              ],
            },
            {
              title: "8. חשבונות וגישה לאדמין",
              paragraphs: [
                "גישה לאזורים מוגבלים (לרבות אדמין) מותרת רק למורשים ובכפוף לאמצעי הזדהות תקפים.",
                "חל איסור לשתף פרטי גישה עם צדדים שלישיים ללא אישור מפורש מאיתנו.",
              ],
            },
            {
              title: "9. התנהלות אסורה",
              paragraphs: [
                "אין לבצע ניסיונות חדירה, סריקה אוטומטית, עקיפת מגבלות גישה, או הפרעה לפעילות התקינה של האתר.",
                "אין להעלות תוכן הכולל קוד זדוני, קישורים מזיקים, או מידע שנועד להטעות משתמשים אחרים.",
              ],
            },
            {
              title: "10. שיפוי",
              paragraphs: [
                "הנכם מתחייבים לשפות את Pulse בגין כל נזק, תביעה, או הוצאה שייגרמו עקב הפרת תנאים אלה או הפרת דין מצדכם.",
              ],
            },
            {
              title: "11. סיום או השעיית שימוש",
              paragraphs: [
                "אנו רשאים להשעות או לחסום גישה לשירות, באופן זמני או קבוע, במקרה של הפרת תנאי שימוש או חשד לשימוש לרעה.",
              ],
            },
            {
              title: "12. שינויים בתנאים",
              paragraphs: [
                "אנחנו רשאים לעדכן תנאים אלה מעת לעת. תאריך העדכון האחרון יופיע בראש העמוד.",
                "המשך שימוש באתר לאחר העדכון יהווה הסכמה לתנאים המעודכנים.",
              ],
            },
            {
              title: "13. הדין החל וסמכות שיפוט",
              paragraphs: [
                "על תנאי שימוש אלה יחולו דיני מדינת ישראל, אלא אם נקבע אחרת לפי דין מחייב.",
                "סמכות השיפוט הבלעדית לכל מחלוקת בקשר לתנאים תהיה לבתי המשפט המוסמכים בישראל.",
              ],
            },
          ],
        }
      : {
          back: "Back to Home",
          title: "Terms of Use",
          updated: "Last updated: July 20, 2026",
          intro:
            "Use of the Pulse website and services is subject to these terms. By using the site, you agree to these Terms of Use.",
          sections: [
            {
              title: "1. Acceptance of Terms",
              paragraphs: [
                "By using this website, you confirm that you have read and agreed to these terms.",
                "If you do not agree, please do not use the website.",
              ],
            },
            {
              title: "2. Use of Service",
              paragraphs: [
                "The service is provided for business, research, and informational purposes.",
                "You must not use the site for unlawful purposes or in ways that may harm the platform or other users.",
              ],
            },
            {
              title: "3. User Content",
              paragraphs: [
                "You are solely responsible for content you submit through forms.",
                "You must not submit unlawful, abusive, misleading, or rights-infringing content.",
              ],
            },
            {
              title: "4. Intellectual Property",
              paragraphs: [
                "All rights in the website, design, branding, and original content belong to Pulse unless otherwise stated.",
                "You may not copy, distribute, or reuse content without prior written permission.",
              ],
            },
            {
              title: "5. Availability and Changes",
              paragraphs: [
                "We may update, modify, or discontinue parts of the service at any time.",
                "Temporary interruptions, maintenance windows, or feature changes may occur without prior notice.",
              ],
            },
            {
              title: "6. Limitation of Liability",
              paragraphs: [
                "The service is provided on an AS IS basis without warranties of suitability for every specific use case.",
                "To the maximum extent permitted by law, Pulse is not liable for indirect, consequential, or incidental damages, including data loss or loss of profits.",
              ],
            },
            {
              title: "7. Contact",
              paragraphs: [
                "For questions regarding these Terms of Use, contact: team@bizpulse.space",
              ],
            },
            {
              title: "8. Accounts and Admin Access",
              paragraphs: [
                "Access to restricted areas (including admin functionality) is limited to authorized users using valid credentials.",
                "You must not share access credentials with third parties without our explicit approval.",
              ],
            },
            {
              title: "9. Prohibited Conduct",
              paragraphs: [
                "You must not attempt unauthorized access, automated scraping, access-control bypass, or disruption of normal service operation.",
                "You must not submit malicious code, harmful links, or deceptive information intended to mislead other users.",
              ],
            },
            {
              title: "10. Indemnification",
              paragraphs: [
                "You agree to indemnify and hold Pulse harmless from claims, damages, losses, and expenses arising from your breach of these terms or violation of applicable law.",
              ],
            },
            {
              title: "11. Suspension and Termination",
              paragraphs: [
                "We may suspend or terminate access to the service, temporarily or permanently, in cases of misuse or breach of these terms.",
              ],
            },
            {
              title: "12. Changes to Terms",
              paragraphs: [
                "We may revise these terms from time to time. The latest revision date will appear at the top of this page.",
                "Continued use of the website after revisions constitutes acceptance of the updated terms.",
              ],
            },
            {
              title: "13. Governing Law and Jurisdiction",
              paragraphs: [
                "These terms are governed by the applicable laws of the State of Israel, unless mandatory law provides otherwise.",
                "Any dispute arising from these terms is subject to the exclusive jurisdiction of competent courts in Israel.",
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
