import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHALLENGE_QUESTION,
  INDUSTRY_QUESTION,
  buildHoursLostDistribution,
  buildWillingToPayStats,
  countByQuestion,
  getMostCommon,
  mapToSortedEntries,
} from "./analyticsUtils";
import { useLanguage } from "../../i18n/LanguageProvider";

const PIE_COLORS = [
  "#0ea5e9",
  "#14b8a6",
  "#f59e0b",
  "#6366f1",
  "#ef4444",
  "#8b5cf6",
  "#10b981",
  "#f97316",
  "#ec4899",
  "#6b7280",
];

function AnalyticsCard({ title, icon, children }) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {icon} {title}
      </p>
      <div className="mt-4 space-y-2">{children}</div>
    </article>
  );
}

function ChartShell({ title, subtitle, children }) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="mt-6 h-72">{children}</div>
    </article>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const point = payload[0];
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-md">
      <p className="font-semibold text-slate-900">{point.name}</p>
      <p className="mt-1">{point.value} {label}</p>
    </div>
  );
}

export default function AnalyticsSection({ responses }) {
  const { language } = useLanguage();
  const content =
    language === "he"
      ? {
          title: "אנליטיקות",
          subtitle: "סטטיסטיקות חיות מכל תשובות הסקר.",
          mostIndustry: "התחום הנפוץ ביותר",
          mostChallenge: "האתגר הנפוץ ביותר",
          responses: "תגובות",
          willingToPay: "נכונות לשלם",
          yes: "כן",
          maybe: "אולי",
          no: "לא",
          yesMaybe: "כן/אולי",
          hoursLost: "שעות אבודות",
          industryDistribution: "התפלגות תחומים",
          challengesDistribution: "האתגרים היומיים הגדולים",
          industryBasedOn: "מבוסס על השאלה: באיזה תחום אתם פועלים?",
          challengeBasedOn: "מבוסס על השאלה: מה האתגר היומי הגדול ביותר?",
        }
      : {
          title: "Analytics",
          subtitle: "Live statistics generated from all survey responses.",
          mostIndustry: "Most Common Industry",
          mostChallenge: "Most Common Challenge",
          responses: "responses",
          willingToPay: "Willing To Pay",
          yes: "Yes",
          maybe: "Maybe",
          no: "No",
          yesMaybe: "Yes/Maybe",
          hoursLost: "Hours Lost",
          industryDistribution: "Industry Distribution",
          challengesDistribution: "Biggest Daily Challenges",
          industryBasedOn: "Based on answers to: What industry are you in?",
          challengeBasedOn:
            "Based on answers to: What is your biggest daily challenge?",
        };

  const {
    mostCommonIndustry,
    mostCommonChallenge,
    willingToPay,
    hoursLost,
    industryChartData,
    challengeChartData,
  } = useMemo(() => {
    const industryCounts = countByQuestion(responses, INDUSTRY_QUESTION);
    const challengeCounts = countByQuestion(responses, CHALLENGE_QUESTION);

    const industryEntries = mapToSortedEntries(industryCounts);
    const challengeEntries = mapToSortedEntries(challengeCounts);

    return {
      mostCommonIndustry: getMostCommon(industryEntries),
      mostCommonChallenge: getMostCommon(challengeEntries),
      willingToPay: buildWillingToPayStats(responses),
      hoursLost: buildHoursLostDistribution(responses),
      industryChartData: industryEntries,
      challengeChartData: challengeEntries,
    };
  }, [responses]);

  return (
    <section className="mb-8 space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
          {content.title}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {content.subtitle}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard title={content.mostIndustry} icon="🏢">
          <p className="text-2xl font-semibold tracking-tight text-slate-950">
            {mostCommonIndustry.name}
          </p>
          <p className="text-sm text-slate-600">{mostCommonIndustry.value} {content.responses}</p>
        </AnalyticsCard>

        <AnalyticsCard title={content.mostChallenge} icon="⚠️">
          <p className="text-2xl font-semibold tracking-tight text-slate-950">
            {mostCommonChallenge.name}
          </p>
          <p className="text-sm text-slate-600">{mostCommonChallenge.value} {content.responses}</p>
        </AnalyticsCard>

        <AnalyticsCard title={content.willingToPay} icon="💰">
          <p className="text-sm font-medium text-slate-800">{content.yes}: {willingToPay.Yes}</p>
          <p className="text-sm font-medium text-slate-800">{content.maybe}: {willingToPay.Maybe}</p>
          <p className="text-sm font-medium text-slate-800">{content.no}: {willingToPay.No}</p>
          <p className="pt-1 text-sm font-semibold text-emerald-700">
            {willingToPay.yesMaybePercent}% {content.yesMaybe}
          </p>
        </AnalyticsCard>

        <AnalyticsCard title={content.hoursLost} icon="⏰">
          {hoursLost.map((item) => (
            <p key={item.name} className="text-sm font-medium text-slate-800">
              {item.name} - {item.value}
            </p>
          ))}
        </AnalyticsCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartShell
          title={content.industryDistribution}
          subtitle={content.industryBasedOn}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={industryChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                innerRadius={48}
                paddingAngle={2}
              >
                {industryChartData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip label={content.responses} />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell
          title={content.challengesDistribution}
          subtitle={content.challengeBasedOn}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={challengeChartData} margin={{ top: 10, right: 12, left: 0, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 12 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={70}
              />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip label={content.responses} />} />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#0f172a" maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>
      </div>
    </section>
  );
}