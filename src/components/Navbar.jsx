import { motion } from "framer-motion";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../i18n/LanguageProvider";

function Navbar({ onStartSurvey }) {
  const { language } = useLanguage();
  const startLabel = language === "he" ? "התחל סקר" : "Start Survey";

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="text-gray-900">Biz</span>
          <span className="text-[#D4AF37]">Pulse</span>
        </h1>

        <div className="flex items-center gap-3">
          <LanguageToggle />

          <button
            type="button"
            onClick={onStartSurvey}
            className="rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#bf9827] active:scale-95"
          >
            {startLabel}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;