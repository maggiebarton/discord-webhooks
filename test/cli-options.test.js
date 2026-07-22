import assert from "node:assert/strict";
import test from "node:test";

import { parseOptions } from "../src/cli-options.js";

test("accepts a forced question", () => {
  assert.deepEqual(parseOptions(["--question", "What is your favorite color?"]), {
    dryRun: false,
    question: "What is your favorite color?",
    poll: undefined,
    server: "production"
  });
});

test("accepts dry-run and a forced question together", () => {
  assert.deepEqual(parseOptions(["--dry-run", "--question", "A custom question?"]), {
    dryRun: true,
    question: "A custom question?",
    poll: undefined,
    server: "production"
  });
});

test("accepts a forced poll", () => {
  assert.deepEqual(parseOptions(["--poll", "Pineapple on pizza: yes or no?"]), {
    dryRun: false,
    question: undefined,
    poll: "Pineapple on pizza: yes or no?",
    server: "production"
  });
});

test("accepts the test server target", () => {
  assert.equal(parseOptions(["--server", "test"]).server, "test");
});

test("rejects an unknown server target", () => {
  assert.throws(() => parseOptions(["--server", "staging"]), /test or production/);
});

test("rejects forcing a question and poll together", () => {
  assert.throws(
    () => parseOptions(["--question", "Question?", "--poll", "Poll?"]),
    /either --question or --poll/
  );
});

test("rejects a missing question value", () => {
  assert.throws(() => parseOptions(["--question"]), /Provide question text/);
});

test("rejects unknown options", () => {
  assert.throws(() => parseOptions(["--surprise"]), /Unknown option/);
});
