import React, { useEffect, useRef } from "react"
import RadarChartD3 from "@shared/packages/radar-chart"
import type { RepoAttributes } from "@shared/types/gh"

export const ATTRIBUTE_LABELS: { key: keyof RepoAttributes; label: string }[] = [
    { key: "stars", label: "Stars" },
    { key: "new_stars", label: "New Stars" },
    { key: "forks", label: "Forks" },
    { key: "contributors", label: "Contributors" },
    { key: "pushes", label: "Pushes" },
    { key: "issues_closed", label: "Issues Closed" },
]

interface Props {
    attributes: RepoAttributes
}

const RadarChart: React.FC<Props> = ({ attributes }) => {
    const svgRef = useRef<SVGSVGElement | null>(null)

    useEffect(() => {
        if (!svgRef.current) return

        RadarChartD3(svgRef.current, {
            labels: ATTRIBUTE_LABELS.map((a) => a.label),
            datasets: [{
                label: "Repo",
                data: ATTRIBUTE_LABELS.map((a) => attributes[a.key]),
            }],
        })
    }, [attributes])

    return (
        <div className="flex justify-center items-center w-full">
            <svg ref={svgRef} className="w-full h-auto" />
        </div>
    )
}

export default RadarChart
