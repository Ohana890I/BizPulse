// Survey.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useLanguage } from "../i18n/LanguageProvider";

const questionBank = [
  {
    key: "industry",
    type: "choice",
    question: "What industry are you in?",
    label: {
      en: "What industry are you in?",
      he: "באיזה תחום העסק שלכם פועל?",
    },
    options: [
      { value: "Restaurant", label: { en: "Restaurant", he: "מסעדנות" } },
      { value: "Retail", label: { en: "Retail", he: "קמעונאות" } },
      { value: "Beauty", label: { en: "Beauty", he: "ביוטי" } },
      { value: "Fitness", label: { en: "Fitness", he: "כושר" } },
      { value: "Construction", label: { en: "Construction", he: "בניה" } },
      { value: "Healthcare", label: { en: "Healthcare", he: "בריאות" } },
      { value: "Education", label: { en: "Education", he: "חינוך" } },
      { value: "Technology", label: { en: "Technology", he: "טכנולוגיה" } },
      { value: "Other", label: { en: "Other", he: "אחר" } },
    ],
  },
  {
    key: "employees",
    type: "choice",
    question: "How many employees do you have?",
    label: {
      en: "How many employees do you have?",
      he: "כמה עובדים יש לכם?",
    },
    options: [
      { value: "Just me", label: { en: "Just me", he: "רק אני" } },
      { value: "2-5", label: { en: "2-5", he: "2-5" } },
      { value: "6-10", label: { en: "6-10", he: "6-10" } },
      { value: "11-25", label: { en: "11-25", he: "11-25" } },
      { value: "26-50", label: { en: "26-50", he: "26-50" } },
      { value: "50+", label: { en: "50+", he: "50+" } },
    ],
  },
  {
    key: "challenge",
    type: "choice",
    question: "What is your biggest daily challenge?",
    label: {
      en: "What is your biggest daily challenge?",
      he: "מה האתגר היומי הגדול ביותר שלכם?",
    },
    options: [
      { value: "Scheduling", label: { en: "Scheduling", he: "תיאום" } },
      { value: "Customers", label: { en: "Customers", he: "לקוחות" } },
      { value: "Inventory", label: { en: "Inventory", he: "מלאי" } },
      { value: "Employees", label: { en: "Employees", he: "עובדים" } },
      { value: "Marketing", label: { en: "Marketing", he: "שיווק" } },
      { value: "Paperwork", label: { en: "Paperwork", he: "ניירת" } },
      { value: "Payments", label: { en: "Payments", he: "תשלומים" } },
      { value: "Other", label: { en: "Other", he: "אחר" } },
    ],
  },
  {
    key: "management",
    type: "choice",
    question: "How do you currently manage your business?",
    label: {
      en: "How do you currently manage your business?",
      he: "איך אתם מנהלים את העסק היום?",
    },
    options: [
      { value: "Excel", label: { en: "Excel", he: "אקסל" } },
      { value: "Paper", label: { en: "Paper", he: "נייר" } },
      { value: "WhatsApp", label: { en: "WhatsApp", he: "וואטסאפ" } },
      {
        value: "Google Sheets",
        label: { en: "Google Sheets", he: "Google Sheets" },
      },
      {
        value: "Dedicated Software",
        label: { en: "Dedicated Software", he: "תוכנה ייעודית" },
      },
      { value: "Nothing", label: { en: "Nothing", he: "שום דבר" } },
    ],
  },
  {
    key: "hoursLost",
    type: "choice",
    question: "How many hours do you lose every week?",
    label: {
      en: "How many hours do you lose every week?",
      he: "כמה שעות אתם מאבדים בכל שבוע?",
    },
    options: [
      { value: "Less than 2", label: { en: "Less than 2", he: "פחות מ-2" } },
      { value: "2-5", label: { en: "2-5", he: "2-5" } },
      { value: "5-10", label: { en: "5-10", he: "5-10" } },
      { value: "10+", label: { en: "10+", he: "10+" } },
    ],
  },
  {
    key: "willingToPay",
    type: "choice",
    question: "Would you pay for software that solves this?",
    label: {
      en: "Would you pay for software that solves this?",
      he: "האם הייתם משלמים על תוכנה שפותרת את זה?",
    },
    options: [
      { value: "Yes", label: { en: "Yes", he: "כן" } },
      { value: "Maybe", label: { en: "Maybe", he: "אולי" } },
      { value: "No", label: { en: "No", he: "לא" } },
    ],
  },
  {
    key: "firstAutomation",
    type: "text",
    question: "What task would you automate first?",
    label: {
      en: "What task would you automate first?",
      he: "איזו משימה הייתם רוצים לאוטומט קודם?",
    },
    placeholder: { en: "Describe it...", he: "תארו אותה..." },
  },
  {
    key: "dreamSoftware",
    type: "text",
    question: "Describe your dream software.",
    label: { en: "Describe your dream software.", he: "תארו את תוכנת החלומות שלכם." },
    placeholder: { en: "Tell us...", he: "ספרו לנו..." },
  },
  {
    key: "frustratingTask",
    type: "text",
    question: "Give us an example of a task that frustrates you the most.",
    label: {
      en: "Give us an example of a task that frustrates you the most.",
      he: "תנו דוגמה למשימה שהכי מתסכלת אתכם.",
    },
    placeholder: { en: "Tell us...", he: "ספרו לנו..." },
  },
  {
    key: "wish",
    type: "text",
    question: "One thing you wish technology could do",
    label: { en: "One thing you wish technology could do", he: "דבר אחד שהייתם רוצים שטכנולוגיה תעשה" },
    placeholder: { en: "Tell us...", he: "ספרו לנו..." },
  },
  {
    key: "other",
    type: "text",
    question: "Anything else you'd like to tell us?",
    label: {
      en: "Anything else you'd like to tell us?",
      he: "יש עוד משהו שתרצו לספר לנו?",
    },
    placeholder: { en: "Optional...", he: "אופציונלי..." },
  },
];

export default function Survey() {
  const { language } = useLanguage();
  const isHebrew = language === "he";
  const copy = isHebrew
    ? {
        progress: "שאלה",
        of: "מתוך",
        back: "חזרה",
        next: "הבא",
        finish: "סיום",
        submitting: "שולח...",
        thankYou: "תודה רבה!",
        support: "המשוב שלכם עוזר לנו לבנות תוכנה טובה יותר.",
        notifyTitle: "רוצים לדעת מתי BizPulse מושק?",
        emailPlaceholder: "your@email.com",
        notifyButton: "עדכנו אותי",
        submitAnother: "שליחת תגובה נוספת",
        submitError: "שליחת הסקר נכשלה.",
        saveError: "לא הצלחנו לשמור את האימייל.",
        savedEmail: "נרשמתם בהצלחה! 🎉",
        consentPrefix: "בשליחת הסקר הינכם מסכימים ומאשרים את",
        privacy: "מדיניות הפרטיות",
        and: "ו",
        terms: "תנאי השימוש שלנו",
      }
    : {
        progress: "Question",
        of: "of",
        back: "Back",
        next: "Next",
        finish: "Finish",
        submitting: "Submitting...",
        thankYou: "Thank You!",
        support: "Your feedback helps us build better software.",
        notifyTitle: "Want to know when BizPulse launches?",
        emailPlaceholder: "your@email.com",
        notifyButton: "Notify Me",
        submitAnother: "Submit another response",
        submitError: "Failed to submit survey.",
        saveError: "Couldn't save email.",
        savedEmail: "You're on the list! 🎉",
        consentPrefix: "By submitting this survey, you agree to our",
        privacy: "Privacy Policy",
        and: "and",
        terms: "Terms of Use",
      };

  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState(Array(questionBank.length).fill(""));
  const [completed,setCompleted]=useState(false);
  const [email,setEmail]=useState("");
  const [sending,setSending]=useState(false);

  const current=questionBank[step];
  const progress=((step+1)/questionBank.length)*100;

  const updateAnswer=(value)=>{
    const copy=[...answers];
    copy[step]=value;
    setAnswers(copy);

    if(current.type==="choice"){
      setTimeout(()=>{
        if(step<questionBank.length-1){
          setStep(s=>s+1);
        }
      },250);
    }
  };

  const next=async()=>{
    if(!answers[step].trim()) return;

    if(step<questionBank.length-1){
      setStep(step+1);
      return;
    }

    try{
      setSending(true);
      await addDoc(collection(db,"responses"),{
        answers: questionBank.map((q,i)=>({
          question:q.question,
          answer:answers[i]
        })),
        createdAt:serverTimestamp()
      });
      setCompleted(true);
    }catch(e){
      console.error(e);
      alert(copy.submitError);
    }finally{
      setSending(false);
    }
  };

  const back=()=>{
    if(step>0) setStep(step-1);
  };

  const saveEmail=async()=>{
    if(!email.trim()) return;

    try{
      await addDoc(collection(db,"emails"),{
        email:email.trim(),
        createdAt:serverTimestamp()
      });
      alert(copy.savedEmail);
      setEmail("");
    }catch(e){
      console.error(e);
      alert(copy.saveError);
    }
  };

  if(completed){
    return(
      <motion.section
        id="survey-section"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="py-24 px-6"
      >
        <motion.div
          initial={{opacity:0,scale:.95}}
          animate={{opacity:1,scale:1}}
          className="mx-auto max-w-2xl rounded-3xl bg-white p-12 text-center shadow-xl"
        >
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-4xl font-black mb-4">{copy.thankYou}</h1>
          <p className="text-gray-600 mb-8">
            {copy.support}
          </p>

          <h2 className="text-2xl font-bold mb-3">
            {copy.notifyTitle}
          </h2>

          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder={copy.emailPlaceholder}
            className="w-full rounded-xl border p-4 mb-4"
          />

          <button
            onClick={saveEmail}
            className="w-full rounded-xl bg-[#D4AF37] py-4 text-white font-semibold"
          >
            {copy.notifyButton}
          </button>

          <button
            onClick={()=>{
              setCompleted(false);
              setStep(0);
              setEmail("");
              setAnswers(Array(questionBank.length).fill(""));
            }}
            className="mt-6 underline text-gray-500"
          >
            {copy.submitAnother}
          </button>
        </motion.div>
      </motion.section>
    );
  }

  return(
    <motion.section
      id="survey-section"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="py-24 px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl"
      >
        <div className="h-3 rounded-full bg-gray-200 overflow-hidden mb-8">
          <div className="h-full bg-[#D4AF37]" style={{width:`${progress}%`}}/>
        </div>

        <p className="mb-2 text-gray-500">
          {copy.progress} {step+1} {copy.of} {questionBank.length}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{opacity:0,x:40}}
            animate={{opacity:1,x:0}}
            exit={{opacity:0,x:-40}}
          >
            <h2 className="text-3xl font-bold mb-8">{current.label[language]}</h2>

            {current.type==="choice" ? (
              <div className="grid gap-4">
                {current.options.map(option=>(
                  <button
                    key={option.value}
                    onClick={()=>updateAnswer(option.value)}
                    className={`rounded-2xl border p-5 transition ${
                      isHebrew ? "text-right" : "text-left"
                    } ${
                      answers[step]===option.value
                      ? "border-[#D4AF37] bg-[#D4AF37] text-white"
                      : "border-gray-300 hover:border-[#D4AF37]"
                    }`}
                  >
                    {option.label[language]}
                  </button>
                ))}
              </div>
            ):(
              <textarea
                rows={5}
                value={answers[step]}
                onChange={(e)=>updateAnswer(e.target.value)}
                placeholder={current.placeholder[language]}
                className={`w-full rounded-2xl border p-5 ${
                  isHebrew ? "text-right" : "text-left"
                }`}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {step === questionBank.length - 1 ? (
          <p className={`mt-6 text-xs text-gray-500 ${isHebrew ? "text-right" : "text-left"}`}>
            {copy.consentPrefix} {" "}
            <Link to="/privacy-policy" className="font-semibold text-[#bf9827] underline underline-offset-2">
              {copy.privacy}
            </Link>{" "}
            {copy.and} {" "}
            <Link to="/terms-of-use" className="font-semibold text-[#bf9827] underline underline-offset-2">
              {copy.terms}
            </Link>
            .
          </p>
        ) : null}

        <div className="mt-10 flex justify-between">
          <button
            onClick={back}
            disabled={step===0}
            className="flex items-center gap-2 rounded-xl border px-6 py-3 disabled:opacity-40"
          >
            <ArrowLeft size={18}/>{copy.back}
          </button>

          <button
            onClick={next}
            disabled={sending}
            className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-white font-semibold disabled:opacity-50"
          >
            {sending ? copy.submitting : step===questionBank.length-1 ? copy.finish : copy.next}
            <ArrowRight size={18}/>
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}
