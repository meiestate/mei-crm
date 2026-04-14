declare function require(moduleName: string): any;
declare const process: {
  env: Record<string, string | undefined>;
};

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const prismaModule = require("../../prisma/client");
const prisma = prismaModule.prisma || prismaModule.default || prismaModule;

type RequestMeta = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

type RegisterInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password: string;
  role?: string;
  workspaceId?: string;
};

type LoginInput = {
  email?: string;
  phone?: string;
  password: string;
};

type ForgotPasswordInput = {
  email: string;
};

type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

type VerifyEmailInput = {
  token: string;
};

type SendMobileOtpInput = {
  phone: string;
};

type VerifyMobileOtpInput = {
  phone: string;
  otp: string;
};

type RefreshTokenInput = {
  refreshToken: string;
};

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "mei_access_secret_dev";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "mei_refresh_secret_dev";
const ACCESS_TOKEN_EXPIRES_IN =
  process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN =
  process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";
const PASSWORD_RESET_EXPIRES_MINUTES = Number(
  process.env.PASSWORD_RESET_EXPIRES_MINUTES || 30
);
const EMAIL_VERIFY_EXPIRES_HOURS = Number(
  process.env.EMAIL_VERIFY_EXPIRES_HOURS || 24
);
const MOBILE_OTP_EXPIRES_MINUTES = Number(
  process.env.MOBILE_OTP_EXPIRES_MINUTES || 10
);
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

function createError(message: string, statusCode = 400, errors?: unknown) {
  const error = new Error(message) as Error & {
    statusCode?: number;
    errors?: unknown;
  };

  error.statusCode = statusCode;
  error.errors = errors ?? null;
  return error;
}

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || null;
}

function normalizePhone(phone?: string | null) {
  return phone?.trim() || null;
}

function getUserDisplayName(user: any) {
  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) return fullName;
  if (user?.name?.trim()) return user.name.trim();
  if (user?.email) return user.email;
  if (user?.phone) return user.phone;
  return "User";
}

function toSafeUser(user: any) {
  return {
    id: String(user.id),
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    name: getUserDisplayName(user),
    email: user.email ?? null,
    phone: user.phone ?? null,
    role: user.role ?? null,
    workspaceId: user.workspaceId ?? null,
    emailVerified: Boolean(user.emailVerified),
    phoneVerified: Boolean(user.phoneVerified),
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

function generateOtp(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i += 1) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

function parseDurationToSeconds(value: string) {
  const match = /^(\d+)([smhd])$/i.exec(value.trim());

  if (!match) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === "s") return amount;
  if (unit === "m") return amount * 60;
  if (unit === "h") return amount * 60 * 60;
  if (unit === "d") return amount * 60 * 60 * 24;

  return 0;
}

function signAccessToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

function signRefreshToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

async function saveAuditLog(params: {
  userId?: string | null;
  action: string;
  meta?: Record<string, unknown>;
  requestMeta?: RequestMeta;
}) {
  try {
    if (!prisma?.auditLog?.create) return;

    await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        meta: {
          ...(params.meta || {}),
          ipAddress: params.requestMeta?.ipAddress || null,
          userAgent: params.requestMeta?.userAgent || null,
        },
      },
    });
  } catch {
    // silent
  }
}

async function ensureUserActive(user: any) {
  if (!user) {
    throw createError("User not found.", 404);
  }

  if (user.isActive === false) {
    throw createError("Your account is inactive. Please contact support.", 403);
  }
}

async function issueTokens(user: any) {
  const payload = {
    sub: String(user.id),
    email: user.email ?? null,
    phone: user.phone ?? null,
    role: user.role ?? null,
    workspaceId: user.workspaceId ?? null,
    tokenVersion: user.tokenVersion ?? 0,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const refreshTokenHash = hashToken(refreshToken);
  const refreshExpiresAt = new Date();
  refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 30);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshTokenHash,
      refreshTokenExpiresAt: refreshExpiresAt,
      lastLoginAt: new Date(),
    },
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: parseDurationToSeconds(String(ACCESS_TOKEN_EXPIRES_IN)),
    refreshExpiresIn: parseDurationToSeconds(String(REFRESH_TOKEN_EXPIRES_IN)),
  };
}

export async function register(
  payload: RegisterInput,
  requestMeta?: RequestMeta
) {
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);

  if (!email && !phone) {
    throw createError("Email or phone is required for registration.", 400);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    },
  });

  if (existingUser) {
    throw createError("A user with this email or phone already exists.", 409);
  }

  const passwordHash = await bcrypt.hash(payload.password, BCRYPT_SALT_ROUNDS);

  const createdUser = await prisma.user.create({
    data: {
      firstName: payload.firstName?.trim() || null,
      lastName: payload.lastName?.trim() || null,
      email,
      phone,
      passwordHash,
      role: payload.role || "USER",
      workspaceId: payload.workspaceId || null,
      emailVerified: false,
      phoneVerified: false,
      isActive: true,
      tokenVersion: 0,
    },
  });

  const tokens = await issueTokens(createdUser);

  await saveAuditLog({
    userId: String(createdUser.id),
    action: "AUTH_REGISTER",
    meta: { email, phone },
    requestMeta,
  });

  return {
    user: toSafeUser(createdUser),
    tokens,
  };
}

export async function login(
  payload: LoginInput,
  requestMeta?: RequestMeta
) {
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);

  if (!email && !phone) {
    throw createError("Email or phone is required.", 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    },
  });

  await ensureUserActive(user);

  if (!user?.passwordHash) {
    throw createError("Password login is not available for this account.", 400);
  }

  const passwordOk = await bcrypt.compare(payload.password, user.passwordHash);

  if (!passwordOk) {
    throw createError("Invalid credentials.", 401);
  }

  const tokens = await issueTokens(user);

  await saveAuditLog({
    userId: String(user.id),
    action: "AUTH_LOGIN",
    meta: { email: user.email, phone: user.phone },
    requestMeta,
  });

  return {
    user: toSafeUser(user),
    tokens,
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  await ensureUserActive(user);

  return {
    user: toSafeUser(user),
  };
}

export async function forgotPassword(
  payload: ForgotPasswordInput,
  requestMeta?: RequestMeta
) {
  const email = normalizeEmail(payload.email);

  if (!email) {
    throw createError("Email is required.", 400);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      message:
        "If an account exists for this email, a password reset link has been sent.",
    };
  }

  const rawToken = generateRandomToken(32);
  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + PASSWORD_RESET_EXPIRES_MINUTES);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetTokenHash: tokenHash,
      passwordResetTokenExpiresAt: expiresAt,
    },
  });

  await saveAuditLog({
    userId: String(user.id),
    action: "AUTH_FORGOT_PASSWORD",
    meta: { email },
    requestMeta,
  });

  return {
    message:
      "If an account exists for this email, a password reset link has been sent.",
    resetToken: rawToken,
    expiresAt,
  };
}

export async function resetPassword(
  payload: ResetPasswordInput,
  requestMeta?: RequestMeta
) {
  if (!payload.token?.trim()) {
    throw createError("Reset token is required.", 400);
  }

  if (!payload.newPassword?.trim()) {
    throw createError("New password is required.", 400);
  }

  const tokenHash = hashToken(payload.token.trim());

  const user = await prisma.user.findFirst({
    where: {
      passwordResetTokenHash: tokenHash,
      passwordResetTokenExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw createError("Invalid or expired reset token.", 400);
  }

  const passwordHash = await bcrypt.hash(
    payload.newPassword,
    BCRYPT_SALT_ROUNDS
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
      refreshTokenHash: null,
      refreshTokenExpiresAt: null,
      tokenVersion: (user.tokenVersion ?? 0) + 1,
    },
  });

  await saveAuditLog({
    userId: String(user.id),
    action: "AUTH_RESET_PASSWORD",
    requestMeta,
  });

  return {
    message: "Password reset successful.",
  };
}

export async function sendEmailVerification(
  userId: string,
  requestMeta?: RequestMeta
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  await ensureUserActive(user);

  if (!user?.email) {
    throw createError("This account does not have an email address.", 400);
  }

  if (user.emailVerified) {
    return {
      message: "Email is already verified.",
    };
  }

  const rawToken = generateRandomToken(32);
  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + EMAIL_VERIFY_EXPIRES_HOURS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationTokenHash: tokenHash,
      emailVerificationTokenExpiresAt: expiresAt,
    },
  });

  await saveAuditLog({
    userId: String(user.id),
    action: "AUTH_SEND_EMAIL_VERIFICATION",
    requestMeta,
  });

  return {
    message: "Verification email sent successfully.",
    verificationToken: rawToken,
    expiresAt,
  };
}

export async function verifyEmail(
  payload: VerifyEmailInput,
  requestMeta?: RequestMeta
) {
  if (!payload.token?.trim()) {
    throw createError("Verification token is required.", 400);
  }

  const tokenHash = hashToken(payload.token.trim());

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationTokenHash: tokenHash,
      emailVerificationTokenExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw createError("Invalid or expired email verification token.", 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
    },
  });

  await saveAuditLog({
    userId: String(updatedUser.id),
    action: "AUTH_VERIFY_EMAIL",
    requestMeta,
  });

  return {
    message: "Email verified successfully.",
    user: toSafeUser(updatedUser),
  };
}

export async function sendMobileOtp(
  payload: SendMobileOtpInput,
  requestMeta?: RequestMeta
) {
  const phone = normalizePhone(payload.phone);

  if (!phone) {
    throw createError("Phone number is required.", 400);
  }

  const user = await prisma.user.findFirst({
    where: { phone },
  });

  if (!user) {
    throw createError("No account found with this mobile number.", 404);
  }

  await ensureUserActive(user);

  const otp = generateOtp(6);
  const otpHash = hashToken(otp);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + MOBILE_OTP_EXPIRES_MINUTES);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      mobileOtpHash: otpHash,
      mobileOtpExpiresAt: expiresAt,
    },
  });

  await saveAuditLog({
    userId: String(user.id),
    action: "AUTH_SEND_MOBILE_OTP",
    requestMeta,
  });

  return {
    message: "OTP sent successfully.",
    otp,
    expiresAt,
  };
}

export async function verifyMobileOtp(
  payload: VerifyMobileOtpInput,
  requestMeta?: RequestMeta
) {
  const phone = normalizePhone(payload.phone);

  if (!phone) {
    throw createError("Phone number is required.", 400);
  }

  if (!payload.otp?.trim()) {
    throw createError("OTP is required.", 400);
  }

  const otpHash = hashToken(payload.otp.trim());

  const user = await prisma.user.findFirst({
    where: {
      phone,
      mobileOtpHash: otpHash,
      mobileOtpExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw createError("Invalid or expired OTP.", 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      phoneVerified: true,
      mobileOtpHash: null,
      mobileOtpExpiresAt: null,
    },
  });

  const tokens = await issueTokens(updatedUser);

  await saveAuditLog({
    userId: String(updatedUser.id),
    action: "AUTH_VERIFY_MOBILE_OTP",
    requestMeta,
  });

  return {
    message: "Mobile number verified successfully.",
    user: toSafeUser(updatedUser),
    tokens,
  };
}

export async function refreshToken(
  payload: RefreshTokenInput,
  requestMeta?: RequestMeta
) {
  if (!payload.refreshToken?.trim()) {
    throw createError("Refresh token is required.", 401);
  }

  let decoded: any;

  try {
    decoded = jwt.verify(payload.refreshToken, REFRESH_TOKEN_SECRET);
  } catch {
    throw createError("Invalid or expired refresh token.", 401);
  }

  const userId = String(decoded?.sub || "");

  if (!userId) {
    throw createError("Invalid refresh token payload.", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  await ensureUserActive(user);

  const incomingHash = hashToken(payload.refreshToken);

  if (!user?.refreshTokenHash || user.refreshTokenHash !== incomingHash) {
    throw createError("Refresh token mismatch.", 401);
  }

  if (
    user.refreshTokenExpiresAt &&
    new Date(user.refreshTokenExpiresAt).getTime() <= Date.now()
  ) {
    throw createError("Refresh token expired.", 401);
  }

  const tokens = await issueTokens(user);

  await saveAuditLog({
    userId: String(user.id),
    action: "AUTH_REFRESH_TOKEN",
    requestMeta,
  });

  return {
    user: toSafeUser(user),
    tokens,
  };
}

export async function logout(
  payload: RefreshTokenInput,
  requestMeta?: RequestMeta
) {
  if (!payload.refreshToken?.trim()) {
    return {
      message: "Logged out successfully.",
    };
  }

  try {
    const decoded = jwt.verify(payload.refreshToken, REFRESH_TOKEN_SECRET);
    const userId = String(decoded?.sub || "");

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          refreshTokenHash: null,
          refreshTokenExpiresAt: null,
        },
      });

      await saveAuditLog({
        userId,
        action: "AUTH_LOGOUT",
        requestMeta,
      });
    }
  } catch {
    // graceful logout
  }

  return {
    message: "Logged out successfully.",
  };
}