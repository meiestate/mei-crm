// src/utils/communications/mergeTemplateVariables.ts

import type { TemplateVariable } from "../../types/communications/template.types";

export type TemplateVariablePrimitive =
  | string
  | number
  | boolean
  | null
  | undefined;

export type TemplateVariableMap = Record<string, TemplateVariablePrimitive>;

export type MergeTemplateVariablesOptions = {
  fallbackStart?: string;
  fallbackEnd?: string;
  keepUnknownPlaceholders?: boolean;
  trimValues?: boolean;
};

const DEFAULT_OPTIONS: Required<MergeTemplateVariablesOptions> = {
  fallbackStart: "{{",
  fallbackEnd: "}}",
  keepUnknownPlaceholders: true,
  trimValues: true,
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeValue(
  value: TemplateVariablePrimitive,
  trimValues: boolean,
): string {
  if (value === null || value === undefined) return "";
  const normalized = String(value);
  return trimValues ? normalized.trim() : normalized;
}

export function buildTemplateVariableMap(
  variables?: TemplateVariable[],
  values?: TemplateVariableMap,
): TemplateVariableMap {
  const result: TemplateVariableMap = {};

  for (const variable of variables ?? []) {
    result[variable.key] = variable.fallbackValue ?? "";
  }

  for (const [key, value] of Object.entries(values ?? {})) {
    result[key] = value;
  }

  return result;
}

export function extractTemplatePlaceholders(
  content?: string,
  options?: MergeTemplateVariablesOptions,
): string[] {
  if (!content) return [];

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const pattern = new RegExp(
    `${escapeRegExp(mergedOptions.fallbackStart)}\\s*([a-zA-Z0-9_.-]+)\\s*${escapeRegExp(mergedOptions.fallbackEnd)}`,
    "g",
  );

  const matches = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    if (match[1]) {
      matches.add(match[1]);
    }
  }

  return Array.from(matches);
}

export function mergeTemplateVariables(
  content: string,
  values?: TemplateVariableMap,
  templateVariables?: TemplateVariable[],
  options?: MergeTemplateVariablesOptions,
): string {
  if (!content) return "";

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const variableMap = buildTemplateVariableMap(templateVariables, values);

  const pattern = new RegExp(
    `${escapeRegExp(mergedOptions.fallbackStart)}\\s*([a-zA-Z0-9_.-]+)\\s*${escapeRegExp(mergedOptions.fallbackEnd)}`,
    "g",
  );

  return content.replace(pattern, (_fullMatch, key: string) => {
    if (Object.prototype.hasOwnProperty.call(variableMap, key)) {
      return normalizeValue(variableMap[key], mergedOptions.trimValues);
    }

    return mergedOptions.keepUnknownPlaceholders
      ? `${mergedOptions.fallbackStart}${key}${mergedOptions.fallbackEnd}`
      : "";
  });
}

export function mergeTemplateSubjectAndBody(params: {
  subject?: string;
  body?: string;
  htmlBody?: string;
  variables?: TemplateVariableMap;
  templateVariables?: TemplateVariable[];
  options?: MergeTemplateVariablesOptions;
}): {
  subject: string;
  body: string;
  htmlBody: string;
} {
  const {
    subject,
    body,
    htmlBody,
    variables,
    templateVariables,
    options,
  } = params;

  return {
    subject: mergeTemplateVariables(
      subject ?? "",
      variables,
      templateVariables,
      options,
    ),
    body: mergeTemplateVariables(
      body ?? "",
      variables,
      templateVariables,
      options,
    ),
    htmlBody: mergeTemplateVariables(
      htmlBody ?? "",
      variables,
      templateVariables,
      options,
    ),
  };
}