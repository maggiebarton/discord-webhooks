export function buildPayload(prompt, { prefix, username } = {}) {
  const payload = { allowed_mentions: { parse: [] } };

  if (username) payload.username = username;

  if (prompt.type === "question") {
    payload.content = `${prefix ?? "**Question of the day:**"}\n${prompt.text}`;
    return payload;
  }

  if (prompt.type === "poll") {
    validatePoll(prompt);
    payload.content = prefix ?? "**Poll of the day:**";
    payload.poll = {
      question: { text: prompt.text },
      answers: prompt.answers.map((answer) => ({ poll_media: { text: answer } })),
      duration: prompt.durationHours ?? 24,
      allow_multiselect: prompt.allowMultiselect ?? false,
      layout_type: 1
    };
    return payload;
  }

  throw new Error(`Unsupported prompt type: ${prompt.type}`);
}

function validatePoll(prompt) {
  if (!Array.isArray(prompt.answers) || prompt.answers.length < 2 || prompt.answers.length > 10) {
    throw new Error("A poll must have between 2 and 10 answers.");
  }
  if (prompt.text.length > 300) throw new Error("A poll question cannot exceed 300 characters.");
  if (prompt.answers.some((answer) => !answer || answer.length > 55)) {
    throw new Error("Each poll answer must contain 1 to 55 characters.");
  }

  const duration = prompt.durationHours ?? 24;
  if (!Number.isInteger(duration) || duration < 1 || duration > 768) {
    throw new Error("Poll durationHours must be a whole number from 1 to 768.");
  }
}
