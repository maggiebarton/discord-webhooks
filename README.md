# Discord Question of the Day

A small, dependency-free Node.js script that posts one daily question or native poll through a Discord incoming webhook.

## Requirements

- Node.js 20.6 or newer
- Permission to manage webhooks in the target Discord channel

## Set up Discord

1. Open your Discord server and choose **Server Settings**.
2. Go to **Integrations** > **Webhooks**.
3. Create a webhook, name it, and select your channel.
4. Copy its webhook URL. Treat this URL like a password: anyone who has it can post to the channel.

## Configure the project

```sh
cp .env.example .env
```

Replace `DISCORD_TEST_WEBHOOK_URL` and `DISCORD_PRODUCTION_WEBHOOK_URL` in `.env` with the URLs copied from each Discord server. The `.env` file is ignored by Git. The old `DISCORD_WEBHOOK_URL` is still accepted as a production fallback.

`QUESTION_MESSAGE_PREFIX` and `POLL_MESSAGE_PREFIX` optionally customize the label shown above each prompt type. The older `MESSAGE_PREFIX` setting still works for questions.

Edit `src/prompts.js` to add, remove, or rewrite questions and polls. A question looks like:

```js
{ type: "question", text: "What made you smile today?" }
```

A poll looks like:

```js
{
  type: "poll",
  text: "When should game night be?",
  answers: ["Friday", "Saturday", "Sunday"],
  durationHours: 24,
  allowMultiselect: false
}
```

Polls need 2–10 answers. Discord allows up to 300 characters in the poll question, 55 characters per answer, and a duration from 1 to 768 hours. `durationHours` and `allowMultiselect` are optional and default to `24` and `false`.

## Run it

Preview today's message without contacting Discord:

```sh
npm run dry-run
```

Post today's message:

```sh
npm run post
```

Posts target the production server by default. To send to the test server instead:

```sh
npm run post -- --server test
```

Post a specific question instead of today's automatically selected one:

```sh
npm run post -- --question "What is everyone looking forward to this weekend?"
```

Preview a specific question without posting it:

```sh
npm run dry-run -- --question "What is everyone looking forward to this weekend?"
```

The extra `--` tells npm to pass the following options to the script. Forcing a question affects only that run; it does not change the normal mixed daily rotation.

Preview one of the existing polls by its exact question text:

```sh
npm run dry-run -- --poll "Pineapple on pizza: yes or no?"
```

Post that poll for real:

```sh
npm run post -- --poll "Pineapple on pizza: yes or no?"
```

Send that poll to the test server:

```sh
npm run post -- --server test --poll "Pineapple on pizza: yes or no?"
```

Poll matching is case-insensitive. A misspelled or unknown poll prints the available poll names without posting anything.

Run the tests:

```sh
npm test
```

## Schedule it on macOS or Linux

Open your crontab with `crontab -e` and add a line like this to post every day at 9:00 AM in the computer's local timezone:

```cron
0 9 * * * cd /path/to/discord/project && /usr/bin/env npm run post >> /tmp/discord-qotd.log 2>&1
```

The computer must be awake at the scheduled time. For reliable posting while your computer is off, run the script from an always-on host or a scheduled cloud workflow.

## Security

- Never commit `.env` or paste the webhook URL into source code.
- Delete and recreate the webhook in Discord immediately if its URL is exposed.
- This uses an incoming webhook, not your personal Discord token or a self-bot.
