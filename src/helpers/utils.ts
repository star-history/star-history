namespace utils {
  export function range(from: number, to: number): number[] {
    const r: number[] = [];
    for (let i = from; i <= to; i++) {
      r.push(i);
    }
    return r;
  }

  export function getTimeStampByDate(t: Date | number | string): number {
    const d = new Date(t);

    return d.getTime();
  }

  export function getDateString(t: Date | number | string): string {
    const d = new Date(getTimeStampByDate(t));

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();

    return `${year}/${month}/${date}`;
  }

  export async function copyTextToClipboard(text: string) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (error: unknown) {
        console.warn("Copy to clipboard failed.", error);
      }
    } else {
      console.warn("Copy to clipboard failed, methods not supports.");
    }
  }

  export function convertSVGToDataURL(svgElement: SVGSVGElement) {
    const xml = new XMLSerializer().serializeToString(svgElement);
    const url = encodeURIComponent(xml);
    return `data:image/svg+xml;charset=utf-8,${url}`;
  }

  export function waitImageLoaded(image: HTMLImageElement): Promise<void> {
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve();
      };
      image.onerror = () => {
        reject("Image load failed");
      };
    });
  }
}

export default utils;
