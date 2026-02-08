import { SmsMessage } from "../type";

export function normalizeRecipients(recipients: string[]): string[] {
  return recipients.map((recipient) => recipient.trim()).filter(Boolean);
}

export function validateMessage(message: SmsMessage): string | null {
  if (!message) {
    return "Message payload is required.";
  }

  if (!Array.isArray(message.to) || message.to.length === 0) {
    return "At least one recipient is required.";
  }

  if (!message.message || !message.message.trim()) {
    return "Message body is required.";
  }

  return null;
}
