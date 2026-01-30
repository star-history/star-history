import { scaleLinear, scaleTime, scaleLog, scaleSymlog } from "d3-scale"
import { select } from "d3-selection"
import { line, curveMonotoneX } from "d3-shape"
import { AxisScale } from "d3-axis";
import dayjs from "dayjs"
import { uniq } from "lodash"
import ToolTip from "./components/ToolTip"
import { drawXAxis, drawYAxis } from "./utils/drawAxis"
import addFilter from "./utils/addFilter"
import addFont from "./utils/addFont"
import { drawTitle, drawXLabel, drawYLabel } from "./utils/drawLabels"
import drawLegend from "./utils/drawLegend"
import { drawWatermark } from "./utils/drawWatermark"
import getFormatTimeline, { getTimestampFormatUnit } from "./utils/getFormatTimeline"
import { D3Selection, Position, LegendPosition } from "./types"

const colors = ["#dd4528", "#28a3dd", "#f3db52", "#ed84b5", "#4ab74e", "#9179c0", "#8e6d5a", "#f19839", "#949494"]

const darkColors = ["#ff6b6b", "#48dbfb", "#feca57", "#ff9ff3", "#1dd1a1", "#f368e0", "#ff9f43", "#a4b0be", "#576574"]

const margin = {
    top: 50,
    right: 30,
    bottom: 50,
    left: 50
}

interface XYPoint {
    x: Date | number
    y: number
}

export interface XYData {
    label: string
    logo: string
    data: XYPoint[]
}

export interface XYChartData {
    datasets: XYData[]
}

export interface XYChartConfig {
    title: string
    xLabel: string
    yLabel: string
    data: XYChartData
    showDots: boolean
    transparent: boolean
    theme?: "light" | "dark"
}

type XTickLabelType = "Date" | "Number"

export interface XYChartOptions {
    envType: "browser" | "node"
    xTickLabelType: XTickLabelType
    dateFormat?: string

    xTickCount: number
    yTickCount: number
    showLine: boolean
    dotSize: number
    dataColors: string[]
    fontFamily: string
    backgroundColor: string
    strokeColor: string
    chartWidth?: number
    useLogScale?: boolean
    legendPosition?: LegendPosition
}

const getDefaultOptions = (transparent: boolean): XYChartOptions => {
    return {
        envType: "node",
        xTickLabelType: "Date",
        dateFormat: "MMM DD, YYYY",
        xTickCount: 5,
        yTickCount: 5,
        showLine: true,
        dotSize: 0.5,
        dataColors: colors,
        fontFamily: "xkcd",
        backgroundColor: transparent ? "transparent" : "white",
        strokeColor: "black",
        legendPosition: "top-left"
    }
}

const getDarkThemeDefaultOptions = (transparent: boolean): XYChartOptions => {
    return {
        ...getDefaultOptions(transparent),
        dataColors: darkColors,
        backgroundColor: transparent ? "transparent" : "#0d1117",
        strokeColor: "white"
    }
}

const XYChart = (
    svg: SVGSVGElement,
    { title, xLabel, yLabel, data: { datasets }, showDots, theme, transparent }: XYChartConfig,
    initialOptions: Partial<XYChartOptions>
) => {
    const options: XYChartOptions = {
        ...(theme === "dark" ? getDarkThemeDefaultOptions(transparent) : getDefaultOptions(transparent)),
        ...initialOptions
    }

    if (title) {
        margin.top = 60
    }
    if (xLabel) {
        margin.bottom = 50
    }
    if (yLabel) {
        margin.left = 70
    }

    const data = {
        datasets
    }

    const filter = "url(#xkcdify)"
    const fontFamily = options.fontFamily || "xkcd"
    const clientWidth = Number(svg.clientWidth || svg.getAttribute("width") || "") || 600
    const clientHeight = (clientWidth * 2) / 3

    const d3Selection = select(svg)
        .style("stroke-width", 3)
        .style("font-family", fontFamily)
        .style("background", options.backgroundColor)
        .attr("width", clientWidth)
        .attr("height", clientHeight)
        .attr("preserveAspectRatio", "xMidYMid meet") as D3Selection
        
    if (options.envType === "browser") {
        // If in browser, be more responsive.
        d3Selection
            .attr("width", clientWidth <= 600 ? 600 : "100%")
            .attr("viewBox", `0 0 ${clientWidth <= 600 ? 600 : clientWidth} ${clientHeight}`)
    }
    d3Selection.selectAll("*").remove()

    addFont(d3Selection)
    addFilter(d3Selection)

    // Add animation styles for moltbot lobster emoji (browser only, skip for image generation)
    if (options.envType === "browser") {
        d3Selection.append("style").text(`
            @keyframes lobster-swim {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(2px, -3px) rotate(-5deg); }
                50% { transform: translate(0, -5px) rotate(0deg); }
                75% { transform: translate(-2px, -3px) rotate(5deg); }
            }
            .moltbot-emoji {
                animation: lobster-swim 1.5s ease-in-out infinite;
                transform-origin: center;
                transform-box: fill-box;
            }
        `)
    }

    const chart = d3Selection.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    const tooltip = new ToolTip({
        selection: d3Selection,
        title: "",
        items: [],
        position: { x: 60, y: 60, type: "up_left" },
        strokeColor: options.strokeColor,
        backgroundColor: options.backgroundColor
    })

    if (options.xTickLabelType === "Date") {
        data.datasets.forEach((dataset) => {
          dataset.data.forEach((d) => {
            d.x = dayjs(d.x) as any;
          });
        });
    }

    const allData: XYPoint[] = []
    data.datasets.map((d) => allData.push(...d.data))

    const allXData = allData.map((d) => d.x)
    const allYData = allData.map((d) => d.y)

    const chartWidth = clientWidth - margin.left - margin.right
    const chartHeight = clientHeight - margin.top - margin.bottom

    // NOTE: Xaxis with date type(default)
    let xScale: AxisScale<number | Date> = scaleTime()
        .domain([
        Math.min(...allXData.map((d) => Number(d))),
        Math.max(...allXData.map((d) => Number(d))),
        ])
        .range([0, chartWidth]);

    if (options.xTickLabelType === "Number") {
        xScale = scaleLinear()
        .domain([0, Math.max(...allXData.map((d) => Number(d)))])
        .range([0, chartWidth]);
    }

    let yScale: AxisScale<number>
    if (options.useLogScale) {
        // Use scaleSymlog which naturally handles zero and negative values
        // It transitions smoothly between linear (near zero) and logarithmic (far from zero)
        const maxYData = Math.max(...allYData)
        
        yScale = scaleSymlog()
            .domain([0, maxYData]) // Always start from 0 to show true starting point
            .range([chartHeight, 0])
            .constant(10) // Higher constant for smoother log transition
    } else {
        yScale = scaleLinear()
            .domain([0, Math.max(...allYData)]) // Always start from 0 for linear scale
            .range([chartHeight, 0])
    }

    const svgChart = chart.append("g").attr("pointer-events", "all")

    drawWatermark(svgChart, chartWidth, chartHeight);

    if (title) {
        if (uniq(datasets.map((d) => d.label.split("/")[0])).length === 1) {
            drawTitle(d3Selection, title, datasets[0].logo, options.strokeColor, options.chartWidth)
        } else {
            drawTitle(d3Selection, title, "", options.strokeColor, options.chartWidth)
        }
    }
    if (xLabel) {
        drawXLabel(d3Selection, xLabel, options.strokeColor)
    }
    if (yLabel) {
        const maxYData = Math.max(...allYData)
        let offsetY = 24
        if (maxYData > 100000) {
            offsetY = 2
        } else if (maxYData > 10000) {
            offsetY = 8
        } else if (maxYData > 1000) {
            offsetY = 12
        } else if (maxYData > 100) {
            offsetY = 20
        }
        drawYLabel(d3Selection, yLabel, options.strokeColor, offsetY)
    }

    // draw axis
    drawXAxis(svgChart, {
        xScale,
        tickCount: options.xTickCount,
        moveDown: chartHeight,
        fontFamily: fontFamily,
        stroke: options.strokeColor,
        type: options.xTickLabelType
    })
    drawYAxis(svgChart, {
        yScale,
        tickCount: options.yTickCount,
        fontFamily: fontFamily,
        stroke: options.strokeColor,
        useLogScale: options.useLogScale
    })

    // draw lines
    if (options.showLine) {
        const drawLine = line<XYPoint>()
            .x((d) => xScale(d.x) || 0)
            .y((d) => yScale(d.y) || 0)
            .curve(curveMonotoneX)

        svgChart
            .selectAll(".xkcd-chart-xyline")
            .data(data.datasets)
            .enter()
            .append("path")
            .attr("class", "xkcd-chart-xyline")
            .attr("d", (d) => drawLine(d.data))
            .attr("fill", "none")
            .attr("stroke", (_, i) => options.dataColors[i])
            .attr("filter", filter)

        // Add lobster emoji (🦞) at the endpoint of moltbot/moltbot line (always)
        // Elements have "browser-only" class and are removed during image export
        const moltbotDataset = data.datasets.find(d => d.label.toLowerCase() === "moltbot/moltbot")
        if (moltbotDataset && moltbotDataset.data.length > 0) {
            const moltbotLastPoint = moltbotDataset.data[moltbotDataset.data.length - 1]
            const moltbotStars = moltbotLastPoint.y

            // Add lobster emoji to moltbot
            svgChart
                .append("text")
                .attr("class", "moltbot-emoji browser-only")
                .text("🦞")
                .attr("x", xScale(moltbotLastPoint.x) || 0)
                .attr("y", (yScale(moltbotLastPoint.y) || 0) - 10)
                .style("font-size", "20px")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "auto")

            // Add prey emojis to repos with more stars than moltbot (the lobster is coming for them!)
            // Only when comparing multiple repos
            if (data.datasets.length >= 2) {
                const preyEmojis = ["🐟", "🦐", "🦀", "🐚", "🐌", "🪱"]
                const usedEmojis: string[] = []

                data.datasets.forEach((dataset) => {
                    if (dataset.label.toLowerCase() === "moltbot/moltbot") return
                    if (dataset.data.length === 0) return

                    const lastPoint = dataset.data[dataset.data.length - 1]
                    if (lastPoint.y > moltbotStars) {
                        // Pick a random emoji, avoiding duplicates until all are used
                        let availableEmojis = preyEmojis.filter(e => !usedEmojis.includes(e))
                        if (availableEmojis.length === 0) {
                            availableEmojis = [...preyEmojis]
                            usedEmojis.length = 0
                        }
                        const randomIndex = Math.floor(Math.random() * availableEmojis.length)
                        const emoji = availableEmojis[randomIndex]
                        usedEmojis.push(emoji)

                        svgChart
                            .append("text")
                            .attr("class", "prey-emoji browser-only")
                            .text(emoji)
                            .attr("x", xScale(lastPoint.x) || 0)
                            .attr("y", (yScale(lastPoint.y) || 0) - 10)
                            .style("font-size", "20px")
                            .attr("text-anchor", "middle")
                            .attr("dominant-baseline", "auto")
                    }
                })
            }
        }
    }

    if (showDots) {
        // draw dots
        const dotInitSize = 3.5 * (options.dotSize === undefined ? 1 : options.dotSize)
        const dotHoverSize = 6 * (options.dotSize === undefined ? 1 : options.dotSize)
        svgChart
            .selectAll(".xkcd-chart-xycircle-group")
            .data(data.datasets)
            .enter()
            .append("g")
            .attr("class", "xkcd-chart-xycircle-group")
            .attr("filter", filter)
            .attr("xy-group-index", (_, i) => i)
            .selectAll(".xkcd-chart-xycircle-circle")
            .data((dataset) => dataset.data)
            .enter()
            .append("circle")
            .attr("class", "chart-tooltip-dot")
            .style("stroke", (_, i, nodes) => {
                const xyGroupIndex = Number(select(nodes[i].parentElement).attr("xy-group-index"))
                return options.dataColors[xyGroupIndex]
            })
            .style("fill", (_, i, nodes) => {
                const xyGroupIndex = Number(select(nodes[i].parentElement).attr("xy-group-index"))
                return options.dataColors[xyGroupIndex]
            })
            .attr("r", dotInitSize)
            .attr("cx", (d) => xScale(d.x) || 0)
            .attr("cy", (d) => yScale(d.y) || 0)
            .attr("pointer-events", "all")
            .on("mouseover", (event, d) => {
                if (window === undefined) return
                const nodes = event.currentTarget.parentNode.childNodes || []
                const i = [...nodes].indexOf(event.target)
                const xyGroupIndex = Number(select(nodes[i].parentElement).attr("xy-group-index"))
                select(nodes[i]).attr("r", dotHoverSize)

                const tipX = (xScale(d.x) || 0) + margin.left + 5
                const tipY = (yScale(d.y) || 0) + margin.top + 5
                let tooltipPositionType : Position = "down_right"
                if (tipX > chartWidth / 2 && tipY < chartHeight / 2) {
                    tooltipPositionType = "down_left"
                } else if (tipX > chartWidth / 2 && tipY > chartHeight / 2) {
                    tooltipPositionType = "up_left"
                } else if (tipX < chartWidth / 2 && tipY > chartHeight / 2) {
                    tooltipPositionType = "up_right"
                }

                let title = dayjs(data.datasets[xyGroupIndex].data[i].x).format(options.dateFormat)
                if (options.xTickLabelType === "Number") {
                    const type = getTimestampFormatUnit(Number(data.datasets[xyGroupIndex].data[1].x || data.datasets[xyGroupIndex].data[i].x))
                    title = getFormatTimeline(Number(data.datasets[xyGroupIndex].data[i].x), type)
                }

                tooltip.update({
                    title,
                    items: [
                        {
                            color: options.dataColors[xyGroupIndex],
                            text: `${data.datasets[xyGroupIndex].label || ""}: ${d.y}`
                        }
                    ],
                    position: {
                        x: tipX,
                        y: tipY,
                        type: tooltipPositionType,
                    },
                    selection: d3Selection,
                    backgroundColor: options.backgroundColor,
                    strokeColor: options.strokeColor
                })

                tooltip.show()
            })
            .on("mouseout", (event, d) => {
                const nodes = event.currentTarget.parentNode.childNodes || []
                if (!nodes.length) return
                const i = [...nodes].indexOf(event.target)
                select(nodes[i]).attr("r", dotInitSize)
                tooltip.hide()
            })
    }

    // draw legend
    const legendItems = data.datasets.map((dataset, i) => ({
        color: options.dataColors[i] || "",
        text: dataset.label,
        logo: dataset.logo
    }))

    drawLegend(svgChart, {
        items: legendItems,
        strokeColor: options.strokeColor,
        backgroundColor: options.backgroundColor,
        legendPosition: options.legendPosition || "top-left",
        chartWidth,
        chartHeight
    })
}

export default XYChart
