import assert from "node:assert/strict";
import test from "node:test";

import { prompts } from "../src/prompts.js";

test("contains 103 unique daily prompts", () => {
  assert.equal(prompts.length, 103);
  assert.equal(new Set(prompts.map((prompt) => prompt.text)).size, 103);
});

test("has 19 converted polls and 3 standalone custom polls", () => {
  const polls = prompts.filter((prompt) => prompt.type === "poll");

  assert.equal(polls.length, 22);
  assert.equal(new Set(polls.map((poll) => poll.text)).size, 22);
  assert.ok(polls.every((poll) => poll.answers.length >= 2));
});

test("keeps the remaining 81 entries as questions", () => {
  assert.equal(prompts.filter((prompt) => prompt.type === "question").length, 81);
});
