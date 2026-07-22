import assert from "node:assert/strict";
import test from "node:test";

import { questionForDate } from "../src/question-for-date.js";

test("returns the same question throughout one local calendar day", () => {
  const questions = ["A", "B", "C"];

  assert.equal(
    questionForDate(questions, new Date(2026, 6, 22, 0, 1)),
    questionForDate(questions, new Date(2026, 6, 22, 23, 59))
  );
});

test("moves to the next question on the next calendar day", () => {
  const questions = ["A", "B", "C"];
  const today = questionForDate(questions, new Date(2026, 6, 22));
  const tomorrow = questionForDate(questions, new Date(2026, 6, 23));

  assert.equal(questions.indexOf(tomorrow), (questions.indexOf(today) + 1) % questions.length);
});

test("requires at least one question", () => {
  assert.throws(() => questionForDate([], new Date()), /at least one question/);
});
