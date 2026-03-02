/**
 * JSDOM lowercases camelCase SVG attribute names and element names.
 * Fix the known ones used by D3 filter generation (addFilter.tsx).
 */
export const fixJsdomSvgCasing = (svgContent: string): string => {
  return svgContent
    // Element names
    .replace(/feturbulence/g, "feTurbulence")
    .replace(/fedisplacementmap/g, "feDisplacementMap")
    // Attributes
    .replace(/filterunits/g, "filterUnits")
    .replace(/basefrequency/g, "baseFrequency")
    .replace(/xchannelselector/g, "xChannelSelector")
    .replace(/ychannelselector/g, "yChannelSelector");
};

export const getChartWidthWithSize = (size: string) => {
  if (size === "mobile") {
    return 600;
  } else if (size === "laptop") {
    return 800;
  } else if (size === "desktop") {
    return 1000;
  } else {
    return 600;
  }
};

export async function getBase64Image(url: string): Promise<string> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) {
    return "";
  }
  const buffer = await res.arrayBuffer();
  const stringifiedBuffer = Buffer.from(buffer).toString("base64");
  const contentType = res.headers.get("content-type");
  return `data:${contentType};base64,${stringifiedBuffer}`;
}
