import React, { useState } from "react"
import Link from "next/link"
import leaderboard from "../helpers/leaderboard.json"
import weeklyRankingData from "../helpers/weekly-ranking.json"

const weeklyRanking = weeklyRankingData as { name: string; new_stars: number; stars_total: number }[]

function formatStars(count: number): string {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
    }
    return String(count)
}

type Tab = "weekly" | "alltime"

const tabs: { key: Tab; label: string }[] = [
    { key: "weekly", label: "Weekly" },
    { key: "alltime", label: "All-time" },
]

const LeftSidebar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(weeklyRanking.length > 0 ? "weekly" : "alltime")

    const items = activeTab === "weekly"
        ? weeklyRanking.map((r) => ({ name: r.name, metric: `+${formatStars(r.new_stars)}`, metricClass: "accent-text" }))
        : leaderboard.map((r) => ({ name: r.name, metric: formatStars(r.stars_total), metricClass: "text-gray-400" }))

    return (
        <div className="sidebar-sticky">
            <div className="pt-4">
                <div className="flex justify-center gap-4 mb-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`text-xs font-medium pb-1 border-b-2 transition-colors ${
                                activeTab === tab.key
                                    ? "text-gray-900 border-gray-900"
                                    : "text-gray-400 border-transparent hover:text-gray-600"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <ol className="space-y-0.5">
                    {items.map((item, i) => {
                        const repoName = item.name.split("/")[1]
                        return (
                            <li key={item.name}>
                                <Link
                                    href={`/${item.name.toLowerCase()}`}
                                    className="flex items-center gap-2 py-1 text-sm group cursor-pointer"
                                >
                                    <span className="text-xs text-gray-400 w-4 shrink-0">
                                        {i + 1}
                                    </span>
                                    <span className="truncate text-gray-700 group-hover:text-blue-600">
                                        {repoName}{item.name === "openclaw/openclaw" && " 🦞"}
                                    </span>
                                    <span className={`ml-auto text-xs shrink-0 ${item.metricClass}`}>
                                        {item.metric}
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ol>
            </div>
        </div>
    )
}

export default LeftSidebar
