export function parseOptions(args) {
  const options = {
    dryRun: false,
    question: undefined
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

    throw new Error(`Unknown option: ${argument}`);
  }

  return options;
}
