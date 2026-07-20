import { useLanguage } from "../i18n/LanguageProvider";
import { Link } from "react-router-dom";

function Footer() {
  const { language } = useLanguage();
  const content =
    language === "he"
      ? {
          copy: "© 2026 Pulse. נבנה כדי לפתור בעיות אמיתיות בעסקים.",
          contact: "יצירת קשר",
          privacy: "מדיניות פרטיות",
          terms: "תנאי שימוש",
        }
      : {
          copy: "© 2026 Pulse. Built to solve real business problems.",
          contact: "Contact",
          privacy: "Privacy Policy",
          terms: "Terms of Use",
        };

  return (
    <footer className="border-t border-gray-200 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center md:flex-row">
        <h2 className="text-2xl font-bold">
          <span className="text-gray-900">Pulse</span>
        </h2>

        <p className="text-gray-500">{content.copy}</p>

        <div className="flex flex-col items-center gap-1">
          <div className="mb-1 flex items-center gap-4 text-sm text-gray-500">
            <Link to="/privacy-policy" className="transition hover:text-[#bf9827]">
              {content.privacy}
            </Link>
            <Link to="/terms-of-use" className="transition hover:text-[#bf9827]">
              {content.terms}
            </Link>
          </div>

          <a
            href="mailto:oilay189@gmail.com"
            className="text-[#D4AF37] transition hover:text-[#bf9827]"
          >
            {content.contact}
          </a>

          <a
            href="mailto:oilay189@gmail.com"
            className="text-sm text-gray-500 transition hover:text-[#bf9827]"
          >
            oilay189@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;