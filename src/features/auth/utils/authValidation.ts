import type {
  LoginFormValues,
  LoginPayload,
  SignupPayload,
  SignupWizardValues,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  VerifyMobileOtpPayload,
  OtpLoginFormSendOtpPayload,
  OtpLoginFormSubmitPayload,
} from "../types/auth.types";

export type ValidationErrors<T extends string = string> = Partial<
  Record<T, string>
>;

export type ValidationResult<T extends string = string> = {
  isValid: boolean;
  errors: ValidationErrors<T>;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{4,8}$/;

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: unknown): string {
  return typeof value === "string" ? value.replace(/\D/g, "") : "";
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(normalizeText(email));
}

export function isValidPhone(phone: string, minLength = 10): boolean {
  return normalizePhone(phone).length >= minLength;
}

export function isValidOtp(otp: string, exactLength?: number): boolean {
  const normalized = normalizeText(otp);

  if (!OTP_REGEX.test(normalized)) {
    return false;
  }

  if (typeof exactLength === "number") {
    return normalized.length === exactLength;
  }

  return true;
}

export function isStrongPassword(password: string): boolean {
  return normalizeText(password).length >= 6;
}

export function validateLoginForm(
  values: LoginFormValues,
): ValidationResult<keyof LoginFormValues> {
  const errors: ValidationErrors<keyof LoginFormValues> = {};

  const email = normalizeText(values.email);
  const password = normalizeText(values.password);

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (!isStrongPassword(password)) {
    errors.password = "Password must be at least 6 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginPayload(
  payload: LoginPayload,
): ValidationResult<keyof LoginPayload> {
  const errors: ValidationErrors<keyof LoginPayload> = {};

  const email = normalizeText(payload.email);
  const password = normalizeText(payload.password);

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (!isStrongPassword(password)) {
    errors.password = "Password must be at least 6 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSignupPayload(
  payload: SignupPayload,
): ValidationResult<keyof SignupPayload> {
  const errors: ValidationErrors<keyof SignupPayload> = {};

  const name = normalizeText(payload.name);
  const email = normalizeText(payload.email);
  const phone = normalizePhone(payload.phone);
  const password = normalizeText(payload.password);
  const companyName = normalizeText(payload.companyName);

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (payload.phone !== undefined && payload.phone !== "") {
    if (!isValidPhone(phone)) {
      errors.phone = "Enter a valid phone number.";
    }
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (!isStrongPassword(password)) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (payload.companyName !== undefined && payload.companyName !== "") {
    if (!companyName) {
      errors.companyName = "Company name is invalid.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSignupWizard(
  values: SignupWizardValues,
): ValidationResult<keyof SignupWizardValues> {
  const errors: ValidationErrors<keyof SignupWizardValues> = {};

  const fullName = normalizeText(values.fullName);
  const email = normalizeText(values.email);
  const phone = normalizePhone(values.phone);
  const companyName = normalizeText(values.companyName);
  const password = normalizeText(values.password);
  const confirmPassword = normalizeText(values.confirmPassword);

  if (!fullName) {
    errors.fullName = "Full name is required.";
  } else if (fullName.length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!isValidPhone(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!companyName) {
    errors.companyName = "Company name is required.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (!isStrongPassword(password)) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = "You must accept the terms to continue.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSignupWizardStep(
  values: SignupWizardValues,
  step: number,
): ValidationResult<keyof SignupWizardValues> {
  const fullValidation = validateSignupWizard(values);
  const allowedFieldsByStep: Record<number, Array<keyof SignupWizardValues>> = {
    1: ["fullName", "email", "phone"],
    2: ["companyName", "password", "confirmPassword"],
    3: ["acceptTerms"],
  };

  const stepFields = allowedFieldsByStep[step] ?? [];
  const filteredErrors: ValidationErrors<keyof SignupWizardValues> = {};

  stepFields.forEach((field) => {
    const error = fullValidation.errors[field];
    if (error) {
      filteredErrors[field] = error;
    }
  });

  return {
    isValid: Object.keys(filteredErrors).length === 0,
    errors: filteredErrors,
  };
}

export function validateForgotPasswordPayload(
  payload: ForgotPasswordPayload,
): ValidationResult<keyof ForgotPasswordPayload> {
  const errors: ValidationErrors<keyof ForgotPasswordPayload> = {};
  const email = normalizeText(payload.email);

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateResetPasswordPayload(
  payload: ResetPasswordPayload,
): ValidationResult<keyof ResetPasswordPayload> {
  const errors: ValidationErrors<keyof ResetPasswordPayload> = {};

  const email = normalizeText(payload.email);
  const token = normalizeText(payload.token);
  const password = normalizeText(payload.password);
  const confirmPassword = normalizeText(payload.confirmPassword);

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!token) {
    errors.token = "Reset token is required.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (!isStrongPassword(password)) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateVerifyEmailPayload(
  payload: VerifyEmailPayload,
  otpLength = 6,
): ValidationResult<keyof VerifyEmailPayload> {
  const errors: ValidationErrors<keyof VerifyEmailPayload> = {};

  const email = normalizeText(payload.email);
  const otp = normalizeText(payload.otp);

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!otp) {
    errors.otp = "OTP is required.";
  } else if (!isValidOtp(otp, otpLength)) {
    errors.otp = `Enter a valid ${otpLength}-digit OTP.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateVerifyMobileOtpPayload(
  payload: VerifyMobileOtpPayload,
  otpLength = 6,
): ValidationResult<keyof VerifyMobileOtpPayload> {
  const errors: ValidationErrors<keyof VerifyMobileOtpPayload> = {};

  const phone = normalizePhone(payload.phone);
  const otp = normalizeText(payload.otp);

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!isValidPhone(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!otp) {
    errors.otp = "OTP is required.";
  } else if (!isValidOtp(otp, otpLength)) {
    errors.otp = `Enter a valid ${otpLength}-digit OTP.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateOtpSendPayload(
  payload: OtpLoginFormSendOtpPayload,
): ValidationResult<keyof OtpLoginFormSendOtpPayload> {
  const errors: ValidationErrors<keyof OtpLoginFormSendOtpPayload> = {};
  const phone = normalizePhone(payload.phone);

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!isValidPhone(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateOtpLoginPayload(
  payload: OtpLoginFormSubmitPayload,
  otpLength = 6,
): ValidationResult<keyof OtpLoginFormSubmitPayload> {
  const errors: ValidationErrors<keyof OtpLoginFormSubmitPayload> = {};

  const phone = normalizePhone(payload.phone);
  const otp = normalizeText(payload.otp);

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!isValidPhone(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!otp) {
    errors.otp = "OTP is required.";
  } else if (!isValidOtp(otp, otpLength)) {
    errors.otp = `Enter a valid ${otpLength}-digit OTP.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function getFirstValidationError<T extends string>(
  errors: ValidationErrors<T>,
): string {
  const firstKey = Object.keys(errors)[0] as T | undefined;
  if (!firstKey) {
    return "";
  }

  return errors[firstKey] ?? "";
}