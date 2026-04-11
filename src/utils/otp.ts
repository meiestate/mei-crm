// src/utils/auth/otp.ts

export type OtpChannel = "sms" | "email" | "whatsapp";

export type OtpPurpose =
  | "login"
  | "signup"
  | "reset-password"
  | "verify-email"
  | "verify-phone"
  | "2fa";

export type OtpSession = {
  code: string;
  channel: OtpChannel;
  purpose: OtpPurpose;
  recipient: string;
  createdAt: number;
  expiresAt: number;
  resendAvailableAt: number;
  attempts: number;
  maxAttempts: number;
  verified: boolean;
};

export type CreateOtpSessionOptions = {
  length?: number;
  ttlSeconds?: number;
  resendCooldownSeconds?: number;
  maxAttempts?: number;
};

export type VerifyOtpResult =
  | {
      ok: true;
      reason: "verified";
      session: OtpSession;
    }
  | {
      ok: false;
      reason:
        | "missing-session"
        | "expired"
        | "cooldown"
        | "invalid-code"
        | "max-attempts-reached"
        | "already-verified";
      session: OtpSession | null;
      remainingAttempts?: number;
      remainingSeconds?: number;
    };

export const OTP_SESSION_STORAGE_KEY = "mei-crm-otp-session";
export const OTP_DEFAULT_LENGTH = 6;
export const OTP_DEFAULT_TTL_SECONDS = 300;
export const OTP_DEFAULT_RESEND_COOLDOWN_SECONDS = 30;
export const OTP_DEFAULT_MAX_ATTEMPTS = 5;

export function generateOtp(length = OTP_DEFAULT_LENGTH): string {
  const safeLength = Math.max(4, Math.min(length, 8));
  let code = "";

  for (let i = 0; i < safeLength; i += 1) {
    code += Math.floor(Math.random() * 10).toString();
  }

  return code;
}

export function normalizeOtp(value: string): string {
  return String(value ?? "").replace(/\D/g, "");
}

export function isOtpComplete(
  value: string,
  expectedLength = OTP_DEFAULT_LENGTH
): boolean {
  return normalizeOtp(value).length === expectedLength;
}

export function isOtpValidFormat(
  value: string,
  expectedLength = OTP_DEFAULT_LENGTH
): boolean {
  const normalized = normalizeOtp(value);
  return normalized.length === expectedLength && /^\d+$/.test(normalized);
}

export function splitOtpToArray(
  value: string,
  expectedLength = OTP_DEFAULT_LENGTH
): string[] {
  const normalized = normalizeOtp(value).slice(0, expectedLength);
  const chars = normalized.split("");

  while (chars.length < expectedLength) {
    chars.push("");
  }

  return chars;
}

export function joinOtpArray(values: string[]): string {
  return values
    .map((item) => normalizeOtp(item))
    .join("")
    .slice(0, values.length);
}

export function maskPhone(phone: string): string {
  const clean = phone.replace(/\s+/g, "");
  if (clean.length <= 4) return clean;

  return `${clean.slice(0, 2)}${"*".repeat(
    Math.max(clean.length - 4, 1)
  )}${clean.slice(-2)}`;
}

export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const [name, domain] = trimmed.split("@");

  if (!name || !domain) return trimmed;
  if (name.length <= 2) return `${name[0] ?? "*"}*@${domain}`;

  return `${name.slice(0, 2)}${"*".repeat(
    Math.max(name.length - 2, 1)
  )}@${domain}`;
}

export function formatOtpRecipient(
  channel: OtpChannel,
  recipient: string
): string {
  if (channel === "email") return maskEmail(recipient);
  return maskPhone(recipient);
}

export function getNowTimestamp(): number {
  return Date.now();
}

export function getSecondsRemaining(targetTimestamp: number): number {
  return Math.max(Math.ceil((targetTimestamp - getNowTimestamp()) / 1000), 0);
}

export function isOtpExpired(session: Pick<OtpSession, "expiresAt">): boolean {
  return getNowTimestamp() >= session.expiresAt;
}

export function isOtpResendAvailable(
  session: Pick<OtpSession, "resendAvailableAt">
): boolean {
  return getNowTimestamp() >= session.resendAvailableAt;
}

export function getOtpRemainingSeconds(
  session: Pick<OtpSession, "expiresAt">
): number {
  return getSecondsRemaining(session.expiresAt);
}

export function getResendCooldownSeconds(
  session: Pick<OtpSession, "resendAvailableAt">
): number {
  return getSecondsRemaining(session.resendAvailableAt);
}

export function createOtpSession(
  recipient: string,
  channel: OtpChannel,
  purpose: OtpPurpose,
  options: CreateOtpSessionOptions = {}
): OtpSession {
  const now = getNowTimestamp();
  const ttlSeconds = options.ttlSeconds ?? OTP_DEFAULT_TTL_SECONDS;
  const resendCooldownSeconds =
    options.resendCooldownSeconds ?? OTP_DEFAULT_RESEND_COOLDOWN_SECONDS;
  const maxAttempts = options.maxAttempts ?? OTP_DEFAULT_MAX_ATTEMPTS;
  const length = options.length ?? OTP_DEFAULT_LENGTH;

  return {
    code: generateOtp(length),
    channel,
    purpose,
    recipient,
    createdAt: now,
    expiresAt: now + ttlSeconds * 1000,
    resendAvailableAt: now + resendCooldownSeconds * 1000,
    attempts: 0,
    maxAttempts,
    verified: false,
  };
}

export function cloneOtpSession(session: OtpSession): OtpSession {
  return { ...session };
}

export function incrementOtpAttempts(session: OtpSession): OtpSession {
  return {
    ...session,
    attempts: session.attempts + 1,
  };
}

export function markOtpVerified(session: OtpSession): OtpSession {
  return {
    ...session,
    verified: true,
  };
}

export function canAttemptOtpVerification(session: OtpSession): boolean {
  return (
    !session.verified &&
    !isOtpExpired(session) &&
    session.attempts < session.maxAttempts
  );
}

export function getOtpRemainingAttempts(session: OtpSession): number {
  return Math.max(session.maxAttempts - session.attempts, 0);
}

export function canResendOtp(session: OtpSession): boolean {
  return !session.verified && isOtpResendAvailable(session);
}

export function resendOtp(
  session: OtpSession,
  options: CreateOtpSessionOptions = {}
): OtpSession {
  const now = getNowTimestamp();
  const ttlSeconds = options.ttlSeconds ?? OTP_DEFAULT_TTL_SECONDS;
  const resendCooldownSeconds =
    options.resendCooldownSeconds ?? OTP_DEFAULT_RESEND_COOLDOWN_SECONDS;

  const resolvedLength =
    (options.length ?? session.code.length) || OTP_DEFAULT_LENGTH;

  return {
    ...session,
    code: generateOtp(resolvedLength),
    createdAt: now,
    expiresAt: now + ttlSeconds * 1000,
    resendAvailableAt: now + resendCooldownSeconds * 1000,
    attempts: 0,
    verified: false,
  };
}

export function verifyOtpCode(
  inputCode: string,
  session: OtpSession | null
): VerifyOtpResult {
  if (!session) {
    return {
      ok: false,
      reason: "missing-session",
      session: null,
    };
  }

  if (session.verified) {
    return {
      ok: false,
      reason: "already-verified",
      session,
    };
  }

  if (isOtpExpired(session)) {
    return {
      ok: false,
      reason: "expired",
      session,
      remainingSeconds: 0,
    };
  }

  if (session.attempts >= session.maxAttempts) {
    return {
      ok: false,
      reason: "max-attempts-reached",
      session,
      remainingAttempts: 0,
    };
  }

  const normalizedInput = normalizeOtp(inputCode);
  const normalizedCode = normalizeOtp(session.code);

  if (normalizedInput !== normalizedCode) {
    const updatedSession = incrementOtpAttempts(session);

    return {
      ok: false,
      reason:
        updatedSession.attempts >= updatedSession.maxAttempts
          ? "max-attempts-reached"
          : "invalid-code",
      session: updatedSession,
      remainingAttempts: getOtpRemainingAttempts(updatedSession),
    };
  }

  const verifiedSession = markOtpVerified(session);

  return {
    ok: true,
    reason: "verified",
    session: verifiedSession,
  };
}

export function safeParseOtpSession(value: string | null): OtpSession | null {
  try {
    if (!value) return null;
    const parsed = JSON.parse(value) as OtpSession;

    if (
      !parsed ||
      typeof parsed.code !== "string" ||
      typeof parsed.channel !== "string" ||
      typeof parsed.purpose !== "string" ||
      typeof parsed.recipient !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function setOtpSession(session: OtpSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(OTP_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getOtpSession(): OtpSession | null {
  if (typeof window === "undefined") return null;
  return safeParseOtpSession(localStorage.getItem(OTP_SESSION_STORAGE_KEY));
}

export function clearOtpSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OTP_SESSION_STORAGE_KEY);
}

export function startOtpSession(
  recipient: string,
  channel: OtpChannel,
  purpose: OtpPurpose,
  options: CreateOtpSessionOptions = {}
): OtpSession {
  const session = createOtpSession(recipient, channel, purpose, options);
  setOtpSession(session);
  return session;
}

export function verifyStoredOtp(inputCode: string): VerifyOtpResult {
  const session = getOtpSession();
  const result = verifyOtpCode(inputCode, session);

  if (!result.ok) {
    if (result.session) {
      setOtpSession(result.session);
    }
    return result;
  }

  setOtpSession(result.session);
  return result;
}

export function resendStoredOtp(
  options: CreateOtpSessionOptions = {}
):
  | {
      ok: true;
      session: OtpSession;
    }
  | {
      ok: false;
      reason: "missing-session" | "cooldown" | "already-verified";
      session: OtpSession | null;
      remainingSeconds?: number;
    } {
  const session = getOtpSession();

  if (!session) {
    return {
      ok: false,
      reason: "missing-session",
      session: null,
    };
  }

  if (session.verified) {
    return {
      ok: false,
      reason: "already-verified",
      session,
    };
  }

  if (!isOtpResendAvailable(session)) {
    return {
      ok: false,
      reason: "cooldown",
      session,
      remainingSeconds: getResendCooldownSeconds(session),
    };
  }

  const nextSession = resendOtp(session, options);
  setOtpSession(nextSession);

  return {
    ok: true,
    session: nextSession,
  };
}

export function getOtpDebugMeta(session: OtpSession | null) {
  if (!session) return null;

  return {
    channel: session.channel,
    purpose: session.purpose,
    recipient: formatOtpRecipient(session.channel, session.recipient),
    expiresInSeconds: getOtpRemainingSeconds(session),
    resendInSeconds: getResendCooldownSeconds(session),
    attempts: session.attempts,
    maxAttempts: session.maxAttempts,
    verified: session.verified,
  };
}