import { D3Selection } from "../types"
import { xkcdFontUrl } from "./fontData"

const addFont = (selection: D3Selection) => {
    selection.append("defs").append("style").attr("type", "text/css").text(`@font-face {
      font-family: "xkcd";
      src: url(${xkcdFontUrl}) format('woff');
    }`)
}

export default addFont
