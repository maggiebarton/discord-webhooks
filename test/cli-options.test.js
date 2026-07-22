import assert from "node:assert/strict";
import test from "node:test";

import { parseOptions } from "../src/cli-options.js";

test("accepts a forced question", () => {
  assert.deepEqual(parseOptions(["--question", "What is your favorite color?"]), {
    dryRun: false,
    question: "What is your favorite color?"
  });
});

test("accepts dry-run and a forced question together", () => {
  assert.deepEqual(parseOptions(["--dry-run", "--question", "A custom question?"]), {
    dryRun: true,
    question: "A custom question?"
  });
});

test("rejects a missing question value", () => {
  assert.throws(() => parseOptions(["--question"]), /Provide question text/);
});

test("rejects unknown options", () => {
  assert.throws(() => parseOptions(["--surprise"]), /Unknown option/);
});
