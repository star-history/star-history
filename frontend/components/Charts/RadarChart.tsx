import React, { useEffect, useRef } from "react"
import RadarChartD3 from "../../shared/packages/radar-chart"
import type { RepoAttributes } from "../../helpers/repo-data"

export const ATTRIBUTE_LABELS: { key: keyof RepoAttributes; label: string }[] = [
    { key: "stars", label: "Stars" },
    { key: "new_stars", label: "New Stars" },
    { key: "pushes", label: "Pushes" },
    { key: "contributors", label: "Contributors" },
    { key: "issues_closed", label: "Issues Closed" },
    { key: "forks", label: "Forks" },
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
            <svg ref={svgRef} className="w-full max-w-md h-auto" />
        </div>
    )
}

export default RadarChart
