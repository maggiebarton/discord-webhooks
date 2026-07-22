export function parseOptions(args) {
  const options = {
    dryRun: false,
    question: undefined,
    poll: undefined,
    server: "production"
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (argument === "--question") {
      const value = args[index + 1];

      if (!value || value.startsWith("--")) {
        throw new Error('Provide question text after --question, for example: --question "What made you smile today?"');
      }

      options.question = value.trim();
      index += 1;
      continue;
    }

    if (argument === "--poll") {
      const value = args[index + 1];

      if (!value || value.startsWith("--")) {
        throw new Error('Provide poll text after --poll, for example: --poll "Pineapple on pizza: yes or no?"');
      }

      options.poll = value.trim();
      index += 1;
      continue;
    }

    if (argument === "--server") {
      const value = args[index + 1]?.toLowerCase();

      if (!["test", "production"].includes(value)) {
        throw new Error("--server must be either test or production.");
      }

      options.server = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${argument}`);
  }

  if (options.question && options.poll) {
    throw new Error("Use either --question or --poll, not both.");
  }

  return options;
}
