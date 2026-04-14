export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "AGENT"
  | "USER";

export type RequestMeta = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type AuthUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: UserRole | string | null;
  workspaceId?: string | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
};

export type RegisterInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password: string;
  role?: UserRole | string;
  workspaceId?: string;
};

export type LoginInput = {
  email?: string;
  phone?: string;
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

export type VerifyEmailInput = {
  token: string;
};

export type SendMobileOtpInput = {
  phone: string;
};

export type VerifyMobileOtpInput = {
  phone: string;
  otp: string;
};

export type RefreshTokenInput = {
  refreshToken: string;
};

export type LogoutInput = {
  refreshToken?: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type AuthSuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data: T;
};

export type AuthErrorResponse = {
  success: false;
  message: string;
  errors?: unknown;
};

export type RegisterResponseData = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type LoginResponseData = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type GetMeResponseData = {
  user: AuthUser;
};

export type ForgotPasswordResponseData = {
  message: string;
  resetToken?: string;
  expiresAt?: Date | string;
};

export type ResetPasswordResponseData = {
  message: string;
};

export type SendEmailVerificationResponseData = {
  message: string;
  verificationToken?: string;
  expiresAt?: Date | string;
};

export type VerifyEmailResponseData = {
  message: string;
  user?: AuthUser;
};

export type SendMobileOtpResponseData = {
  message: string;
  otp?: string;
  expiresAt?: Date | string;
};

export type VerifyMobileOtpResponseData = {
  message: string;
  user: AuthUser;
  tokens: AuthTokens;
};

export type RefreshTokenResponseData = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type LogoutResponseData = {
  message: string;
};

export type AuthenticatedRequestUser = {
  id: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  workspaceId?: string | null;
};