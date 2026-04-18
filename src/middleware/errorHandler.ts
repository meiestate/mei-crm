// src/middleware/errorHandler.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

declare const process:
  | {
      env?: Record<string, string | undefined>;
    }
  | undefined;

// @ts-ignore - backend dependency may not be resolved by current frontend tsconfig
import type { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    details?: unknown,
    isOperational = true,
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export interface ErrorResponseBody {
  success: false;
  message: string;
  code: string;
  statusCode: number;
  details?: unknown;
  stack?: string;
  path?: string;
  timestamp: string;
}

const isProduction = (): boolean => {
  return process?.env?.NODE_ENV === "production";
};

const getStatusCode = (error: unknown): number => {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof (error as { statusCode?: unknown }).statusCode === "number"
  ) {
    const statusCode = (error as { statusCode: number }).statusCode;

    if (statusCode >= 400 && statusCode <= 599) {
      return statusCode;
    }
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  ) {
    const status = (error as { status: number }).status;

    if (status >= 400 && status <= 599) {
      return status;
    }
  }

  return 500;
};

const getErrorCode = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string" &&
    (error as { code: string }).code.trim()
  ) {
    return (error as { code: string }).code.trim();
  }

  return "INTERNAL_SERVER_ERROR";
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    const message = (error as { message: string }).message.trim();
    return message || "Something went wrong";
  }

  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  return "Something went wrong";
};

const getErrorDetails = (error: unknown): unknown => {
  if (
    typeof error === "object" &&
    error !== null &&
    "details" in error
  ) {
    return (error as { details?: unknown }).details;
  }

  return undefined;
};

const getErrorStack = (error: unknown): string | undefined => {
  if (error instanceof Error && typeof error.stack === "string") {
    return error.stack;
  }

  return undefined;
};

const normalizeValidationError = (error: unknown): AppError | null => {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: unknown }).name === "ZodError"
  ) {
    const details =
      "issues" in (error as Record<string, unknown>)
        ? (error as Record<string, unknown>).issues
        : undefined;

    return new AppError(
      "Validation failed",
      400,
      "VALIDATION_ERROR",
      details,
    );
  }

  return null;
};

const normalizeJwtError = (error: unknown): AppError | null => {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof (error as { name?: unknown }).name === "string"
  ) {
    const errorName = (error as { name: string }).name;

    if (errorName === "TokenExpiredError") {
      return new AppError(
        "Token expired",
        401,
        "TOKEN_EXPIRED",
      );
    }

    if (errorName === "JsonWebTokenError" || errorName === "NotBeforeError") {
      return new AppError(
        "Invalid token",
        401,
        "INVALID_TOKEN",
      );
    }
  }

  return null;
};

const normalizeCastError = (error: unknown): AppError | null => {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: unknown }).name === "CastError"
  ) {
    const path =
      "path" in (error as Record<string, unknown>) &&
      typeof (error as Record<string, unknown>).path === "string"
        ? (error as Record<string, unknown>).path
        : "resource";

    return new AppError(
      `Invalid ${path}`,
      400,
      "INVALID_IDENTIFIER",
    );
  }

  return null;
};

const normalizeDuplicateKeyError = (error: unknown): AppError | null => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  ) {
    const keyValue =
      "keyValue" in (error as Record<string, unknown>)
        ? (error as Record<string, unknown>).keyValue
        : undefined;

    return new AppError(
      "Duplicate value found",
      409,
      "DUPLICATE_RESOURCE",
      keyValue,
    );
  }

  return null;
};

const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  return (
    normalizeValidationError(error) ||
    normalizeJwtError(error) ||
    normalizeCastError(error) ||
    normalizeDuplicateKeyError(error) ||
    new AppError(
      getErrorMessage(error),
      getStatusCode(error),
      getErrorCode(error),
      getErrorDetails(error),
      false,
    )
  );
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(
    new AppError(
      `Route not found: ${req.method} ${req.originalUrl}`,
      404,
      "ROUTE_NOT_FOUND",
    ),
  );
};

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response<ErrorResponseBody>,
  _next: NextFunction,
): void => {
  const normalizedError = normalizeError(error);
  const production = isProduction();

  const responseBody: ErrorResponseBody = {
    success: false,
    message:
      production && normalizedError.statusCode >= 500
        ? "Internal server error"
        : normalizedError.message,
    code: normalizedError.code,
    statusCode: normalizedError.statusCode,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  };

  if (!production && normalizedError.details !== undefined) {
    responseBody.details = normalizedError.details;
  }

  if (!production) {
    responseBody.stack = getErrorStack(error);
  }

  if (!production) {
    console.error("API Error:", {
      method: req.method,
      path: req.originalUrl,
      statusCode: normalizedError.statusCode,
      code: normalizedError.code,
      message: normalizedError.message,
      details: normalizedError.details,
      stack: getErrorStack(error),
    });
  }

  res.status(normalizedError.statusCode).json(responseBody);
};

export default errorHandler;