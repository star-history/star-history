import { axisBottom, axisLeft, AxisScale } from "d3-axis"
import dayjs from "dayjs"
import { D3Selection } from "../types"
import getFormatNumber, { getNumberFormatUnit, NumberUnitType } from "./getFormatNumber"
import getFormatTimeline, { DurationUnitType, getTimestampFormatUnit } from "./getFormatTimeline"

interface DrawXAxisConfig {
    xScale: AxisScale<number | Date>
    tickCount: number
    moveDown: number
    fontFamily: string
    stroke: string
    type: "Date" | "Number"
    dateFormat?: string
}

export const drawXAxis = (selection: D3Selection, { xScale, tickCount, moveDown, fontFamily, stroke, type, dateFormat }: DrawXAxisConfig) => {
    const xAxisGenerator = axisBottom(xScale).tickSize(0).tickPadding(6).ticks(tickCount)

    if (type === "Date" && dateFormat) {
        xAxisGenerator.tickFormat((d) => dayjs(d as any).format(dateFormat))
    }

    if (type === "Number") {
        let index = 1
        let type: DurationUnitType | undefined = undefined
        xAxisGenerator.tickFormat((d) => {
            const timestamp = Number(d)
            const tickAmount = selection.selectAll(".xaxis > .tick").nodes().length
            index++
            if (timestamp === 0 || (tickAmount >= 7 && index % 2 === 0)) {
                return " "
            }
            if (!type) {
                type = getTimestampFormatUnit(timestamp)
            }

            return getFormatTimeline(timestamp, type)
        })
    }

    selection.append("g").attr("class", "xaxis").attr("transform", `translate(0,${moveDown})`).call(xAxisGenerator)

    selection.selectAll(".domain").attr("filter", "url(#xkcdify)").style("stroke", stroke)

    selection.selectAll(".xaxis > .tick > text").style("font-family", fontFamily).style("font-size", "16px").style("fill", stroke)
}

interface DrawYAxisConfig {
    yScale: AxisScale<number>
    tickCount: number
    fontFamily: string
    stroke: string
    useLogScale?: boolean
}

export const drawYAxis = (selection: D3Selection, { yScale, tickCount, fontFamily, stroke, useLogScale }: DrawYAxisConfig) => {
    let type: NumberUnitType | undefined = undefined
    const yAxisGenerator = axisLeft(yScale)
        .tickSize(1)
        .tickPadding(6)

    if (useLogScale) {
        // Smart logarithmic tick generation based on data range
        const domain = yScale.domain()
        const maxValue = Math.max(...domain)
        
        const logTicks: number[] = [0] // Always start with 0
        
        // Determine appropriate starting power based on range
        let startPower = 0
        if (maxValue >= 10000) {
            startPower = 2 // Start from 100 for very large ranges
        } else if (maxValue >= 100) {
            startPower = 1 // Start from 10 for medium ranges
        } else if (maxValue >= 10) {
            startPower = 1 // Start from 10 for small-medium ranges
        } else {
            // For very small ranges (< 10), use linear-like ticks
            if (maxValue <= 5) {
                logTicks.push(Math.ceil(maxValue))
            } else {
                logTicks.push(5, Math.ceil(maxValue))
            }
            
            yAxisGenerator
                .tickValues(logTicks)
                .tickFormat((d) => {
                    if (d === 0) {
                        return "0"
                    }
                    return d.toString()
                })
            
            return
        }
        
        // Generate powers of 10 with smart spacing
        let power = startPower
        let tickCount = 1 // Already have 0
        const maxTicks = 6 // Limit total ticks for readability
        
        while (Math.pow(10, power) <= maxValue && tickCount < maxTicks) {
            const tick = Math.pow(10, power)
            logTicks.push(tick)
            tickCount++
            power++
        }
        
        // If we haven't reached maxValue and have room for one more tick, add it
        if (tickCount < maxTicks && maxValue > logTicks[logTicks.length - 1]) {
            const lastTick = logTicks[logTicks.length - 1]
            // Add a tick that's closer to maxValue but still meaningful
            if (maxValue > lastTick * 2) {
                logTicks.push(Math.pow(10, Math.ceil(Math.log10(maxValue))))
            }
        }
        
        yAxisGenerator
            .tickValues(logTicks)
            .tickFormat((d) => {
                if (d === 0) {
                    return "0"
                }
                if (!type) {
                    type = getNumberFormatUnit(d)
                }
                return getFormatNumber(d, type)
            })
    } else {
        yAxisGenerator
            .ticks(tickCount, "s")
            .tickFormat((d) => {
                if (d === 0) {
                    return " "
                }
                if (!type) {
                    type = getNumberFormatUnit(d)
                }
                return getFormatNumber(d, type)
            })
    }

    selection.append("g").attr("class", "yaxis").call(yAxisGenerator)

    selection.selectAll(".domain").attr("filter", "url(#xkcdify)").style("stroke", stroke)

    selection.selectAll(".yaxis > .tick > text").style("font-family", fontFamily).style("font-size", "16px").style("fill", stroke)
}
