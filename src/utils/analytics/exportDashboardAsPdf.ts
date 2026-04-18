// src/utils/analytics/exportDashboardAsPdf.ts

export interface ExportDashboardAsPdfOptions {
  /**
   * PDF document title shown in print window.
   * Default: "Dashboard Report"
   */
  title?: string;

  /**
   * File name hint for browser print/save dialog.
   * Default: "dashboard-report"
   */
  fileName?: string;

  /**
   * Page orientation.
   * Default: "landscape"
   */
  orientation?: 'portrait' | 'landscape';

  /**
   * Page size.
   * Default: "A4"
   */
  pageSize?: 'A4' | 'Letter';

  /**
   * Extra styles injected into print document.
   */
  customStyles?: string;

  /**
   * When true, opens browser print dialog automatically.
   * Default: true
   */
  autoPrint?: boolean;

  /**
   * Optional header HTML shown above dashboard.
   */
  headerHtml?: string;

  /**
   * Optional footer HTML shown below dashboard.
   */
  footerHtml?: string;

  /**
   * When true, copies current page stylesheets into print window.
   * Default: true
   */
  copyPageStyles?: boolean;

  /**
   * Optional delay before print.
   * Useful for charts/fonts/images rendering.
   * Default: 600
   */
  printDelayMs?: number;
}

export interface ExportDashboardAsPdfResult {
  success: boolean;
  title: string;
  fileName: string;
  error?: string;
}

const DEFAULT_TITLE = 'Dashboard Report';
const DEFAULT_FILE_NAME = 'dashboard-report';

const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

const sanitizeFileName = (value?: string): string => {
  const raw = (value ?? DEFAULT_FILE_NAME).trim();

  if (!raw) {
    return DEFAULT_FILE_NAME;
  }

  return raw
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/\.+$/, '')
    .toLowerCase();
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const collectPageStyles = (): string => {
  const styleTags = Array.from(document.querySelectorAll('style'))
    .map((style) => style.outerHTML)
    .join('\n');

  const linkTags = Array.from(
    document.querySelectorAll('link[rel="stylesheet"]'),
  )
    .map((link) => link.outerHTML)
    .join('\n');

  return `${linkTags}\n${styleTags}`;
};

const getPrintStyles = (
  orientation: 'portrait' | 'landscape',
  pageSize: 'A4' | 'Letter',
  customStyles?: string,
): string => `
  @page {
    size: ${pageSize} ${orientation};
    margin: 12mm;
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #111827;
    font-family: Inter, Arial, Helvetica, sans-serif;
  }

  body {
    padding: 0;
  }

  .pdf-root {
    width: 100%;
    background: #ffffff;
  }

  .pdf-header,
  .pdf-footer {
    width: 100%;
  }

  .pdf-header {
    margin-bottom: 16px;
  }

  .pdf-footer {
    margin-top: 16px;
  }

  .pdf-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e5e7eb;
  }

  .pdf-title {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
    color: #111827;
  }

  .pdf-date {
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
  }

  .pdf-dashboard {
    width: 100%;
  }

  .pdf-dashboard * {
    max-width: 100%;
  }

  .avoid-break,
  .card,
  .chart-card,
  .kpi-card,
  .section,
  .widget {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  img, svg, canvas {
    max-width: 100% !important;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    display: table-header-group;
  }

  tr, td, th {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .no-print {
    display: none !important;
  }

  ${customStyles ?? ''}
`;

const cloneDashboardNode = (target: HTMLElement): HTMLElement => {
  const clone = target.cloneNode(true) as HTMLElement;

  clone.querySelectorAll('input, textarea, select').forEach((element) => {
    const tagName = element.tagName.toLowerCase();

    if (tagName === 'input') {
      const input = element as HTMLInputElement;
      input.setAttribute('value', input.value);
      if (input.checked) {
        input.setAttribute('checked', 'true');
      } else {
        input.removeAttribute('checked');
      }
    }

    if (tagName === 'textarea') {
      const textarea = element as HTMLTextAreaElement;
      textarea.textContent = textarea.value;
    }

    if (tagName === 'select') {
      const select = element as HTMLSelectElement;
      Array.from(select.options).forEach((option, index) => {
        if (index === select.selectedIndex) {
          option.setAttribute('selected', 'selected');
        } else {
          option.removeAttribute('selected');
        }
      });
    }
  });

  return clone;
};

const waitForImages = async (doc: Document): Promise<void> => {
  const images = Array.from(doc.images);

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          image.onload = () => resolve();
          image.onerror = () => resolve();
        }),
    ),
  );
};

const buildPrintHtml = ({
  title,
  dashboardHtml,
  headerHtml,
  footerHtml,
  styles,
}: {
  title: string;
  dashboardHtml: string;
  headerHtml?: string;
  footerHtml?: string;
  styles: string;
}): string => {
  const now = new Date();
  const printedAt = now.toLocaleString();

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)}</title>
        ${styles}
      </head>
      <body>
        <div class="pdf-root">
          ${
            headerHtml
              ? `<div class="pdf-header">${headerHtml}</div>`
              : `
                <div class="pdf-meta">
                  <div class="pdf-title">${escapeHtml(title)}</div>
                  <div class="pdf-date">Generated: ${escapeHtml(printedAt)}</div>
                </div>
              `
          }

          <div class="pdf-dashboard">
            ${dashboardHtml}
          </div>

          ${
            footerHtml
              ? `<div class="pdf-footer">${footerHtml}</div>`
              : ''
          }
        </div>
      </body>
    </html>
  `;
};

/**
 * Opens a clean printable window for the given dashboard/container element
 * and triggers browser PDF save flow.
 */
export const exportDashboardAsPdf = async (
  target: HTMLElement | null | undefined,
  options: ExportDashboardAsPdfOptions = {},
): Promise<ExportDashboardAsPdfResult> => {
  const title = (options.title ?? DEFAULT_TITLE).trim() || DEFAULT_TITLE;
  const fileName = sanitizeFileName(options.fileName);
  const orientation = options.orientation ?? 'landscape';
  const pageSize = options.pageSize ?? 'A4';
  const autoPrint = options.autoPrint ?? true;
  const copyPageStyles = options.copyPageStyles ?? true;
  const printDelayMs = options.printDelayMs ?? 600;

  if (!isBrowser) {
    return {
      success: false,
      title,
      fileName,
      error: 'PDF export is only available in browser environments.',
    };
  }

  if (!target) {
    return {
      success: false,
      title,
      fileName,
      error: 'A valid dashboard element is required for PDF export.',
    };
  }

  try {
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');

    if (!printWindow) {
      return {
        success: false,
        title,
        fileName,
        error: 'Unable to open print window. Please allow popups and try again.',
      };
    }

    const clonedNode = cloneDashboardNode(target);
    const dashboardHtml = clonedNode.outerHTML;

    const styles = `
      ${copyPageStyles ? collectPageStyles() : ''}
      <style>
        ${getPrintStyles(orientation, pageSize, options.customStyles)}
      </style>
    `;

    const html = buildPrintHtml({
      title,
      dashboardHtml,
      headerHtml: options.headerHtml,
      footerHtml: options.footerHtml,
      styles,
    });

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    await wait(150);
    await waitForImages(printWindow.document);
    await wait(printDelayMs);

    printWindow.document.title = `${fileName}.pdf`;

    if (autoPrint) {
      printWindow.focus();
      printWindow.print();

      window.setTimeout(() => {
        printWindow.close();
      }, 800);
    }

    return {
      success: true,
      title,
      fileName,
    };
  } catch (error) {
    return {
      success: false,
      title,
      fileName,
      error:
        error instanceof Error
          ? error.message
          : 'Unexpected error occurred while exporting dashboard as PDF.',
    };
  }
};

export default exportDashboardAsPdf;