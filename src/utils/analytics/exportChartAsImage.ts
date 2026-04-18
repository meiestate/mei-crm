// src/utils/analytics/exportChartAsImage.ts

export type ExportChartFormat = 'png' | 'jpeg' | 'svg';

export interface ExportChartAsImageOptions {
  fileName?: string;
  format?: ExportChartFormat;
  backgroundColor?: string;
  quality?: number; // jpeg மட்டும்
  pixelRatio?: number;
  width?: number;
  height?: number;
}

export interface ExportChartAsImageResult {
  success: boolean;
  fileName: string;
  format: ExportChartFormat;
  error?: string;
}

const DEFAULT_FILE_NAME = 'chart-export';
const DEFAULT_BACKGROUND = '#ffffff';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

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

const getFileExtension = (format: ExportChartFormat): string => {
  switch (format) {
    case 'jpeg':
      return 'jpg';
    case 'svg':
      return 'svg';
    case 'png':
    default:
      return 'png';
  }
};

const clampQuality = (quality?: number): number => {
  if (typeof quality !== 'number' || Number.isNaN(quality)) {
    return 0.92;
  }

  if (quality < 0) return 0;
  if (quality > 1) return 1;

  return quality;
};

const triggerDownload = (blob: Blob, fileName: string): void => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
};

const getContainerSize = (
  target: HTMLElement,
  width?: number,
  height?: number,
): { width: number; height: number } => {
  const rect = target.getBoundingClientRect();

  return {
    width: Math.max(1, Math.round(width ?? rect.width ?? target.offsetWidth ?? 1)),
    height: Math.max(1, Math.round(height ?? rect.height ?? target.offsetHeight ?? 1)),
  };
};

const getSvgElement = (target: HTMLElement): SVGSVGElement | null => {
  if (target instanceof SVGSVGElement) {
    return target;
  }

  return target.querySelector('svg');
};

const inlineSvgDimensions = (
  svg: SVGSVGElement,
  width: number,
  height: number,
): SVGSVGElement => {
  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;

  clonedSvg.setAttribute('width', String(width));
  clonedSvg.setAttribute('height', String(height));

  if (!clonedSvg.getAttribute('viewBox')) {
    clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  return clonedSvg;
};

const serializeSvg = (
  svg: SVGSVGElement,
  width: number,
  height: number,
  backgroundColor: string,
): string => {
  const preparedSvg = inlineSvgDimensions(svg, width, height);

  const serializer = new XMLSerializer();
  const svgContent = serializer.serializeToString(preparedSvg);

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
    >
      <rect width="100%" height="100%" fill="${backgroundColor}" />
      <foreignObject width="0" height="0"></foreignObject>
      <g>
        ${svgContent.replace(/<\?xml.*?\?>/g, '')}
      </g>
    </svg>
  `.trim();
};

const createSvgBlob = (svgMarkup: string): Blob => {
  return new Blob([svgMarkup], {
    type: 'image/svg+xml;charset=utf-8',
  });
};

const loadImageFromBlob = (blob: Blob): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const blobUrl = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(blobUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error('Failed to load chart image from SVG blob.'));
    };

    image.src = blobUrl;
  });

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  format: ExportChartFormat,
  quality?: number,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const mimeType =
      format === 'jpeg'
        ? 'image/jpeg'
        : format === 'png'
          ? 'image/png'
          : 'image/svg+xml';

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas export returned an empty blob.'));
          return;
        }

        resolve(blob);
      },
      mimeType,
      format === 'jpeg' ? clampQuality(quality) : undefined,
    );
  });

const exportSvgChart = async (
  target: HTMLElement,
  options: Required<
    Pick<ExportChartAsImageOptions, 'backgroundColor' | 'format' | 'fileName'>
  > &
    Pick<ExportChartAsImageOptions, 'quality' | 'pixelRatio' | 'width' | 'height'>,
): Promise<ExportChartAsImageResult> => {
  const { backgroundColor, fileName, format, quality, pixelRatio, width, height } = options;

  const svg = getSvgElement(target);

  if (!svg) {
    return {
      success: false,
      fileName,
      format,
      error: 'No SVG element found inside the chart container.',
    };
  }

  const size = getContainerSize(target, width, height);
  const svgMarkup = serializeSvg(svg, size.width, size.height, backgroundColor);

  if (format === 'svg') {
    const svgBlob = createSvgBlob(svgMarkup);
    triggerDownload(svgBlob, fileName);

    return {
      success: true,
      fileName,
      format,
    };
  }

  const scale = typeof pixelRatio === 'number' && pixelRatio > 0 ? pixelRatio : 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(size.width * scale);
  canvas.height = Math.round(size.height * scale);

  const context = canvas.getContext('2d');

  if (!context) {
    return {
      success: false,
      fileName,
      format,
      error: 'Unable to create canvas rendering context.',
    };
  }

  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, size.width, size.height);

  const svgBlob = createSvgBlob(svgMarkup);
  const image = await loadImageFromBlob(svgBlob);

  context.drawImage(image, 0, 0, size.width, size.height);

  const rasterBlob = await canvasToBlob(canvas, format, quality);
  triggerDownload(rasterBlob, fileName);

  return {
    success: true,
    fileName,
    format,
  };
};

/**
 * Exports an SVG-based chart container as PNG / JPEG / SVG.
 * Best suited for Recharts and other SVG chart libraries.
 */
export const exportChartAsImage = async (
  target: HTMLElement | null | undefined,
  options: ExportChartAsImageOptions = {},
): Promise<ExportChartAsImageResult> => {
  const format = options.format ?? 'png';
  const fileBaseName = sanitizeFileName(options.fileName);
  const fileName = `${fileBaseName}.${getFileExtension(format)}`;
  const backgroundColor = options.backgroundColor ?? DEFAULT_BACKGROUND;

  if (!isBrowser) {
    return {
      success: false,
      fileName,
      format,
      error: 'Chart export is only available in browser environments.',
    };
  }

  if (!target) {
    return {
      success: false,
      fileName,
      format,
      error: 'A valid chart element is required for export.',
    };
  }

  try {
    return await exportSvgChart(target, {
      fileName,
      format,
      backgroundColor,
      quality: options.quality,
      pixelRatio: options.pixelRatio,
      width: options.width,
      height: options.height,
    });
  } catch (error) {
    return {
      success: false,
      fileName,
      format,
      error:
        error instanceof Error
          ? error.message
          : 'Unexpected error occurred while exporting chart.',
    };
  }
};

export default exportChartAsImage;