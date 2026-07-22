import { questions } from "./questions.js";
import { questionForDate } from "./question-for-date.js";
import { parseOptions } from "./cli-options.js";

let options;
try {
  options = parseOptions(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const question = options.question ?? questionForDate(questions);
const prefix = process.env.MESSAGE_PREFIX ?? "**Question of the day:**";
const content = `${prefix}\n${question}`;

if (options.dryRun) {
  console.log(content);
  process.exit(0);
}

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

if (!webhookUrl) {
  console.error("DISCORD_WEBHOOK_URL is missing. Copy .env.example to .env and add your webhook URL.");
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

const payload = {
  content,
  allowed_mentions: { parse: [] }
};

if (process.env.WEBHOOK_USERNAME) {
  payload.username = process.env.WEBHOOK_USERNAME;
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

console.log(`Posted today's question: ${question}`);
