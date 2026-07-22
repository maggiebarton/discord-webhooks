const MS_PER_DAY = 86_400_000;

/**
 * Returns a stable question for a local calendar date.
 * Using UTC on the date parts avoids daylight-saving-time gaps.
 */
export function questionForDate(questions, date = new Date()) {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Add at least one question to src/questions.js.");
  }

  const dayNumber = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY
  );

  return questions[dayNumber % questions.length];
}
