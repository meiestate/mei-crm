export type ThemeMode = "light" | "dark";

export type AuthRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "team_lead"
  | "sales"
  | "support"
  | "user";

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

export type AuthProvider =
  | "email"
  | "phone"
  | "google"
  | "microsoft"
  | "apple"
  | "custom";

export type OtpChannel = "email" | "sms";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: AuthRole | string;
  companyName?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  provider?: AuthProvider;
};

export type AuthTokens = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  tokenType?: string;
};

export type AuthSession = {
  user: AuthUser;
  tokens: AuthTokens | null;
};

export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type VerifyMobileOtpPayload = {
  phone: string;
  otp: string;
};

export type ResendOtpPayload = {
  email?: string;
  phone?: string;
  channel: OtpChannel;
};

export type RefreshTokenPayload = {
  refreshToken: string;
};

export type LogoutResponse = {
  loggedOut: boolean;
};

export type AuthMeResponse = {
  user: AuthUser;
};

export type ForgotPasswordResponse = {
  sent: boolean;
  message?: string;
};

export type ResetPasswordResponse = {
  reset: boolean;
  message?: string;
};

export type VerifyEmailResponse = {
  verified: boolean;
  message?: string;
};

export type VerifyMobileOtpResponse = {
  verified: boolean;
  message?: string;
};

export type ResendOtpResponse = {
  sent: boolean;
  message?: string;
};

export type UseAuthActionOptions = {
  onSuccess?: (session: AuthSession) => void;
  onError?: (message: string) => void;
};

export type UseAuthActionResult = {
  isLoading: boolean;
  error: string;
  clearError: () => void;
};

export type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type OtpLoginFormSendOtpPayload = {
  phone: string;
};

export type OtpLoginFormSubmitPayload = {
  phone: string;
  otp: string;
};

export type SignupWizardValues = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export type SignupWizardSubmitPayload = Omit<
  SignupWizardValues,
  "confirmPassword"
>;

export type AuthErrorShape = {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
};

export type AuthStateShape = {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  isHydrated: boolean;
};