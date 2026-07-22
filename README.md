# Discord Question of the Day

A small, dependency-free Node.js script that posts one daily question through a Discord incoming webhook.

## Requirements

- Node.js 20.6 or newer
- Permission to manage webhooks in the target Discord channel

## Set up Discord

1. Open your Discord server and choose **Server Settings**.
2. Go to **Integrations** > **Webhooks**.
3. Create a webhook, name it, and select your `#general` channel.
4. Copy its webhook URL. Treat this URL like a password: anyone who has it can post to the channel.

## Configure the project

```sh
cp .env.example .env
```

Replace the placeholder `DISCORD_WEBHOOK_URL` in `.env` with the URL copied from Discord. The `.env` file is ignored by Git.

Edit `src/questions.js` to add, remove, or rewrite questions.

## Run it

Preview today's message without contacting Discord:

```sh
npm run dry-run
```

Post today's message:

```sh
npm run post
```

Post a specific question instead of today's automatically selected one:

```sh
npm run post -- --question "What is everyone looking forward to this weekend?"
```

Preview a specific question without posting it:

```sh
npm run dry-run -- --question "What is everyone looking forward to this weekend?"
```

The extra `--` tells npm to pass the following options to the script. Forcing a question affects only that run; it does not change the normal daily rotation.

Run the tests:

```sh
npm test
```

## Schedule it on macOS or Linux

Open your crontab with `crontab -e` and add a line like this to post every day at 9:00 AM in the computer's local timezone:

```cron
0 9 * * * cd /Users/maggiebarton/Personal/discord && /usr/bin/env npm run post >> /tmp/discord-qotd.log 2>&1
```

The computer must be awake at the scheduled time. For reliable posting while your computer is off, run the script from an always-on host or a scheduled cloud workflow.

## Security

- Never commit `.env` or paste the webhook URL into source code.
- Delete and recreate the webhook in Discord immediately if its URL is exposed.
- This uses an incoming webhook, not your personal Discord token or a self-bot.
