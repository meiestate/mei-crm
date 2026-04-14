import type {
  ForgotPasswordInput,
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
  ResetPasswordInput,
  SendMobileOtpInput,
  VerifyEmailInput,
  VerifyMobileOtpInput,
} from "./auth.types";

export type ValidationIssue = {
  field: string;
  message: string;
};

export type ValidationResult<T> =
  | {
      success: true;
      data: T;
      errors: [];
    }
  | {
      success: false;
      data: null;
      errors: ValidationIssue[];
    };

function ok<T>(data: T): ValidationResult<T> {
  return {
    success: true,
    data,
    errors: [],
  };
}

function fail<T>(errors: ValidationIssue[]): ValidationResult<T> {
  return {
    success: false,
    data: null,
    errors,
  };
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  return /^\+?[0-9]{8,15}$/.test(phone.replace(/[\s-]/g, ""));
}

function hasUppercase(value: string) {
  return /[A-Z]/.test(value);
}

function hasLowercase(value: string) {
  return /[a-z]/.test(value);
}

function hasNumber(value: string) {
  return /[0-9]/.test(value);
}

function hasSpecialChar(value: string) {
  return /[^A-Za-z0-9]/.test(value);
}

function validatePassword(password: string, field = "password") {
  const errors: ValidationIssue[] = [];

  if (password.length < 8) {
    errors.push({
      field,
      message: "Password must be at least 8 characters long.",
    });
  }

  if (!hasUppercase(password)) {
    errors.push({
      field,
      message: "Password must contain at least one uppercase letter.",
    });
  }

  if (!hasLowercase(password)) {
    errors.push({
      field,
      message: "Password must contain at least one lowercase letter.",
    });
  }

  if (!hasNumber(password)) {
    errors.push({
      field,
      message: "Password must contain at least one number.",
    });
  }

  if (!hasSpecialChar(password)) {
    errors.push({
      field,
      message: "Password must contain at least one special character.",
    });
  }

  return errors;
}

export function validateRegisterInput(
  input: Partial<RegisterInput>
): ValidationResult<RegisterInput> {
  const errors: ValidationIssue[] = [];

  const firstName = normalizeString(input.firstName);
  const lastName = normalizeString(input.lastName);
  const email = normalizeString(input.email).toLowerCase();
  const phone = normalizeString(input.phone);
  const password = normalizeString(input.password);
  const role = normalizeString(input.role);
  const workspaceId = normalizeString(input.workspaceId);

  if (!email && !phone) {
    errors.push({
      field: "email",
      message: "Email or phone is required.",
    });
    errors.push({
      field: "phone",
      message: "Email or phone is required.",
    });
  }

  if (email && !isValidEmail(email)) {
    errors.push({
      field: "email",
      message: "Please enter a valid email address.",
    });
  }

  if (phone && !isValidPhone(phone)) {
    errors.push({
      field: "phone",
      message: "Please enter a valid phone number.",
    });
  }

  if (!password) {
    errors.push({
      field: "password",
      message: "Password is required.",
    });
  } else {
    errors.push(...validatePassword(password, "password"));
  }

  if (firstName && firstName.length > 50) {
    errors.push({
      field: "firstName",
      message: "First name must be 50 characters or less.",
    });
  }

  if (lastName && lastName.length > 50) {
    errors.push({
      field: "lastName",
      message: "Last name must be 50 characters or less.",
    });
  }

  if (role && role.length > 50) {
    errors.push({
      field: "role",
      message: "Role value is too long.",
    });
  }

  if (workspaceId && workspaceId.length > 100) {
    errors.push({
      field: "workspaceId",
      message: "Workspace ID value is too long.",
    });
  }

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok({
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    email: email || undefined,
    phone: phone || undefined,
    password,
    role: role || undefined,
    workspaceId: workspaceId || undefined,
  });
}

export function validateLoginInput(
  input: Partial<LoginInput>
): ValidationResult<LoginInput> {
  const errors: ValidationIssue[] = [];

  const email = normalizeString(input.email).toLowerCase();
  const phone = normalizeString(input.phone);
  const password = normalizeString(input.password);

  if (!email && !phone) {
    errors.push({
      field: "email",
      message: "Email or phone is required.",
    });
    errors.push({
      field: "phone",
      message: "Email or phone is required.",
    });
  }

  if (email && !isValidEmail(email)) {
    errors.push({
      field: "email",
      message: "Please enter a valid email address.",
    });
  }

  if (phone && !isValidPhone(phone)) {
    errors.push({
      field: "phone",
      message: "Please enter a valid phone number.",
    });
  }

  if (!password) {
    errors.push({
      field: "password",
      message: "Password is required.",
    });
  }

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok({
    email: email || undefined,
    phone: phone || undefined,
    password,
  });
}

export function validateForgotPasswordInput(
  input: Partial<ForgotPasswordInput>
): ValidationResult<ForgotPasswordInput> {
  const errors: ValidationIssue[] = [];
  const email = normalizeString(input.email).toLowerCase();

  if (!email) {
    errors.push({
      field: "email",
      message: "Email is required.",
    });
  } else if (!isValidEmail(email)) {
    errors.push({
      field: "email",
      message: "Please enter a valid email address.",
    });
  }

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok({ email });
}

export function validateResetPasswordInput(
  input: Partial<ResetPasswordInput>
): ValidationResult<ResetPasswordInput> {
  const errors: ValidationIssue[] = [];

  const token = normalizeString(input.token);
  const newPassword = normalizeString(input.newPassword);

  if (!token) {
    errors.push({
      field: "token",
      message: "Reset token is required.",
    });
  }

  if (!newPassword) {
    errors.push({
      field: "newPassword",
      message: "New password is required.",
    });
  } else {
    errors.push(...validatePassword(newPassword, "newPassword"));
  }

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok({
    token,
    newPassword,
  });
}

export function validateVerifyEmailInput(
  input: Partial<VerifyEmailInput>
): ValidationResult<VerifyEmailInput> {
  const errors: ValidationIssue[] = [];
  const token = normalizeString(input.token);

  if (!token) {
    errors.push({
      field: "token",
      message: "Verification token is required.",
    });
  }

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok({ token });
}

export function validateSendMobileOtpInput(
  input: Partial<SendMobileOtpInput>
): ValidationResult<SendMobileOtpInput> {
  const errors: ValidationIssue[] = [];
  const phone = normalizeString(input.phone);

  if (!phone) {
    errors.push({
      field: "phone",
      message: "Phone number is required.",
    });
  } else if (!isValidPhone(phone)) {
    errors.push({
      field: "phone",
      message: "Please enter a valid phone number.",
    });
  }

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok({ phone });
}

export function validateVerifyMobileOtpInput(
  input: Partial<VerifyMobileOtpInput>
): ValidationResult<VerifyMobileOtpInput> {
  const errors: ValidationIssue[] = [];

  const phone = normalizeString(input.phone);
  const otp = normalizeString(input.otp);

  if (!phone) {
    errors.push({
      field: "phone",
      message: "Phone number is required.",
    });
  } else if (!isValidPhone(phone)) {
    errors.push({
      field: "phone",
      message: "Please enter a valid phone number.",
    });
  }

  if (!otp) {
    errors.push({
      field: "otp",
      message: "OTP is required.",
    });
  } else if (!/^\d{4,8}$/.test(otp)) {
    errors.push({
      field: "otp",
      message: "OTP must be 4 to 8 digits.",
    });
  }

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok({
    phone,
    otp,
  });
}

export function validateRefreshTokenInput(
  input: Partial<RefreshTokenInput>
): ValidationResult<RefreshTokenInput> {
  const errors: ValidationIssue[] = [];
  const refreshToken = normalizeString(input.refreshToken);

  if (!refreshToken) {
    errors.push({
      field: "refreshToken",
      message: "Refresh token is required.",
    });
  }

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok({ refreshToken });
}

function createValidationError(errors: ValidationIssue[]) {
  const error = new Error("Validation failed.") as Error & {
    statusCode?: number;
    errors?: ValidationIssue[];
  };

  error.statusCode = 400;
  error.errors = errors;

  return error;
}

export function assertValidRegisterInput(input: Partial<RegisterInput>) {
  const result = validateRegisterInput(input);

  if (!result.success) {
    throw createValidationError(result.errors);
  }

  return result.data;
}

export function assertValidLoginInput(input: Partial<LoginInput>) {
  const result = validateLoginInput(input);

  if (!result.success) {
    throw createValidationError(result.errors);
  }

  return result.data;
}

export function assertValidForgotPasswordInput(
  input: Partial<ForgotPasswordInput>
) {
  const result = validateForgotPasswordInput(input);

  if (!result.success) {
    throw createValidationError(result.errors);
  }

  return result.data;
}

export function assertValidResetPasswordInput(
  input: Partial<ResetPasswordInput>
) {
  const result = validateResetPasswordInput(input);

  if (!result.success) {
    throw createValidationError(result.errors);
  }

  return result.data;
}

export function assertValidVerifyEmailInput(input: Partial<VerifyEmailInput>) {
  const result = validateVerifyEmailInput(input);

  if (!result.success) {
    throw createValidationError(result.errors);
  }

  return result.data;
}

export function assertValidSendMobileOtpInput(
  input: Partial<SendMobileOtpInput>
) {
  const result = validateSendMobileOtpInput(input);

  if (!result.success) {
    throw createValidationError(result.errors);
  }

  return result.data;
}

export function assertValidVerifyMobileOtpInput(
  input: Partial<VerifyMobileOtpInput>
) {
  const result = validateVerifyMobileOtpInput(input);

  if (!result.success) {
    throw createValidationError(result.errors);
  }

  return result.data;
}

export function assertValidRefreshTokenInput(
  input: Partial<RefreshTokenInput>
) {
  const result = validateRefreshTokenInput(input);

  if (!result.success) {
    throw createValidationError(result.errors);
  }

  return result.data;
}