declare const process: {
  env: Record<string, string | undefined>;
};

import * as authServiceModule from "./auth.service";

const authService = authServiceModule as any;

type RequestLike = {
  body?: any;
  headers: Record<string, string | string[] | undefined>;
  socket: {
    remoteAddress?: string | null;
  };
  cookies?: Record<string, string | undefined>;
  user?: {
    id: string;
    email?: string | null;
    phone?: string | null;
    role?: string | null;
    workspaceId?: string | null;
  };
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => ResponseLike;
  cookie: (name: string, value: string, options?: Record<string, unknown>) => void;
  clearCookie: (name: string, options?: Record<string, unknown>) => void;
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

const isProd = process.env.NODE_ENV === "production";
const refreshCookieName =
  process.env.AUTH_REFRESH_COOKIE_NAME || "mei_refresh_token";

function getHeaderValue(
  headers: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = headers[key.toLowerCase()] ?? headers[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

function getRequestMeta(req: RequestLike) {
  const forwardedFor = getHeaderValue(req.headers, "x-forwarded-for");

  return {
    ipAddress:
      forwardedFor?.split(",")[0]?.trim() || req.socket.remoteAddress || null,
    userAgent: getHeaderValue(req.headers, "user-agent") || null,
  };
}

function setRefreshTokenCookie(res: ResponseLike, refreshToken: string) {
  res.cookie(refreshCookieName, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
}

function clearRefreshTokenCookie(res: ResponseLike) {
  res.clearCookie(refreshCookieName, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
  });
}

function sendSuccess(
  res: ResponseLike,
  options: {
    message: string;
    data?: unknown;
    statusCode?: number;
  }
) {
  const { message, data = null, statusCode = 200 } = options;

  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function sendError(
  res: ResponseLike,
  options: {
    message: string;
    errors?: unknown;
    statusCode?: number;
  }
) {
  const { message, errors = null, statusCode = 500 } = options;

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

export async function register(req: RequestLike, res: ResponseLike) {
  try {
    const payload = (req.body || {}) as RegisterInput;

    const result = await authService.register(payload, getRequestMeta(req));

    if (result?.tokens?.refreshToken) {
      setRefreshTokenCookie(res, result.tokens.refreshToken);
    }

    return sendSuccess(res, {
      statusCode: 201,
      message: "User registered successfully.",
      data: result,
    });
  } catch (error: any) {
    return sendError(res, {
      statusCode: error?.statusCode || 400,
      message: error?.message || "Failed to register user.",
      errors: error?.errors || null,
    });
  }
}

export async function login(req: RequestLike, res: ResponseLike) {
  try {
    const payload = (req.body || {}) as LoginInput;

    const result = await authService.login(payload, getRequestMeta(req));

    if (result?.tokens?.refreshToken) {
      setRefreshTokenCookie(res, result.tokens.refreshToken);
    }

    return sendSuccess(res, {
      message: "Login successful.",
      data: result,
    });
  } catch (error: any) {
    return sendError(res, {
      statusCode: error?.statusCode || 401,
      message: error?.message || "Invalid credentials.",
      errors: error?.errors || null,
    });
  }
}

export async function getMe(req: RequestLike, res: ResponseLike) {
  try {
    if (!req.user?.id) {
      return sendError(res, {
        statusCode: 401,
        message: "Unauthorized.",
      });
    }

    const result = await authService.getMe(req.user.id);

    return sendSuccess(res, {
      message: "Authenticated user fetched successfully.",
      data: result,
    });
  } catch (error: any) {
    return sendError(res, {
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to fetch authenticated user.",
      errors: error?.errors || null,
    });
  }
}

export async function forgotPassword(req: RequestLike, res: ResponseLike) {
  try {
    const payload = (req.body || {}) as ForgotPasswordInput;

    const result = await authService.forgotPassword(
      payload,
      getRequestMeta(req)
    );

    return sendSuccess(res, {
      message: result?.message || "Password reset link sent successfully.",
      data: result || null,
    });
  } catch (error: any) {
    return sendError(res, {
      statusCode: error?.statusCode || 400,
      message: error?.message || "Failed to send password reset link.",
      errors: error?.errors || null,
    });
  }
}

export async function resetPassword(req: RequestLike, res: ResponseLike) {
  try {
    const payload = (req.body || {}) as ResetPasswordInput;

    const result = await authService.resetPassword(
      payload,
      getRequestMeta(req)
    );

    return sendSuccess(res, {
      message: result?.message || "Password reset successful.",
      data: result || null,
    });
  } catch (error: any) {
    return sendError(res, {
      statusCode: error?.statusCode || 400,
      message: error?.message || "Failed to reset password.",
      errors: error?.errors || null,
    });
  }
}

export async function sendEmailVerification(
  req: RequestLike,
  res: ResponseLike
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendError(res, {
        statusCode: 401,
        message: "Unauthorized.",
      });
    }

    const result = await authService.sendEmailVerification(
      userId,
      getRequestMeta(req)
    );

    return sendSuccess(res, {
      message: result?.message || "Verification email sent successfully.",
      data: result || null,
    });
  } catch (error: any) {
    return sendError(res, {
      statusCode: error?.statusCode || 400,
      message: error?.message || "Failed to send verification email.",
      errors: error?.errors || null,
    });
  }
}

export async function verifyEmail(req: RequestLike, res: ResponseLike) {
  try {
    const payload = (req.body || {}) as VerifyEmailInput;

    const result = await authService.verifyEmail(payload, getRequestMeta(req));

    return sendSuccess(res, {
      message: result?.message || "Email verified successfully.",
      data: result || null,
    });
  } catch (error: any) {
    return sendError(res, {
      statusCode: error?.statusCode || 400,
      message: error?.message || "Failed to verify email.",
      errors: error?.errors || null,
    });
  }
}

export async function sendMobileOtp(req: RequestLike, res: ResponseLike) {
  try {
    const payload = (req.body || {}) as SendMobileOtpInput;

    const result = await authService.sendMobileOtp(
      payload,
      getRequestMeta(req)
    );

    return sendSuccess(res, {
      message: result?.message || "OTP sent successfully.",
      data: result || null,
    });
  } catch (error: any) {
    return sendError(res, {
      statusCode: error?.statusCode || 400,
      message: error?.message || "Failed to send OTP.",
      errors: error?.errors || null,
    });
  }
}

export async function verifyMobileOtp(req: RequestLike, res: ResponseLike) {
  try {
    const payload = (req.body || {}) as VerifyMobileOtpInput;

    const result = await authService.verifyMobileOtp(
      payload,
      getRequestMeta(req)
    );

    if (result?.tokens?.refreshToken) {
      setRefreshTokenCookie(res, result.tokens.refreshToken);
    }

    return sendSuccess(res, {
      message: result?.message || "Mobile number verified successfully.",
      data: result,
    });
  } catch (error: any) {
    return sendError(res, {
      statusCode: error?.statusCode || 400,
      message: error?.message || "Failed to verify OTP.",
      errors: error?.errors || null,
    });
  }
}

export async function refreshToken(req: RequestLike, res: ResponseLike) {
  try {
    const bodyPayload = (req.body || {}) as Partial<RefreshTokenInput>;
    const cookieRefreshToken = req.cookies?.[
      refreshCookieName
    ] as string | undefined;
    const authHeader = getHeaderValue(req.headers, "authorization");

    const bearerRefreshToken =
      authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : undefined;

    const refreshTokenValue =
      bodyPayload.refreshToken || cookieRefreshToken || bearerRefreshToken;

    if (!refreshTokenValue) {
      return sendError(res, {
        statusCode: 401,
        message: "Refresh token is required.",
      });
    }

    const result = await authService.refreshToken(
      { refreshToken: refreshTokenValue },
      getRequestMeta(req)
    );

    if (result?.tokens?.refreshToken) {
      setRefreshTokenCookie(res, result.tokens.refreshToken);
    }

    return sendSuccess(res, {
      message: "Token refreshed successfully.",
      data: result,
    });
  } catch (error: any) {
    clearRefreshTokenCookie(res);

    return sendError(res, {
      statusCode: error?.statusCode || 401,
      message: error?.message || "Failed to refresh token.",
      errors: error?.errors || null,
    });
  }
}

export async function logout(req: RequestLike, res: ResponseLike) {
  try {
    const bodyPayload = (req.body || {}) as Partial<RefreshTokenInput>;
    const cookieRefreshToken = req.cookies?.[
      refreshCookieName
    ] as string | undefined;

    const refreshTokenValue =
      bodyPayload.refreshToken || cookieRefreshToken || "";

    if (refreshTokenValue) {
      await authService.logout(
        { refreshToken: refreshTokenValue },
        getRequestMeta(req)
      );
    }

    clearRefreshTokenCookie(res);

    return sendSuccess(res, {
      message: "Logged out successfully.",
      data: null,
    });
  } catch (error: any) {
    clearRefreshTokenCookie(res);

    return sendError(res, {
      statusCode: error?.statusCode || 400,
      message: error?.message || "Failed to logout.",
      errors: error?.errors || null,
    });
  }
}