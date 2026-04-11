// src/utils/auth/password.ts

export type PasswordStrengthLabel =
  | "Very Weak"
  | "Weak"
  | "Fair"
  | "Good"
  | "Strong";

export type PasswordRequirementKey =
  | "minLength"
  | "uppercase"
  | "lowercase"
  | "number"
  | "specialChar"
  | "noSpaces"
  | "notCommon";

export type PasswordRequirement = {
  key: PasswordRequirementKey;
  label: string;
  passed: boolean;
};

export type PasswordValidationResult = {
  isValid: boolean;
  score: number;
  label: PasswordStrengthLabel;
  percentage: number;
  requirements: PasswordRequirement[];
  suggestions: string[];
};

export type PasswordPolicyOptions = {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
  disallowSpaces?: boolean;
  disallowCommonPasswords?: boolean;
};

export const DEFAULT_PASSWORD_POLICY: Required<PasswordPolicyOptions> = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  disallowSpaces: true,
  disallowCommonPasswords: true,
};

const COMMON_WEAK_PASSWORDS = new Set([
  "123456",
  "12345678",
  "123456789",
  "password",
  "password123",
  "admin",
  "admin123",
  "qwerty",
  "qwerty123",
  "welcome",
  "welcome123",
  "letmein",
  "iloveyou",
  "000000",
  "111111",
  "abc123",
  "abcd1234",
  "pass@123",
]);

export function hasUppercase(value: string): boolean {
  return /[A-Z]/.test(value);
}

export function hasLowercase(value: string): boolean {
  return /[a-z]/.test(value);
}

export function hasNumber(value: string): boolean {
  return /\d/.test(value);
}

export function hasSpecialCharacter(value: string): boolean {
  return /[!@#$%^&*()[\]{}\-_=+\\|;:'",.<>/?`~]/.test(value);
}

export function hasNoSpaces(value: string): boolean {
  return !/\s/.test(value);
}

export function isCommonWeakPassword(value: string): boolean {
  return COMMON_WEAK_PASSWORDS.has(value.trim().toLowerCase());
}

export function normalizePasswordPolicy(
  options: PasswordPolicyOptions = {}
): Required<PasswordPolicyOptions> {
  return {
    minLength: options.minLength ?? DEFAULT_PASSWORD_POLICY.minLength,
    requireUppercase:
      options.requireUppercase ?? DEFAULT_PASSWORD_POLICY.requireUppercase,
    requireLowercase:
      options.requireLowercase ?? DEFAULT_PASSWORD_POLICY.requireLowercase,
    requireNumber: options.requireNumber ?? DEFAULT_PASSWORD_POLICY.requireNumber,
    requireSpecialChar:
      options.requireSpecialChar ?? DEFAULT_PASSWORD_POLICY.requireSpecialChar,
    disallowSpaces:
      options.disallowSpaces ?? DEFAULT_PASSWORD_POLICY.disallowSpaces,
    disallowCommonPasswords:
      options.disallowCommonPasswords ??
      DEFAULT_PASSWORD_POLICY.disallowCommonPasswords,
  };
}

export function getPasswordRequirements(
  password: string,
  options: PasswordPolicyOptions = {}
): PasswordRequirement[] {
  const policy = normalizePasswordPolicy(options);

  const requirements: PasswordRequirement[] = [
    {
      key: "minLength",
      label: `At least ${policy.minLength} characters`,
      passed: password.length >= policy.minLength,
    },
    {
      key: "uppercase",
      label: "Contains uppercase letter",
      passed: !policy.requireUppercase || hasUppercase(password),
    },
    {
      key: "lowercase",
      label: "Contains lowercase letter",
      passed: !policy.requireLowercase || hasLowercase(password),
    },
    {
      key: "number",
      label: "Contains number",
      passed: !policy.requireNumber || hasNumber(password),
    },
    {
      key: "specialChar",
      label: "Contains special character",
      passed: !policy.requireSpecialChar || hasSpecialCharacter(password),
    },
    {
      key: "noSpaces",
      label: "No spaces",
      passed: !policy.disallowSpaces || hasNoSpaces(password),
    },
    {
      key: "notCommon",
      label: "Not a common password",
      passed:
        !policy.disallowCommonPasswords || !isCommonWeakPassword(password),
    },
  ];

  return requirements;
}

export function getPasswordStrengthScore(
  password: string,
  options: PasswordPolicyOptions = {}
): number {
  if (!password) return 0;

  const requirements = getPasswordRequirements(password, options);
  let score = requirements.filter((item) => item.passed).length;

  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (hasUppercase(password) && hasLowercase(password)) score += 1;
  if (hasNumber(password) && hasSpecialCharacter(password)) score += 1;

  return Math.min(score, 10);
}

export function getPasswordStrengthLabel(score: number): PasswordStrengthLabel {
  if (score <= 2) return "Very Weak";
  if (score <= 4) return "Weak";
  if (score <= 6) return "Fair";
  if (score <= 8) return "Good";
  return "Strong";
}

export function getPasswordStrengthPercentage(score: number): number {
  return Math.max(0, Math.min(Math.round((score / 10) * 100), 100));
}

export function validatePassword(
  password: string,
  options: PasswordPolicyOptions = {}
): PasswordValidationResult {
  const requirements = getPasswordRequirements(password, options);
  const score = getPasswordStrengthScore(password, options);
  const label = getPasswordStrengthLabel(score);
  const percentage = getPasswordStrengthPercentage(score);

  const suggestions = requirements
    .filter((item) => !item.passed)
    .map((item) => item.label);

  const isValid = requirements.every((item) => item.passed);

  return {
    isValid,
    score,
    label,
    percentage,
    requirements,
    suggestions,
  };
}

export function doPasswordsMatch(
  password: string,
  confirmPassword: string
): boolean {
  return password === confirmPassword;
}

export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): {
  isValid: boolean;
  message: string;
} {
  if (!confirmPassword.trim()) {
    return {
      isValid: false,
      message: "Confirm password is required",
    };
  }

  if (!doPasswordsMatch(password, confirmPassword)) {
    return {
      isValid: false,
      message: "Passwords do not match",
    };
  }

  return {
    isValid: true,
    message: "Passwords match",
  };
}

export function getPasswordToggleType(showPassword: boolean): "text" | "password" {
  return showPassword ? "text" : "password";
}

export function maskPassword(password: string, visibleLast = 0): string {
  if (!password) return "";
  if (visibleLast <= 0) return "*".repeat(password.length);
  if (password.length <= visibleLast) return password;

  return `${"*".repeat(password.length - visibleLast)}${password.slice(
    -visibleLast
  )}`;
}

export function generateStrongPassword(length = 12): string {
  const safeLength = Math.max(8, Math.min(length, 64));

  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()-_=+[]{}<>?";

  const all = uppercase + lowercase + numbers + special;

  const randomChar = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  const passwordChars = [
    randomChar(uppercase),
    randomChar(lowercase),
    randomChar(numbers),
    randomChar(special),
  ];

  while (passwordChars.length < safeLength) {
    passwordChars.push(randomChar(all));
  }

  for (let i = passwordChars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
}

export function getPasswordHints(
  options: PasswordPolicyOptions = {}
): string[] {
  const policy = normalizePasswordPolicy(options);
  const hints: string[] = [];

  hints.push(`Use at least ${policy.minLength} characters`);

  if (policy.requireUppercase) hints.push("Add at least one uppercase letter");
  if (policy.requireLowercase) hints.push("Add at least one lowercase letter");
  if (policy.requireNumber) hints.push("Add at least one number");
  if (policy.requireSpecialChar) hints.push("Add at least one special character");
  if (policy.disallowSpaces) hints.push("Avoid spaces");
  if (policy.disallowCommonPasswords) hints.push("Avoid common passwords");

  return hints;
}

export function isPasswordEmpty(password: string): boolean {
  return password.trim().length === 0;
}

export function getPasswordRequirementMap(
  password: string,
  options: PasswordPolicyOptions = {}
): Record<PasswordRequirementKey, boolean> {
  const requirements = getPasswordRequirements(password, options);

  return requirements.reduce(
    (acc, item) => {
      acc[item.key] = item.passed;
      return acc;
    },
    {} as Record<PasswordRequirementKey, boolean>
  );
}