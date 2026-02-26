import { Selection } from "d3-selection"

export type D3Selection = Selection<SVGSVGElement | SVGGElement, unknown, null, undefined>

export type Position = "down_right" | "down_left" | "up_right" | "up_left"

export type LegendPosition = "top-left" | "bottom-right"

export const colors = ["#dd4528", "#28a3dd", "#f3db52", "#ed84b5", "#4ab74e", "#9179c0", "#8e6d5a", "#f19839", "#949494"]

export const darkColors = ["#ff6b6b", "#48dbfb", "#feca57", "#ff9ff3", "#1dd1a1", "#f368e0", "#ff9f43", "#a4b0be", "#576574"]
