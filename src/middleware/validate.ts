// src/middleware/validate.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

// @ts-ignore - backend dependency may not be resolved by current frontend tsconfig
import type { NextFunction, Request, Response } from "express";
// @ts-ignore - zod may exist only in backend package
import type { AnyZodObject, ZodSchema } from "zod";

// @ts-ignore - local backend error utility
import { AppError } from "./errorHandler";

export interface ValidationSchemas {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
  headers?: ZodSchema<any>;
}

export interface ValidatedRequest<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
  THeaders = Record<string, unknown>,
> extends Request {
  body: TBody;
  query: TQuery;
  params: TParams;
  validated?: {
    body?: TBody;
    query?: TQuery;
    params?: TParams;
    headers?: THeaders;
  };
}

interface FormattedValidationIssue {
  path: string;
  message: string;
  code?: string;
}

const formatZodIssues = (error: any): FormattedValidationIssue[] => {
  const rawIssues = Array.isArray(error?.issues) ? error.issues : [];

  return rawIssues.map((issue: any) => ({
    path: Array.isArray(issue?.path) ? issue.path.join(".") : "",
    message:
      typeof issue?.message === "string" && issue.message.trim()
        ? issue.message
        : "Invalid value",
    code: typeof issue?.code === "string" ? issue.code : undefined,
  }));
};

const validateWithSchema = <T>(
  schema: ZodSchema<T>,
  payload: unknown,
): T => {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new AppError(
      "Validation failed",
      400,
      "VALIDATION_ERROR",
      formatZodIssues(result.error),
    );
  }

  return result.data;
};

export const validate = (schemas: ValidationSchemas) => {
  return (
    req: ValidatedRequest,
    _res: Response,
    next: NextFunction,
  ): void => {
    try {
      const validated: NonNullable<ValidatedRequest["validated"]> = {};

      if (schemas.body) {
        const parsedBody = validateWithSchema(schemas.body, req.body);
        req.body = parsedBody;
        validated.body = parsedBody;
      }

      if (schemas.query) {
        const parsedQuery = validateWithSchema(schemas.query, req.query);
        req.query = parsedQuery as Request["query"];
        validated.query = parsedQuery;
      }

      if (schemas.params) {
        const parsedParams = validateWithSchema(schemas.params, req.params);
        req.params = parsedParams as Request["params"];
        validated.params = parsedParams;
      }

      if (schemas.headers) {
        const requestHeaders = (req as Request).headers;
        const parsedHeaders = validateWithSchema(schemas.headers, requestHeaders);
        validated.headers = parsedHeaders as Record<string, unknown>;
      }

      req.validated = validated;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateBody = <T>(schema: ZodSchema<T>) => {
  return validate({ body: schema });
};

export const validateQuery = <T>(schema: ZodSchema<T>) => {
  return validate({ query: schema });
};

export const validateParams = <T>(schema: ZodSchema<T>) => {
  return validate({ params: schema });
};

export const validateHeaders = <T>(schema: ZodSchema<T>) => {
  return validate({ headers: schema });
};

export const validateAll = <
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
  THeaders = Record<string, unknown>,
>(schemas: {
  body?: ZodSchema<TBody>;
  query?: ZodSchema<TQuery>;
  params?: ZodSchema<TParams>;
  headers?: AnyZodObject | ZodSchema<THeaders>;
}) => {
  return validate(schemas);
};

export default validate;