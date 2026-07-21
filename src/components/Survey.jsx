// Survey.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useLanguage } from "../i18n/LanguageProvider";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MAX_CODE_RETRIES = 10;

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

function isValidEmail(value) {
  return EMAIL_REGEX.test(value.trim());
}

function getRandomBytes(length) {
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const bytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  }

  return Uint8Array.from(
    Array.from({ length }, () => Math.floor(Math.random() * 256))
  );
}

function randomCodeSegment(length) {
  const bytes = getRandomBytes(length);
  let segment = "";

  for (let index = 0; index < length; index += 1) {
    segment += CODE_ALPHABET[bytes[index] % CODE_ALPHABET.length];
  }

  return segment;
}

function generateFounderCode() {
  return `FOUNDER-${randomCodeSegment(4)}-${randomCodeSegment(4)}`;
}

async function sendFounderWelcomeEmail(email) {
  const response = await fetch("/api/emails/welcome-founder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`Welcome email failed with status ${response.status}`);
  }
}

async function generateUniqueFounderCode() {
  for (let attempt = 0; attempt < MAX_CODE_RETRIES; attempt += 1) {
    const code = generateFounderCode();
    const codeQuery = query(
      collection(db, "founderPasses"),
      where("founderCode", "==", code),
      limit(1)
    );
    const codeSnapshot = await getDocs(codeQuery);

    if (codeSnapshot.empty) {
      return code;
    }
  }

  throw new Error("Unable to generate a unique founder code.");
}

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
        founderPassTitle: "🎁 Founder Pass",
        founderPassDescription: "כל עסק שמשלים את הסקר יקבל:",
        founderPassBenefits: [
          "🚀 חודש 1 בחינם על המוצר הראשון של Pulse.",
          "💸 50% הנחה ל-12 החודשים הבאים.",
          "⭐ גישה מוקדמת למוצרים ופיצ'רים עתידיים.",
          "👑 סטטוס Founder כאחד התומכים הראשונים שלנו.",
        ],
        notifyTitle: "רוצים לשריין את Founder Pass שלכם להשקה של Pulse?",
        emailPlaceholder: "your@email.com",
        notifyButton: "שריינו את Founder Pass שלי",
        marketingConsent:
          "אני מסכים/ה לקבל עדכונים מ-Pulse לגבי השקות מוצר, הטבות Founder והודעות חשובות.",
        invalidEmail: "נא להזין כתובת אימייל תקינה.",
        alreadyReserved: "כבר שריינתם Founder Pass עם כתובת האימייל הזו.",
        reserveError: "לא הצלחנו לשריין Founder Pass כרגע. נסו שוב.",
        reserveSuccessTitle: "🎉 Founder Pass שלכם שוריין בהצלחה!",
        reserveSuccessBody: "תודה שעזרתם לנו לבנות את Pulse.",
        reserveSuccessNote:
          "כש-Pulse יושק רשמית, נשלח את Founder Pass האישי שלכם ישירות לאימייל.",
        reserveSuccessIncludes: "Founder Pass שלכם כולל:",
        reserveIncludes: [
          "🚀 חודש 1 בחינם",
          "💸 50% הנחה ל-12 חודשים",
          "⭐ גישה מוקדמת",
          "👑 סטטוס Founder",
        ],
        securityTitle: "אבטחת Founder Pass",
        securityPoints: [
          "מקושר לכתובת האימייל של הבעלים בלבד",
          "ניתן למימוש חד פעמי בלבד",
          "לא ניתן להעברה למשתמש אחר",
          "יישלח באימייל רק בעת ההשקה הרשמית",
        ],
        submitAnother: "שליחת תגובה נוספת",
        submitError: "שליחת הסקר נכשלה.",
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
        founderPassTitle: "🎁 Founder Pass",
        founderPassDescription: "Every business that completes the survey will receive:",
        founderPassBenefits: [
          "🚀 1 month FREE on the first Pulse product.",
          "💸 50% OFF for the following 12 months.",
          "⭐ Early access to future products and features.",
          "👑 Founder status as one of our first supporters.",
        ],
        notifyTitle: "Want to reserve your Founder Pass for the Pulse launch?",
        emailPlaceholder: "your@email.com",
        notifyButton: "Reserve My Founder Pass",
        marketingConsent:
          "I agree to receive updates from Pulse regarding product launches, Founder rewards and important announcements.",
        invalidEmail: "Please enter a valid email address.",
        alreadyReserved: "You have already reserved your Founder Pass.",
        reserveError: "We could not reserve your Founder Pass right now. Please try again.",
        reserveSuccessTitle: "🎉 Your Founder Pass has been successfully reserved!",
        reserveSuccessBody: "Thank you for helping us build Pulse.",
        reserveSuccessNote:
          "When Pulse officially launches, we will send your personal Founder Pass directly to your email.",
        reserveSuccessIncludes: "Your Founder Pass includes:",
        reserveIncludes: [
          "🚀 1 month FREE",
          "💸 50% OFF for 12 months",
          "⭐ Early access",
          "👑 Founder status",
        ],
        securityTitle: "Founder Pass Security",
        securityPoints: [
          "Linked to the owner's email only",
          "Can only be redeemed once",
          "Cannot be transferred to another user",
          "Will be sent by email only at official launch",
        ],
        submitAnother: "Submit another response",
        submitError: "Failed to submit survey.",
        consentPrefix: "By submitting this survey, you agree to our",
        privacy: "Privacy Policy",
        and: "and",
        terms: "Terms of Use",
      };

  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState(Array(questionBank.length).fill(""));
  const [completed,setCompleted]=useState(false);
  const [email,setEmail]=useState("");
  const [marketingConsent,setMarketingConsent]=useState(false);
  const [emailError,setEmailError]=useState("");
  const [founderError,setFounderError]=useState("");
  const [founderNotice,setFounderNotice]=useState("");
  const [founderReserved,setFounderReserved]=useState(false);
  const [reservingFounderPass,setReservingFounderPass]=useState(false);
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

  const reserveFounderPass=async()=>{
    const normalizedEmail=email.trim().toLowerCase();

    if(!isValidEmail(normalizedEmail)){
      setEmailError(copy.invalidEmail);
      return;
    }

    if(!marketingConsent){
      return;
    }

    setEmailError("");
    setFounderError("");
    setFounderNotice("");
    setReservingFounderPass(true);

    try{
      const existingPassQuery = query(
        collection(db, "founderPasses"),
        where("email", "==", normalizedEmail),
        limit(1)
      );
      const existingPassSnapshot = await getDocs(existingPassQuery);

      if(!existingPassSnapshot.empty){
        setFounderNotice(copy.alreadyReserved);
        return;
      }

      const founderCode = await generateUniqueFounderCode();

      await addDoc(collection(db,"founderPasses"),{
        email:normalizedEmail,
        founderCode,
        marketingConsent:true,
        used:false,
        usedAt:null,
        surveyCompleted:true,
        createdAt:serverTimestamp()
      });

      await addDoc(collection(db,"emails"),{
        email:normalizedEmail,
        createdAt:serverTimestamp()
      });

      try {
        await sendFounderWelcomeEmail(normalizedEmail);
      } catch (emailSendError) {
        console.error("Founder pass reserved but welcome email failed", {
          email: normalizedEmail,
          error: emailSendError?.message || emailSendError,
        });
      }

      setFounderReserved(true);
      setEmail("");
      setMarketingConsent(false);
    }catch(e){
      console.error(e);
      setFounderError(copy.reserveError);
    }finally{
      setReservingFounderPass(false);
    }
  };

  const canReserveFounderPass = isValidEmail(email) && marketingConsent && !reservingFounderPass;

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

          {founderReserved ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-left"
            >
              <h2 className="text-2xl font-extrabold text-emerald-900">{copy.reserveSuccessTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-emerald-900 sm:text-base">{copy.reserveSuccessBody}</p>
              <p className="mt-2 text-sm leading-7 text-emerald-800 sm:text-base">{copy.reserveSuccessNote}</p>

              <p className="mt-5 text-sm font-semibold text-emerald-900">{copy.reserveSuccessIncludes}</p>
              <ul className="mt-2 space-y-1 text-sm text-emerald-900">
                {copy.reserveIncludes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#fffaf0] via-white to-[#f7faff] p-6 text-left shadow-lg"
              >
                <h2 className="text-2xl font-extrabold text-gray-900">{copy.founderPassTitle}</h2>
                <p className="mt-2 text-sm font-medium text-gray-700 sm:text-base">{copy.founderPassDescription}</p>

                <ul className="mt-4 space-y-2 text-sm text-gray-700 sm:text-base">
                  {copy.founderPassBenefits.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="mt-5 rounded-2xl bg-white/70 p-4 text-xs text-gray-600 sm:text-sm">
                  <p className="font-semibold text-gray-800">{copy.securityTitle}</p>
                  <ul className="mt-2 space-y-1">
                    {copy.securityPoints.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold mb-3">
                {copy.notifyTitle}
              </h2>

              <input
                type="email"
                value={email}
                onChange={(e)=>{
                  setEmail(e.target.value);
                  if(emailError){
                    setEmailError("");
                  }
                }}
                placeholder={copy.emailPlaceholder}
                className="w-full rounded-xl border p-4 mb-3"
              />

              <label className="mb-4 flex items-start gap-3 text-left text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(event)=>setMarketingConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <span>{copy.marketingConsent}</span>
              </label>

              {emailError ? <p className="mb-2 text-left text-sm text-rose-600">{emailError}</p> : null}
              {founderNotice ? <p className="mb-2 text-left text-sm text-amber-700">{founderNotice}</p> : null}
              {founderError ? <p className="mb-2 text-left text-sm text-rose-600">{founderError}</p> : null}

              <button
                onClick={reserveFounderPass}
                disabled={!canReserveFounderPass}
                className="w-full rounded-xl bg-[#D4AF37] py-4 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reservingFounderPass ? copy.submitting : copy.notifyButton}
              </button>
            </>
          )}

          <button
            onClick={()=>{
              setCompleted(false);
              setStep(0);
              setEmail("");
              setMarketingConsent(false);
              setEmailError("");
              setFounderError("");
              setFounderNotice("");
              setFounderReserved(false);
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
