// src/middleware/authOptional.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

declare const process:
  | {
      env?: Record<string, string | undefined>;
    }
  | undefined;

// @ts-ignore - backend dependency may not be resolved by current frontend tsconfig
import type { NextFunction, Request, Response } from "express";
// @ts-ignore - backend dependency may not be resolved by current frontend tsconfig
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
  workspaceId?: string;
  name?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
  token?: string;
}

type SupportedJwtPayload = JwtPayload & {
  id?: string;
  userId?: string;
  sub?: string;
  email?: string;
  role?: string;
  workspaceId?: string;
  name?: string;
};

const getJwtSecret = (): string => {
  const secret = process?.env?.JWT_SECRET;

  if (typeof secret === "string" && secret.trim().length > 0) {
    return secret.trim();
  }

  return "dev-jwt-secret";
};

const getTokenFromRequest = (req: Request): string | null => {
  const authHeader =
    typeof req.headers?.authorization === "string"
      ? req.headers.authorization
      : "";

  if (authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();

    if (bearerToken) {
      return bearerToken;
    }
  }

  const cookieSource = (req as Request & {
    cookies?: Record<string, unknown>;
  }).cookies;

  const accessToken =
    typeof cookieSource?.accessToken === "string"
      ? cookieSource.accessToken
      : null;

  if (accessToken && accessToken.trim()) {
    return accessToken.trim();
  }

  const token =
    typeof cookieSource?.token === "string" ? cookieSource.token : null;

  if (token && token.trim()) {
    return token.trim();
  }

  return null;
};

const mapPayloadToUser = (payload: SupportedJwtPayload): AuthUser | null => {
  const id = payload.id ?? payload.userId ?? payload.sub;

  if (typeof id !== "string" || id.trim().length === 0) {
    return null;
  }

  return {
    id,
    email: typeof payload.email === "string" ? payload.email : undefined,
    role: typeof payload.role === "string" ? payload.role : undefined,
    workspaceId:
      typeof payload.workspaceId === "string" ? payload.workspaceId : undefined,
    name: typeof payload.name === "string" ? payload.name : undefined,
  };
};

export const authOptional = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      next();
      return;
    }

    let decoded: string | JwtPayload;

    try {
      decoded = jwt.verify(token, getJwtSecret()) as string | JwtPayload;
    } catch {
      next();
      return;
    }

    if (typeof decoded === "string") {
      next();
      return;
    }

    const user = mapPayloadToUser(decoded as SupportedJwtPayload);

    if (user) {
      req.user = user;
      req.token = token;
    }

    next();
  } catch {
    next();
  }
};

export default authOptional;