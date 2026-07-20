export const INDUSTRY_QUESTION = "What industry are you in?";
export const CHALLENGE_QUESTION = "What is your biggest daily challenge?";
export const WILLING_TO_PAY_QUESTION = "Would you pay for software that solves this?";
export const HOURS_LOST_QUESTION = "How many hours do you lose every week?";

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeKey(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeAnswerValue(value) {
  const normalized = normalizeText(value);
  return normalized || "Unknown";
}

export function getAnswerByQuestion(answers, targetQuestion) {
  if (!Array.isArray(answers)) {
    return "-";
  }

  const target = normalizeKey(targetQuestion);
  const found = answers.find((item) => normalizeKey(item?.question) === target);
  return normalizeText(found?.answer) || "-";
}

export function countByQuestion(responses, question, transformValue) {
  const counts = new Map();

  responses.forEach((response) => {
    const raw = getAnswerByQuestion(response.answers, question);
    const mapped = transformValue ? transformValue(raw) : raw;
    const value = normalizeAnswerValue(mapped === "-" ? "Unknown" : mapped);
    counts.set(value, (counts.get(value) || 0) + 1);
  });

  return counts;
}

export function mapToSortedEntries(countsMap) {
  return [...countsMap.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name));
}

export function getMostCommon(entries) {
  if (!entries.length) {
    return { name: "No data", value: 0 };
  }

  return entries[0];
}

function normalizeWillingToPay(answer) {
  const normalized = normalizeKey(answer);

  if (normalized === "yes") {
    return "Yes";
  }

  if (normalized === "maybe") {
    return "Maybe";
  }

  if (normalized === "no") {
    return "No";
  }

  return "Unknown";
}

export function buildWillingToPayStats(responses) {
  const counts = {
    Yes: 0,
    Maybe: 0,
    No: 0,
    Unknown: 0,
  };

  responses.forEach((response) => {
    const answer = getAnswerByQuestion(response.answers, WILLING_TO_PAY_QUESTION);
    const bucket = normalizeWillingToPay(answer);
    counts[bucket] += 1;
  });

  const totalKnown = counts.Yes + counts.Maybe + counts.No;
  const yesMaybePercent = totalKnown
    ? Math.round(((counts.Yes + counts.Maybe) / totalKnown) * 100)
    : 0;

  return {
    ...counts,
    yesMaybePercent,
  };
}

function normalizeHoursBucket(answer) {
  const normalized = normalizeKey(answer);

  if (!normalized || normalized === "-") {
    return "Unknown";
  }

  if (normalized === "less than 2" || normalized === "2-5") {
    return "0-5";
  }

  if (normalized === "5-10") {
    return "5-10";
  }

  if (normalized === "10+") {
    return "10+";
  }

  return normalizeAnswerValue(answer);
}

export function buildHoursLostDistribution(responses) {
  const counts = countByQuestion(
    responses,
    HOURS_LOST_QUESTION,
    normalizeHoursBucket
  );

  const preferredOrder = ["0-5", "5-10", "10+", "Unknown"];

  return mapToSortedEntries(counts).sort((left, right) => {
    const leftIndex = preferredOrder.indexOf(left.name);
    const rightIndex = preferredOrder.indexOf(right.name);

    if (leftIndex === -1 && rightIndex === -1) {
      return right.value - left.value;
    }

    if (leftIndex === -1) {
      return 1;
    }

    if (rightIndex === -1) {
      return -1;
    }

    return leftIndex - rightIndex;
  });
}