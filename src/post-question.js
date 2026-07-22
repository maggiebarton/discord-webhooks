import { buildPayload } from "./build-payload.js";
import { questionForDate } from "./question-for-date.js";
import { parseOptions } from "./cli-options.js";
import { prompts } from "./prompts.js";

let options;
try {
  options = parseOptions(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

let prompt;
if (options.question) {
  prompt = { type: "question", text: options.question };
} else if (options.poll) {
  prompt = prompts.find(
    (candidate) => candidate.type === "poll" && candidate.text.toLowerCase() === options.poll.toLowerCase()
  );

  if (!prompt) {
    const availablePolls = prompts
      .filter((candidate) => candidate.type === "poll")
      .map((candidate) => `- ${candidate.text}`)
      .join("\n");
    console.error(`Poll not found. Available polls:\n${availablePolls}`);
    process.exit(1);
  }
} else {
  prompt = questionForDate(prompts);
}
const defaultPrefix = prompt.type === "poll" ? "**Poll of the day:**" : "**Question of the day:**";
const configuredPrefix = prompt.type === "poll"
  ? process.env.POLL_MESSAGE_PREFIX
  : process.env.QUESTION_MESSAGE_PREFIX ?? process.env.MESSAGE_PREFIX;
const payload = buildPayload(prompt, {
  prefix: configuredPrefix ?? defaultPrefix,
  username: process.env.WEBHOOK_USERNAME
});

if (options.dryRun) {
  if (prompt.type === "poll") {
    console.log(`${payload.content}\n${prompt.text}`);
    for (const answer of prompt.answers) console.log(`- ${answer}`);
  } else {
    console.log(payload.content);
  }
  process.exit(0);
}

const webhookVariable = options.server === "test"
  ? "DISCORD_TEST_WEBHOOK_URL"
  : "DISCORD_PRODUCTION_WEBHOOK_URL";
const webhookUrl = process.env[webhookVariable]
  ?? (options.server === "production" ? process.env.DISCORD_WEBHOOK_URL : undefined);

if (!webhookUrl) {
  console.error(`${webhookVariable} is missing. Add the ${options.server} webhook URL to .env.`);
  process.exit(1);
}

let parsedUrl;
try {
  parsedUrl = new URL(webhookUrl);
} catch {
  console.error("DISCORD_WEBHOOK_URL is not a valid URL.");
  process.exit(1);
}

if (!["discord.com", "discordapp.com"].includes(parsedUrl.hostname)) {
  console.error("DISCORD_WEBHOOK_URL must be an official Discord webhook URL.");
  process.exit(1);
}

const response = await fetch(webhookUrl, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(payload)
});

if (!response.ok) {
  const details = await response.text();
  console.error(`Discord returned ${response.status}: ${details}`);
  process.exit(1);
}

console.log(`Posted today's ${prompt.type} to the ${options.server} server: ${prompt.text}`);
