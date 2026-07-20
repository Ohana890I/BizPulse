import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import * as XLSX from "xlsx";
import { db } from "../firebase/firebase";
import AnalyticsSection from "../components/dashboard/AnalyticsSection";
import LanguageToggle from "../components/LanguageToggle";
import StatsCards from "../components/dashboard/StatsCards";
import SurveyCard from "../components/dashboard/SurveyCard";
import SurveyDetails from "../components/dashboard/SurveyDetails";
import { useLanguage } from "../i18n/LanguageProvider";
import {
  CHALLENGE_QUESTION,
  INDUSTRY_QUESTION,
  getAnswerByQuestion,
} from "../components/dashboard/analyticsUtils";

const ADMIN_PASSWORD = "ilay";
const ADMIN_AUTH_KEY = "bizpulse-admin-auth";

function getTimestampMillis(value) {
  if (!value) {
    return 0;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  if (typeof value.seconds === "number") {
    return value.seconds * 1000;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatSubmissionDate(value, locale) {
  const millis = getTimestampMillis(value);

  if (!millis) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(millis));
}

function buildSearchText(answers) {
  if (!Array.isArray(answers)) {
    return "";
  }

  return answers
    .map((item) => `${item?.question ?? ""} ${item?.answer ?? ""}`)
    .join(" ")
    .toLowerCase();
}

function normalizeSurvey(docSnap, locale) {
  const data = docSnap.data();
  const answers = Array.isArray(data.answers) ? data.answers : [];

  return {
    id: docSnap.id,
    answers,
    createdAt: data.createdAt || null,
    createdAtMillis: getTimestampMillis(data.createdAt),
    industry: getAnswerByQuestion(answers, INDUSTRY_QUESTION),
    challenge: getAnswerByQuestion(answers, CHALLENGE_QUESTION),
    submissionDate: formatSubmissionDate(data.createdAt, locale),
    searchText: buildSearchText(answers),
  };
}

function exportSurveyToExcel(survey) {
  const rows = survey.answers.map((item) => ({
    Question: item?.question ?? "",
    Answer: item?.answer ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Survey");
  XLSX.writeFile(workbook, `Survey-${survey.anonymousNumber}.xlsx`);
}

export default function Admin() {
  const { language } = useLanguage();
  const locale = language === "he" ? "he-IL" : "en-GB";
  const copy =
    language === "he"
      ? {
          admin: "ניהול Pulse",
          title: "לוח תגובות",
          description:
            "סקירה של כל השליחות במקום אחד, חיפוש בתוך כל התשובות, ופתיחת תגובה בלי לצאת מהדשבורד.",
          collections: "אוספים",
          collectionsValue: "responses + emails",
          loadError: "לא ניתן לטעון את נתוני הדשבורד.",
          retry: "נסה שוב",
          deleteConfirm: "למחוק את הסקר הזה? לא ניתן לשחזר.",
          responsesTitle: "תשובות סקר",
          visible: "מוצגים",
          of: "מתוך",
          noResults: "אין תוצאות שתואמות לחיפוש.",
          noResultsHint: "נסו מונח אחר כמו תחום או אתגר.",
          authTitle: "כניסה לאדמין",
          authDescription: "כדי לצפות בדשבורד, הזינו סיסמה.",
          authPlaceholder: "הזינו סיסמה",
          authButton: "כניסה",
          authError: "סיסמה שגויה.",
        }
      : {
          admin: "Pulse Admin",
          title: "Responses dashboard",
          description:
            "Review every submission from one place, search across all answers, and open a response without leaving the dashboard.",
          collections: "Collections",
          collectionsValue: "responses + emails",
          loadError: "Unable to load dashboard data.",
          retry: "Retry",
          deleteConfirm: "Delete this survey? This cannot be undone.",
          responsesTitle: "Survey responses",
          visible: "visible",
          of: "of",
          noResults: "No responses match your search.",
          noResultsHint: "Try a different answer, industry, or challenge term.",
          authTitle: "Admin Access",
          authDescription: "Enter the password to view the dashboard.",
          authPlaceholder: "Enter password",
          authButton: "Sign in",
          authError: "Incorrect password.",
        };

  const [responses, setResponses] = useState([]);
  const [emailsCount, setEmailsCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [error, setError] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(
    () => window.sessionStorage.getItem(ADMIN_AUTH_KEY) === "1"
  );

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }

    loadData();

    const unsubscribeResponses = onSnapshot(
      collection(db, "responses"),
      (responsesSnap) => {
        const normalizedResponses = responsesSnap.docs
          .map((docSnap) => normalizeSurvey(docSnap, locale))
          .sort((left, right) => right.createdAtMillis - left.createdAtMillis)
          .map((survey, index) => ({
            ...survey,
            anonymousNumber: index + 1,
          }));

        setResponses(normalizedResponses);
        setError("");
        setLoading(false);
      },
      (snapshotError) => {
        console.error(snapshotError);
        setError(copy.loadError);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeResponses();
    };
  }, [isAuthorized, locale, copy.loadError]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [responsesSnap, emailsSnap] = await Promise.all([
        getDocs(collection(db, "responses")),
        getDocs(collection(db, "emails")),
      ]);

      const normalizedResponses = responsesSnap.docs
        .map((docSnap) => normalizeSurvey(docSnap, locale))
        .sort((left, right) => right.createdAtMillis - left.createdAtMillis)
        .map((survey, index) => ({
          ...survey,
          anonymousNumber: index + 1,
        }));

      setResponses(normalizedResponses);
      setEmailsCount(emailsSnap.size);
    } catch (loadError) {
      console.error(loadError);
      setError(copy.loadError);
    } finally {
      setLoading(false);
    }
  }

  async function removeSurvey(survey) {
    if (!window.confirm(copy.deleteConfirm)) {
      return;
    }

    await deleteDoc(doc(db, "responses", survey.id));
    setResponses((current) => current.filter((item) => item.id !== survey.id));
    setSelectedSurvey(null);
  }

  const filteredResponses = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return responses;
    }

    return responses.filter((response) => response.searchText.includes(term));
  }, [responses, search]);

  function submitAdminPassword(event) {
    event.preventDefault();

    if (passwordInput.trim() !== ADMIN_PASSWORD) {
      setAuthError(copy.authError);
      return;
    }

    window.sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
    setIsAuthorized(true);
    setAuthError("");
    setPasswordInput("");
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,1),_rgba(248,250,252,1)_40%,_rgba(241,245,249,1)_100%)] px-6 py-10 text-slate-950">
        <div className="mx-auto max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
            {copy.admin}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {copy.authTitle}
          </h1>
          <p className="mt-3 text-sm text-slate-600">{copy.authDescription}</p>

          <form onSubmit={submitAdminPassword} className="mt-6 space-y-3">
            <input
              type="password"
              value={passwordInput}
              onChange={(event) => {
                setPasswordInput(event.target.value);
                if (authError) {
                  setAuthError("");
                }
              }}
              placeholder={copy.authPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              autoComplete="current-password"
            />

            {authError ? <p className="text-sm font-medium text-rose-600">{authError}</p> : null}

            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {copy.authButton}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const dashboard = (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,1),_rgba(248,250,252,1)_40%,_rgba(241,245,249,1)_100%)] text-slate-950">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-12%] h-72 w-72 rounded-full bg-slate-200/60 blur-3xl" />
        <div className="absolute right-[-8%] top-[8%] h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute bottom-[-14%] left-[35%] h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              {copy.admin}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
              {copy.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <div className="rounded-3xl border border-white/70 bg-white/80 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {copy.collections}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {copy.collectionsValue}
              </p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="grid gap-4 lg:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-3xl bg-slate-100"
                />
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-[1.75rem] bg-slate-100"
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-lg font-semibold">{error}</p>
            <button
              onClick={loadData}
              className="mt-4 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              {copy.retry}
            </button>
          </div>
        ) : selectedSurvey ? (
          <SurveyDetails
            survey={selectedSurvey}
            onBack={() => setSelectedSurvey(null)}
            onExport={() => exportSurveyToExcel(selectedSurvey)}
            onDelete={() => removeSurvey(selectedSurvey)}
          />
        ) : (
          <>
            <AnalyticsSection responses={responses} />

            <StatsCards
              responseCount={responses.length}
              emailCount={emailsCount}
              searchValue={search}
              onSearchChange={setSearch}
            />

            <section className="mt-8">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
                    {copy.responsesTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {filteredResponses.length} {copy.of} {responses.length} {copy.visible}
                  </p>
                </div>
              </div>

              {filteredResponses.length === 0 ? (
                <div className="rounded-[2rem] border border-white/70 bg-white/80 p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                  <p className="text-lg font-semibold text-slate-900">
                    {copy.noResults}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {copy.noResultsHint}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredResponses.map((survey) => (
                    <SurveyCard
                      key={survey.id}
                      survey={survey}
                      onOpen={() => setSelectedSurvey(survey)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );

  return dashboard;
}
