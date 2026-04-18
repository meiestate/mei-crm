// src/lib/cn.ts

type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassDictionary
  | ClassArray;

interface ClassDictionary {
  [id: string]: unknown;
}

interface ClassArray extends Array<ClassValue> {}

const toClassName = (value: ClassValue): string[] => {
  if (!value) {
    return [];
  }

  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap(toClassName);
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([className]) => className);
  }

  return [];
};

export const cn = (...inputs: ClassValue[]): string => {
  return inputs.flatMap(toClassName).join(" ").trim();
};

export default cn;