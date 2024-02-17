import { D3Selection } from "../types"

const iconBase64 =
    "data:image/png;base64,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"

export const drawWatermark = (selection: D3Selection, chartWidth: number, chartHeight: number) => {
    selection
        .append("text")
        .style("font-size", "16px")
        .style("fill", "#666666")
        .attr("transform", `translate(${chartWidth - 50},${chartHeight + 40})`)
        .attr("text-anchor", "middle")
        .text("star-history.com")

    selection
        .append("image")
        .attr("transform", `translate(${chartWidth - 135},${chartHeight + 24})`)
        .attr("height", 20)
        .attr("width", 20)
        .attr("href", iconBase64)
}
