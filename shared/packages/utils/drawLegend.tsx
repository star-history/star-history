import { AxisScale } from "d3-axis"
import { D3Selection, LegendPosition } from "../types"
import uniq from "lodash/uniq"

interface LegendDataset {
    data: { x: Date | number; y: number }[]
}

interface DrawLegendConfig {
    items: {
        color: string
        text: string
        logo: string
    }[]
    strokeColor: string
    backgroundColor: string
    legendPosition: LegendPosition
    chartWidth: number
    chartHeight: number
    datasets?: LegendDataset[]
    xScale?: AxisScale<number | Date>
    yScale?: AxisScale<number>
}

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right"

const CORNER_PREFERENCE: Corner[] = ["top-left", "top-right", "bottom-right", "bottom-left"]

const cornerRect = (corner: Corner, chartWidth: number, chartHeight: number, w: number, h: number) => {
    // Margins match the original top-left (8/5) and bottom-right (8/15) offsets.
    switch (corner) {
        case "top-left":
            return { x: 8, y: 5 }
        case "top-right":
            return { x: chartWidth - w - 8, y: 5 }
        case "bottom-left":
            return { x: 8, y: chartHeight - h - 15 }
        case "bottom-right":
            return { x: chartWidth - w - 8, y: chartHeight - h - 15 }
    }
}

const pickAutoCorner = (
    chartWidth: number,
    chartHeight: number,
    w: number,
    h: number,
    datasets: LegendDataset[],
    xScale: AxisScale<number | Date>,
    yScale: AxisScale<number>
): Corner => {
    const points: { x: number; y: number }[] = []
    datasets.forEach((ds) => {
        ds.data.forEach((d) => {
            const px = xScale(d.x as number | Date) as number
            const py = yScale(d.y) as number
            if (Number.isFinite(px) && Number.isFinite(py)) {
                points.push({ x: px, y: py })
            }
        })
    })

    let bestCorner: Corner = "top-left"
    let bestScore = Infinity
    for (const corner of CORNER_PREFERENCE) {
        const { x, y } = cornerRect(corner, chartWidth, chartHeight, w, h)
        let score = 0
        for (const p of points) {
            if (p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h) score++
        }
        if (score < bestScore) {
            bestScore = score
            bestCorner = corner
            if (score === 0) break // perfect corner — preference order wins ties
        }
    }
    return bestCorner
}

const drawLegend = (selection: D3Selection, config: DrawLegendConfig) => {
    const { items, strokeColor, backgroundColor, legendPosition, chartWidth, chartHeight, datasets, xScale, yScale } = config
    const legendXPadding = 7
    const legendYPadding = 6
    const xkcdCharWidth = 7
    const xkcdCharHeight = 20
    const colorBlockWidth = 8
    const logoSize = 14

    const legend = selection.append("svg")
    const backgroundLayer = legend.append("svg")
    const textLayer = legend.append("svg")
    let maxTextLength = 0
    // If repos have more than one unique owner, draw logo before legend.
    const shouldDrawLogo = uniq(items.map((i) => i.text.split("/")[0])).length > 1

    // Calculate background dimensions first
    items.forEach((item) => {
        maxTextLength = Math.max(item.text.length, maxTextLength)
    })

    let bboxWidth = maxTextLength * (xkcdCharWidth + 0.5) + colorBlockWidth + legendXPadding
    const backgroundWidth = Math.max(bboxWidth + legendXPadding * 2, maxTextLength * xkcdCharWidth + colorBlockWidth + legendXPadding * 2 + 6 + (shouldDrawLogo ? legendXPadding + logoSize : 0))
    const backgroundHeight = items.length * xkcdCharHeight + legendYPadding * 2

    // Resolve final corner. "auto" scores all four; explicit values pass through.
    let resolved: Corner
    if (legendPosition === "auto") {
        if (datasets && xScale && yScale) {
            resolved = pickAutoCorner(chartWidth, chartHeight, backgroundWidth, backgroundHeight, datasets, xScale, yScale)
        } else {
            resolved = "top-left"
        }
    } else {
        resolved = legendPosition
    }

    const { x: legendX, y: legendY } = cornerRect(resolved, chartWidth, chartHeight, backgroundWidth, backgroundHeight)

    items.forEach((item, i) => {
        // draw color dot
        textLayer
            .append("rect")
            .style("fill", item.color)
            .attr("width", colorBlockWidth)
            .attr("height", colorBlockWidth)
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("filter", "url(#xkcdify)")
            .attr("x", legendX + legendXPadding)
            .attr("y", legendY + 12 + xkcdCharHeight * i)
        if (shouldDrawLogo) {
            textLayer
                .append("defs")
                .append("clipPath")
                .attr("id", `clip-circle-title-${item.text}`)
                .append("circle")
                .attr("r", logoSize / 2)
                .attr("cx", legendX + legendXPadding + colorBlockWidth + legendXPadding + logoSize / 2)
                .attr("cy", legendY + 12 + xkcdCharHeight * i - 4 + logoSize / 2)
            textLayer
                .append("image")
                .attr("x", legendX + legendXPadding + colorBlockWidth + legendXPadding)
                .attr("y", legendY + 12 + xkcdCharHeight * i - 4)
                .attr("height", logoSize)
                .attr("width", logoSize)
                .attr("href", item.logo)
                .attr("clip-path", `url(#clip-circle-title-${item.text})`)
        }
        // draw text
        textLayer
            .append("text")
            .style("font-size", "15px")
            .style("fill", strokeColor)
            .attr("x", legendX + legendXPadding + colorBlockWidth + (shouldDrawLogo ? legendXPadding + logoSize : 0) + 6)
            .attr("y", legendY + 12 + xkcdCharHeight * i + 8)
            .text(item.text)
    })

    // Update bboxWidth with actual width if possible
    if (textLayer.node()?.getBBox) {
        bboxWidth = textLayer.node()?.getBBox().width as number
    }

    // add background
    backgroundLayer
        .append("rect")
        .style("fill", backgroundColor)
        .attr("fill-opacity", 0.85)
        .attr("stroke", strokeColor)
        .attr("stroke-width", 2)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("filter", "url(#xkcdify)")
        .attr("width", backgroundWidth)
        .attr("height", backgroundHeight)
        .attr("x", legendX)
        .attr("y", legendY)
}

export default drawLegend
