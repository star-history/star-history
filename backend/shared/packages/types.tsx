import { Selection } from "d3-selection"

export type D3Selection = Selection<SVGSVGElement | SVGGElement, unknown, null, undefined>

export type Position = "down_right" | "down_left" | "up_right" | "up_left"

export type LegendPosition = "top-left" | "bottom-right"
