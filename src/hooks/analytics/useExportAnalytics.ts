import { useCallback, useMemo, useState } from 'react';

export type AnalyticsExportFormat = 'csv' | 'xlsx' | 'pdf';

export interface AnalyticsExportFilters {
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  projectIds?: string[];
  sourceIds?: string[];
  ownerIds?: string[];
  teamIds?: string[];
  statuses?: string[];
  locations?: string[];
  tags?: string[];
  search?: string;
  [key: string]: unknown;
}

export interface AnalyticsComparePeriodPayload {
  enabled: boolean;
  type?: 'previous_period' | 'previous_month' | 'previous_quarter' | 'previous_year' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface ExportAnalyticsPayload {
  format: AnalyticsExportFormat;
  sections?: string[];
  filters?: AnalyticsExportFilters;
  comparePeriod?: AnalyticsComparePeriodPayload;
  fileName?: string;
  includeCharts?: boolean;
  includeSummary?: boolean;
  includeRawData?: boolean;
}

export interface UseExportAnalyticsOptions {
  defaultFileName?: string;
  endpoint?: string;
  onSuccess?: (fileName: string) => void;
  onError?: (error: Error) => void;
}

export interface UseExportAnalyticsReturn {
  isExporting: boolean;
  error: string | null;
  lastExportedAt: string | null;
  exportAnalytics: (payload: ExportAnalyticsPayload) => Promise<boolean>;
  resetExportState: () => void;
}

const FILE_EXTENSION_MAP: Record<AnalyticsExportFormat, string> = {
  csv: 'csv',
  xlsx: 'xlsx',
  pdf: 'pdf',
};

const MIME_TYPE_MAP: Record<AnalyticsExportFormat, string> = {
  csv: 'text/csv;charset=utf-8;',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
};

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_');
};

const ensureExtension = (fileName: string, format: AnalyticsExportFormat): string => {
  const extension = FILE_EXTENSION_MAP[format];
  return fileName.toLowerCase().endsWith(`.${extension}`) ? fileName : `${fileName}.${extension}`;
};

const buildDefaultFileName = (baseName: string, format: AnalyticsExportFormat): string => {
  const now = new Date();

  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    '-',
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');

  return ensureExtension(sanitizeFileName(`${baseName}-${stamp}`), format);
};

const getMimeType = (format: AnalyticsExportFormat): string => {
  return MIME_TYPE_MAP[format];
};

const triggerDownload = (blob: Blob, fileName: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};

const extractFileNameFromDisposition = (contentDisposition: string | null): string | null => {
  if (!contentDisposition) {
    return null;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const simpleMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  if (simpleMatch?.[1]) {
    return simpleMatch[1];
  }

  return null;
};

export const useExportAnalytics = (
  options: UseExportAnalyticsOptions = {},
): UseExportAnalyticsReturn => {
  const {
    defaultFileName = 'analytics-export',
    endpoint = '/api/analytics/export',
    onSuccess,
    onError,
  } = options;

  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastExportedAt, setLastExportedAt] = useState<string | null>(null);

  const resetExportState = useCallback(() => {
    setError(null);
  }, []);

  const exportAnalytics = useCallback(
    async (payload: ExportAnalyticsPayload): Promise<boolean> => {
      setIsExporting(true);
      setError(null);

      try {
        const format = payload.format ?? 'csv';

        const requestBody = {
          format,
          sections: payload.sections ?? [],
          filters: payload.filters ?? {},
          comparePeriod: payload.comparePeriod,
          includeCharts: payload.includeCharts ?? true,
          includeSummary: payload.includeSummary ?? true,
          includeRawData: payload.includeRawData ?? false,
          fileName: payload.fileName,
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: getMimeType(format),
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          let message = `Failed to export analytics. Status: ${response.status}`;

          try {
            const errorData = (await response.json()) as { message?: string };
            if (errorData?.message) {
              message = errorData.message;
            }
          } catch {
            // ignore json parse error
          }

          throw new Error(message);
        }

        const blob = await response.blob();

        const headerFileName = extractFileNameFromDisposition(
          response.headers.get('content-disposition'),
        );

        const finalFileName = ensureExtension(
          sanitizeFileName(
            headerFileName ||
              payload.fileName ||
              buildDefaultFileName(defaultFileName, format),
          ),
          format,
        );

        triggerDownload(blob, finalFileName);

        const exportedAt = new Date().toISOString();
        setLastExportedAt(exportedAt);
        onSuccess?.(finalFileName);

        return true;
      } catch (err) {
        const resolvedError =
          err instanceof Error ? err : new Error('Failed to export analytics.');

        setError(resolvedError.message);
        onError?.(resolvedError);

        return false;
      } finally {
        setIsExporting(false);
      }
    },
    [defaultFileName, endpoint, onError, onSuccess],
  );

  return useMemo(
    () => ({
      isExporting,
      error,
      lastExportedAt,
      exportAnalytics,
      resetExportState,
    }),
    [isExporting, error, lastExportedAt, exportAnalytics, resetExportState],
  );
};

export default useExportAnalytics;