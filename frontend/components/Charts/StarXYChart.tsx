import React, { useEffect, useRef } from "react"
import XYChart, { XYChartData } from "../../shared/packages/xy-chart"
import { MIN_CHART_WIDTH } from "../../helpers/consts"

interface Props {
    classname?: string
    data?: XYChartData
    chartMode?: string
    timeFormat?: string
    id?: string
    zoomLevel?: number
}
const StarXYChart: React.FC<Props> = ({ classname = "", data, chartMode = "Date", zoomLevel = 1 }) => {
    const chartContainerElRef = useRef<HTMLDivElement | null>(null)
    const svgElRef = useRef<SVGSVGElement | null>(null)

    const drawStarChart = React.useCallback(
        (data: XYChartData) => {
            if (svgElRef.current) {
                svgElRef.current.innerHTML = ""

                XYChart(
                    svgElRef.current,
                    {
                        title: "Star History",
                        xLabel: chartMode === "Timeline" ? "Timeline" : "Date",
                        yLabel: "GitHub Stars",
                        data: {
                            datasets: data.datasets
                        },
                        showDots: true,
                        transparent: false
                    },
                    {
                        xTickLabelType: chartMode === "Date" ? "Date" : "Number",
                        envType: "browser"
                    }
                )
            }
        },
        [chartMode]
    )

    useEffect(() => {
        if (data) {
            drawStarChart(data)
        }

        // Scale chart to a suitable mobile view and apply zoom
        if (chartContainerElRef.current) {
            let scaleRate = 1
            
            // Apply mobile scaling
            if (window.innerWidth < MIN_CHART_WIDTH) {
                scaleRate = window.innerWidth / MIN_CHART_WIDTH
            }
            
            // Apply zoom level
            const totalScale = scaleRate * zoomLevel
            
            chartContainerElRef.current.style.marginTop = "8px"
            chartContainerElRef.current.style.transform = `scale(${totalScale})`

            if (chartContainerElRef.current.parentElement) {
                chartContainerElRef.current.parentElement.style.minHeight = "0"
                chartContainerElRef.current.parentElement.style.height = `${chartContainerElRef.current.clientHeight * totalScale + 16}px`
            }
        }
    }, [data, drawStarChart, zoomLevel])

    const handleSVGElementClick = () => {
        // Maybe we can capture the clicked svg element to expand chart functions.
    }

    return (
        <div ref={chartContainerElRef} className={`w-full h-auto origin-top-left min-w-600px flex flex-col justify-start items-start overflow-x-auto select-none ${classname}`}>
            <svg ref={svgElRef} className="w-full h-full" onClick={handleSVGElementClick}></svg>
        </div>
    )
}

export default StarXYChart
