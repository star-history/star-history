/**
 * In nodejs, the filter element from d3 will auto-transfrom its attributes to lower case with unfound reason.
 * So we have to replace it with camel case string.
 */
export const replaceSVGContentFilterWithCamelcase = (
  svgContent: string
): string => {
  return svgContent.replace(
    /<filter (.*?)>(.*?)<\/filter>/g,
    `<filter xmlns="http://www.w3.org/2000/svg" id="xkcdify" filterUnits="userSpaceOnUse" x="-5" y="-5" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.05" result="noise"/><feDisplacementMap scale="5" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="noise"/></filter>`
  );
};
