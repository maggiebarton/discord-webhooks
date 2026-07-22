import assert from "node:assert/strict";
import test from "node:test";

import { buildPayload } from "../src/build-payload.js";

test("builds a plain question message", () => {
  const payload = buildPayload({ type: "question", text: "How are you?" });
  assert.equal(payload.content, "**Question of the day:**\nHow are you?");
  assert.deepEqual(payload.allowed_mentions, { parse: [] });
});

test("builds a native Discord poll", () => {
  const payload = buildPayload({
    type: "poll",
    text: "Pick one",
    answers: ["A", "B"],
    durationHours: 48,
    allowMultiselect: true
  });

  assert.deepEqual(payload.poll, {
    question: { text: "Pick one" },
    answers: [{ poll_media: { text: "A" } }, { poll_media: { text: "B" } }],
    duration: 48,
    allow_multiselect: true,
    layout_type: 1
  });
});

test("rejects polls outside Discord's answer limits", () => {
  assert.throws(
    () => buildPayload({ type: "poll", text: "Pick one", answers: ["Only one"] }),
    /between 2 and 10 answers/
  );
});
