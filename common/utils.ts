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

  export function getDateString(
    t: Date | number | string,
    format = "yyyy/MM/dd"
  ): string {
    const d = new Date(getTimeStampByDate(t));

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();

    const formatedString = format
      .replace("yyyy", String(year))
      .replace("MM", String(month))
      .replace("dd", String(date));

    return formatedString;
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
    const encodedData = window.btoa(xml);
    return `data:image/svg+xml;base64,${encodedData}`;
  }

  export function waitImageLoaded(image: HTMLImageElement): Promise<void> {
    image.loading = "eager";

    return new Promise((resolve, reject) => {
      image.onload = () => {
        // NOTE: There is image loading problem in Safari, fix it with some trick
        setTimeout(() => {
          resolve();
        }, 200);
      };
      image.onerror = () => {
        reject("Image load failed");
      };
    });
  }

  export function calcBytes(d: any): number {
    let bytes = 0;

    if (typeof d === "number") {
      bytes += 8;
    } else if (typeof d === "string") {
      bytes += d.length * 2;
    } else if (typeof d === "boolean") {
      bytes += 1;
    } else if (typeof d === "object") {
      if (Array.isArray(d)) {
        for (const i of d) {
          bytes += calcBytes(i);
        }
      } else {
        for (const k in d) {
          bytes += calcBytes(d[k]);
        }
      }
    }

    return bytes;
  }
}

export default utils;
