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
    format = "yyyy/MM/dd hh:mm:ss"
  ): string {
    const d = new Date(getTimeStampByDate(t));

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();

    const formatedString = format
      .replace("yyyy", String(year))
      .replace("MM", String(month))
      .replace("dd", String(date))
      .replace("hh", String(hours))
      .replace("mm", String(minutes))
      .replace("ss", String(seconds));

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

  export function calcReadingTime(content: string): string {
    const wordsPerMinute = 200;
    const wordAmount = content.split(" ").length;
    if (wordAmount <= 200) {
      return "less than 1 min read";
    }

    const count = Math.ceil(wordAmount / wordsPerMinute);
    return `${count} min read`;
  }

  export function getBase64Image(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject("Get canvas context failed.");
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };

      img.onerror = function () {
        reject("The image could not be loaded.");
      };
    });
  }
}

export default utils;
