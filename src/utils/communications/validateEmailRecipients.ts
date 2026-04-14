// src/utils/communications/validateEmailRecipients.ts

export type EmailRecipientLike = {
  name?: string;
  email?: string | null;
};

export type EmailRecipientValidationItem = {
  index: number;
  email: string;
  valid: boolean;
  normalizedEmail: string;
  reason?: string;
};

export type EmailRecipientValidationResult = {
  valid: boolean;
  items: EmailRecipientValidationItem[];
  validRecipients: EmailRecipientLike[];
  invalidRecipients: EmailRecipientValidationItem[];
  uniqueRecipients: EmailRecipientLike[];
};

const EMAIL_REGEX =
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function normalizeEmail(email?: string | null): string {
  return (email ?? "").trim().toLowerCase();
}

export function isValidEmail(email?: string | null): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return EMAIL_REGEX.test(normalized);
}

export function validateEmailRecipients(
  recipients: EmailRecipientLike[],
): EmailRecipientValidationResult {
  const seen = new Set<string>();

  const items: EmailRecipientValidationItem[] = recipients.map((recipient, index) => {
    const normalizedEmail = normalizeEmail(recipient.email);

    if (!normalizedEmail) {
      return {
        index,
        email: "",
        normalizedEmail: "",
        valid: false,
        reason: "Email is required",
      };
    }

    if (!isValidEmail(normalizedEmail)) {
      return {
        index,
        email: normalizedEmail,
        normalizedEmail,
        valid: false,
        reason: "Invalid email format",
      };
    }

    return {
      index,
      email: normalizedEmail,
      normalizedEmail,
      valid: true,
    };
  });

  const invalidRecipients = items.filter((item) => !item.valid);

  const validRecipients = recipients
    .map((recipient) => ({
      ...recipient,
      email: normalizeEmail(recipient.email),
    }))
    .filter((recipient) => isValidEmail(recipient.email));

  const uniqueRecipients = validRecipients.filter((recipient) => {
    const normalizedEmail = normalizeEmail(recipient.email);
    if (!normalizedEmail || seen.has(normalizedEmail)) {
      return false;
    }

    seen.add(normalizedEmail);
    return true;
  });

  return {
    valid: invalidRecipients.length === 0,
    items,
    validRecipients,
    invalidRecipients,
    uniqueRecipients,
  };
}

export function getInvalidEmailRecipientMessages(
  recipients: EmailRecipientLike[],
): string[] {
  const result = validateEmailRecipients(recipients);

  return result.invalidRecipients.map((item) => {
    const target = item.email || `Recipient #${item.index + 1}`;
    return `${target}: ${item.reason ?? "Invalid recipient"}`;
  });
}