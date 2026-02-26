import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import addFilter from "./utils/addFilter"
import addFont from "./utils/addFont"
import ToolTip from "./components/ToolTip"
import { D3Selection, Position } from "./types"

interface RadarChartDataset {
    label: string
    data: number[]
}

export interface RadarChartConfig {
    labels: string[]
    datasets: RadarChartDataset[]
}

// Seeded PRNG so the wobble is deterministic across re-renders.
function createRng(seed: number) {
    let s = seed | 0
    return () => {
        s = (s * 1664525 + 1013904223) | 0
        return (s >>> 0) / 4294967296
    }
}

/**
 * Generate a wobbly SVG path string between a series of points (closed polygon).
 * For each edge we insert intermediate points with small random perpendicular offsets.
 */
function sketchyPolygonPath(
    points: [number, number][],
    jitter: number,
    rng: () => number,
    closed = true
): string {
    if (points.length < 2) return ""

    const segments: string[] = []
    const len = closed ? points.length : points.length - 1

    for (let i = 0; i < len; i++) {
        const [x0, y0] = points[i]
        const [x1, y1] = points[(i + 1) % points.length]

        const dx = x1 - x0
        const dy = y1 - y0
        const dist = Math.sqrt(dx * dx + dy * dy)
        // perpendicular unit vector
        const nx = -dy / (dist || 1)
        const ny = dx / (dist || 1)

        const steps = Math.max(Math.round(dist / 8), 3)

        for (let s = 0; s <= steps; s++) {
            const t = s / steps
            const px = x0 + dx * t
            const py = y0 + dy * t
            // wobble is strongest in the middle of each segment
            const wobbleScale = Math.sin(t * Math.PI)
            const offset = (rng() - 0.5) * 2 * jitter * wobbleScale
            const fx = px + nx * offset
            const fy = py + ny * offset

            if (i === 0 && s === 0) {
                segments.push(`M ${fx},${fy}`)
            } else {
                segments.push(`L ${fx},${fy}`)
            }
        }
    }

    if (closed) segments.push("Z")
    return segments.join(" ")
}

const RadarChart = (
    svg: SVGSVGElement,
    config: RadarChartConfig
) => {
    const { labels, datasets } = config
    const numAxes = labels.length
    const fontFamily = "xkcd"

    const clientWidth = Number(svg.clientWidth || svg.getAttribute("width") || "") || 500
    const size = Math.min(clientWidth, 500)
    const margin = 60
    const radius = (size - margin * 2) / 2
    const cx = size / 2
    const cy = size / 2

    const rng = createRng(42)

    const d3Selection = select(svg)
        .style("stroke-width", 3)
        .style("font-family", fontFamily)
        .style("background", "transparent")
        .attr("width", size)
        .attr("height", size)
        .attr("viewBox", `0 0 ${size} ${size}`)
        .attr("preserveAspectRatio", "xMidYMid meet") as D3Selection

    d3Selection.selectAll("*").remove()

    addFont(d3Selection)
    addFilter(d3Selection)

    const chart = d3Selection.append("g")
        .attr("transform", `translate(${cx},${cy})`)

    const angleSlice = (Math.PI * 2) / numAxes

    const rScale = scaleLinear()
        .domain([0, 99])
        .range([0, radius])

    // Helper: get polygon vertices at a given radius
    const polygonPoints = (r: number): [number, number][] =>
        Array.from({ length: numAxes }, (_, i) => {
            const angle = angleSlice * i - Math.PI / 2
            return [Math.cos(angle) * r, Math.sin(angle) * r] as [number, number]
        })

    // Draw concentric level polygons (dashed, sketchy)
    const levels = [20, 40, 60, 80]
    levels.forEach((level) => {
        const pts = polygonPoints(rScale(level))
        chart.append("path")
            .attr("d", sketchyPolygonPath(pts, 1.5, rng))
            .attr("fill", "none")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "6,4")
    })

    // Draw outer ring (sketchy polygon)
    const outerPts = polygonPoints(radius)
    chart.append("path")
        .attr("d", sketchyPolygonPath(outerPts, 2, rng))
        .attr("fill", "none")
        .attr("stroke", "#999")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "8,5")

    // Draw axis lines from center to edge (sketchy)
    labels.forEach((_, i) => {
        const angle = angleSlice * i - Math.PI / 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        chart.append("path")
            .attr("d", sketchyPolygonPath([[0, 0], [x, y]], 1.5, rng, false))
            .attr("fill", "none")
            .attr("stroke", "#bbb")
            .attr("stroke-width", 1)
    })

    // Create shared tooltip (same pattern as xy-chart)
    const tooltip = new ToolTip({
        selection: d3Selection,
        title: "",
        items: [],
        position: { x: 60, y: 60, type: "up_left" },
        strokeColor: "black",
        backgroundColor: "white",
    })

    // Draw data polygons (sketchy, thick)
    const colors = ["#28a3dd", "#dd4528", "#4ab74e"]

    datasets.forEach((dataset, di) => {
        const color = colors[di % colors.length]

        // Compute polygon vertices for this dataset
        const pts: [number, number][] = dataset.data.map((value, i) => {
            const angle = angleSlice * i - Math.PI / 2
            const r = rScale(value)
            return [Math.cos(angle) * r, Math.sin(angle) * r]
        })

        // Draw filled area with sketchy outline
        chart.append("path")
            .attr("d", sketchyPolygonPath(pts, 3, rng))
            .attr("fill", color)
            .attr("fill-opacity", 0.15)
            .attr("stroke", color)
            .attr("stroke-width", 3.5)
            .attr("stroke-linejoin", "round")

        // Draw dots at each vertex with hover tooltip
        pts.forEach(([x, y], i) => {
            const value = dataset.data[i]
            const label = labels[i]

            const dot = chart.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 5)
                .attr("fill", color)
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                .style("cursor", "pointer")
                .attr("pointer-events", "all")

            dot.on("mouseover", function () {
                select(this).attr("r", 8)

                // Position tooltip in SVG coordinates (dot is relative to chart center)
                const tipX = x + cx + 5
                const tipY = y + cy + 5

                // Pick quadrant so tooltip doesn't overflow
                let posType: Position = "down_right"
                if (x > 0 && y < 0) posType = "down_left"
                else if (x < 0 && y > 0) posType = "up_right"
                else if (x > 0 && y > 0) posType = "up_left"

                tooltip.update({
                    title: label,
                    items: [{
                        color,
                        text: `${label}: ${value}`,
                    }],
                    position: { x: tipX, y: tipY, type: posType },
                    selection: d3Selection,
                    backgroundColor: "white",
                    strokeColor: "black",
                })
                tooltip.show()
            })

            dot.on("mouseout", function () {
                select(this).attr("r", 5)
                tooltip.hide()
            })
        })

    })

    // Draw level number labels along top axis (on top of data)
    levels.forEach((level) => {
        const r = rScale(level)
        chart.append("text")
            .attr("x", 4)
            .attr("y", -r - 2)
            .attr("font-size", "9px")
            .attr("fill", "#999")
            .attr("stroke", "none")
            .text(level)
    })

    // Draw axis labels last so they sit above everything
    labels.forEach((label, i) => {
        const angle = angleSlice * i - Math.PI / 2
        const labelRadius = radius + 24
        const x = Math.cos(angle) * labelRadius
        const y = Math.sin(angle) * labelRadius

        chart.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-size", "16px")
            .attr("fill", "#555")
            .attr("stroke", "none")
            .text(label)
    })
}

export default RadarChart
