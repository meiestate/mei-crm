// src/features/leads/utils/leadValidation.ts

import type {
  CreateLeadInput,
  Lead,
  UpdateLeadInput,
} from "../types/leads.types";

export type LeadValidationErrors = Partial<
  Record<
    | "name"
    | "email"
    | "phone"
    | "alternatePhone"
    | "whatsapp"
    | "company"
    | "source"
    | "owner"
    | "status"
    | "priority"
    | "budget"
    | "expectedValue"
    | "interestType"
    | "propertyType"
    | "location"
    | "city"
    | "state"
    | "country"
    | "followUpDate"
    | "nextFollowUpDate"
    | "tags"
    | "notes"
    | "score"
    | "temperature",
    string
  >
>;

export type LeadValidationResult = {
  isValid: boolean;
  errors: LeadValidationErrors;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;

const ALLOWED_STATUSES = new Set([
  "new",
  "open",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
  "hot",
  "warm",
  "cold",
]);

const ALLOWED_PRIORITIES = new Set(["low", "medium", "high", "urgent"]);
const ALLOWED_TEMPERATURES = new Set(["hot", "warm", "cold"]);

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value?: string): boolean {
  if (!value) return true;
  return EMAIL_REGEX.test(value.trim());
}

function isValidPhone(value?: string): boolean {
  if (!value) return true;
  return PHONE_REGEX.test(value.trim());
}

function isValidDate(value?: string): boolean {
  if (!value) return true;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function isNonNegativeNumber(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isValidScore(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function isValidStatus(value?: string): boolean {
  if (!value) return true;
  return ALLOWED_STATUSES.has(value.trim().toLowerCase());
}

function isValidPriority(value?: string): boolean {
  if (!value) return true;
  return ALLOWED_PRIORITIES.has(value.trim().toLowerCase());
}

function isValidTemperature(value?: string): boolean {
  if (!value) return true;
  return ALLOWED_TEMPERATURES.has(value.trim().toLowerCase());
}

function areTagsValid(tags?: string[]): boolean {
  if (!tags) return true;
  return Array.isArray(tags) && tags.every((tag) => typeof tag === "string");
}

function hasMeaningfulName(name?: string): boolean {
  return Boolean(name && name.trim().length >= 2);
}

function validateFollowUpPair(
  followUpDate?: string,
  nextFollowUpDate?: string
): string | null {
  if (!followUpDate || !nextFollowUpDate) return null;

  const first = new Date(followUpDate).getTime();
  const second = new Date(nextFollowUpDate).getTime();

  if (Number.isNaN(first) || Number.isNaN(second)) return null;

  if (second < first) {
    return "Next follow-up date cannot be earlier than follow-up date.";
  }

  return null;
}

export function sanitizeLeadInput<T extends CreateLeadInput | UpdateLeadInput>(
  input: T
): T {
  const sanitized = {
    ...input,
    name:
      input.name !== undefined ? normalizeString(input.name) : input.name,
    email:
      input.email !== undefined ? normalizeString(input.email) || undefined : input.email,
    phone:
      input.phone !== undefined ? normalizeString(input.phone) || undefined : input.phone,
    alternatePhone:
      input.alternatePhone !== undefined
        ? normalizeString(input.alternatePhone) || undefined
        : input.alternatePhone,
    whatsapp:
      input.whatsapp !== undefined
        ? normalizeString(input.whatsapp) || undefined
        : input.whatsapp,
    company:
      input.company !== undefined ? normalizeString(input.company) || undefined : input.company,
    source:
      input.source !== undefined ? normalizeString(input.source) || undefined : input.source,
    owner:
      input.owner !== undefined ? normalizeString(input.owner) || undefined : input.owner,
    status:
      input.status !== undefined ? normalizeString(input.status) || undefined : input.status,
    priority:
      input.priority !== undefined
        ? normalizeString(input.priority) || undefined
        : input.priority,
    interestType:
      input.interestType !== undefined
        ? normalizeString(input.interestType) || undefined
        : input.interestType,
    propertyType:
      input.propertyType !== undefined
        ? normalizeString(input.propertyType) || undefined
        : input.propertyType,
    location:
      input.location !== undefined
        ? normalizeString(input.location) || undefined
        : input.location,
    city: input.city !== undefined ? normalizeString(input.city) || undefined : input.city,
    state:
      input.state !== undefined ? normalizeString(input.state) || undefined : input.state,
    country:
      input.country !== undefined
        ? normalizeString(input.country) || undefined
        : input.country,
    followUpDate:
      input.followUpDate !== undefined
        ? normalizeString(input.followUpDate) || undefined
        : input.followUpDate,
    nextFollowUpDate:
      input.nextFollowUpDate !== undefined
        ? normalizeString(input.nextFollowUpDate) || undefined
        : input.nextFollowUpDate,
    notes:
      input.notes !== undefined ? normalizeString(input.notes) || undefined : input.notes,
    temperature:
      input.temperature !== undefined
        ? normalizeString(input.temperature) || undefined
        : input.temperature,
    tags:
      input.tags !== undefined
        ? input.tags.map((tag) => normalizeString(tag)).filter(Boolean)
        : input.tags,
  } as T;

  return sanitized;
}

export function validateLeadInput(
  input: CreateLeadInput | UpdateLeadInput,
  options?: {
    requireName?: boolean;
  }
): LeadValidationResult {
  const requireName = options?.requireName ?? false;
  const payload = sanitizeLeadInput(input);
  const errors: LeadValidationErrors = {};

  if (requireName && !hasMeaningfulName(payload.name)) {
    errors.name = "Lead name must be at least 2 characters.";
  }

  if (payload.name !== undefined && payload.name !== "" && !hasMeaningfulName(payload.name)) {
    errors.name = "Lead name must be at least 2 characters.";
  }

  if (!isValidEmail(payload.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!isValidPhone(payload.phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!isValidPhone(payload.alternatePhone)) {
    errors.alternatePhone = "Enter a valid alternate phone number.";
  }

  if (!isValidPhone(payload.whatsapp)) {
    errors.whatsapp = "Enter a valid WhatsApp number.";
  }

  if (!isValidStatus(payload.status)) {
    errors.status = "Select a valid lead status.";
  }

  if (!isValidPriority(payload.priority)) {
    errors.priority = "Select a valid priority.";
  }

  if (!isValidTemperature(payload.temperature)) {
    errors.temperature = "Temperature must be hot, warm, or cold.";
  }

  if (!isNonNegativeNumber(payload.budget)) {
    errors.budget = "Budget must be a valid non-negative number.";
  }

  if (!isNonNegativeNumber(payload.expectedValue)) {
    errors.expectedValue = "Expected value must be a valid non-negative number.";
  }

  if (!isValidScore(payload.score)) {
    errors.score = "Score must be between 0 and 100.";
  }

  if (!isValidDate(payload.followUpDate)) {
    errors.followUpDate = "Enter a valid follow-up date.";
  }

  if (!isValidDate(payload.nextFollowUpDate)) {
    errors.nextFollowUpDate = "Enter a valid next follow-up date.";
  }

  const followUpPairError = validateFollowUpPair(
    payload.followUpDate,
    payload.nextFollowUpDate
  );
  if (followUpPairError) {
    errors.nextFollowUpDate = followUpPairError;
  }

  if (!areTagsValid(payload.tags)) {
    errors.tags = "Tags must be a valid string array.";
  }

  if (payload.notes && payload.notes.length > 5000) {
    errors.notes = "Notes must be 5000 characters or fewer.";
  }

  if (payload.company && payload.company.length > 120) {
    errors.company = "Company name is too long.";
  }

  if (payload.source && payload.source.length > 80) {
    errors.source = "Source is too long.";
  }

  if (payload.owner && payload.owner.length > 80) {
    errors.owner = "Owner name is too long.";
  }

  if (payload.interestType && payload.interestType.length > 80) {
    errors.interestType = "Interest type is too long.";
  }

  if (payload.propertyType && payload.propertyType.length > 80) {
    errors.propertyType = "Property type is too long.";
  }

  if (payload.location && payload.location.length > 160) {
    errors.location = "Location is too long.";
  }

  if (payload.city && payload.city.length > 80) {
    errors.city = "City name is too long.";
  }

  if (payload.state && payload.state.length > 80) {
    errors.state = "State name is too long.";
  }

  if (payload.country && payload.country.length > 80) {
    errors.country = "Country name is too long.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCreateLeadInput(
  input: CreateLeadInput
): LeadValidationResult {
  return validateLeadInput(input, { requireName: true });
}

export function validateUpdateLeadInput(
  input: UpdateLeadInput
): LeadValidationResult {
  return validateLeadInput(input, { requireName: false });
}

export function hasLeadChanged(
  original: Lead | null | undefined,
  updates: UpdateLeadInput
): boolean {
  if (!original) return true;

  const sanitized = sanitizeLeadInput(updates);

  const keys = Object.keys(sanitized) as Array<keyof UpdateLeadInput>;

  return keys.some((key) => {
    const nextValue = sanitized[key];
    const currentValue = original[key as keyof Lead];

    if (Array.isArray(nextValue) || Array.isArray(currentValue)) {
      return JSON.stringify(nextValue ?? []) !== JSON.stringify(currentValue ?? []);
    }

    return nextValue !== currentValue;
  });
}