import { useState } from "react"
import Link from "next/link"
import leaderboardData from "@gh-data/leaderboard.json"
import weeklyRankingData from "@gh-data/weekly-ranking.json"
import starCountData from "@gh-data/star-count.json"
import { formatNumber } from "../helpers/format"
import { EASTER_EGG_REPOS } from "../helpers/consts"

const leaderboard = leaderboardData as { updated_at: string; repos: { name: string; stars_total: number }[] }
const weeklyRanking = weeklyRankingData as { updated_at: string; repos: { name: string; new_stars: number; stars_total: number }[] }
const starCount = starCountData as { updated_at: string; tiers: { threshold: number; label: string; count: number }[] }

type Tab = "weekly" | "alltime" | "pyramid"

const tabs: { key: Tab; label: string }[] = [
    { key: "weekly", label: "Weekly" },
    { key: "alltime", label: "All-time" },
    { key: "pyramid", label: "Pyramid" },
]

const LeftSidebar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(weeklyRanking.repos.length > 0 ? "weekly" : "alltime")

    const items = activeTab === "weekly"
        ? weeklyRanking.repos.map((r) => ({ name: r.name, metric: `+${formatNumber(r.new_stars)}`, metricClass: "accent-text" }))
        : leaderboard.repos.map((r) => ({ name: r.name, metric: formatNumber(r.stars_total), metricClass: "text-gray-400" }))

    const updatedAt = activeTab === "weekly" ? weeklyRanking.updated_at
        : activeTab === "alltime" ? leaderboard.updated_at
        : starCount.updated_at

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
                {activeTab === "pyramid" ? (
                    <div className="space-y-2 mt-1">
                        {starCount.tiers.map((tier) => {
                            const widthPct = (tier.count / starCount.tiers[starCount.tiers.length - 1].count) * 100
                            return (
                                <div key={tier.threshold}>
                                    <div className="flex items-baseline justify-between text-xs mb-0.5">
                                        <span className="text-gray-700 font-medium">
                                            ★ {tier.label}
                                        </span>
                                        <span className="text-gray-400">
                                            {formatNumber(tier.count)}
                                        </span>
                                    </div>
                                    <div
                                        className="h-3 rounded-sm"
                                        style={{
                                            width: `${widthPct}%`,
                                            backgroundColor: "#16a34a",
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <ol className="space-y-0.5">
                        {items.map((item, i) => {
                            const [orgName, repoName] = item.name.split("/")
                            return (
                                <li key={item.name} className="relative group">
                                    <Link
                                        href={`/${item.name.toLowerCase()}`}
                                        className="flex items-center gap-2 py-1 text-sm cursor-pointer"
                                    >
                                        <span className="text-xs text-gray-400 w-4 shrink-0">
                                            {i + 1}
                                        </span>
                                        <img
                                            src={`https://github.com/${orgName}.png?size=32`}
                                            alt=""
                                            width={16}
                                            height={16}
                                            className="rounded-full shrink-0"
                                        />
                                        <span className="truncate text-gray-700 group-hover:text-blue-600">
                                            {repoName}
                                        </span>
                                        {EASTER_EGG_REPOS.has(item.name.toLowerCase()) ? (
                                            <span className="flex-1 min-w-0 relative h-6 lobster-container">
                                                <img
                                                    src="/assets/lobster.png"
                                                    alt="Lobster"
                                                    width={20}
                                                    height={20}
                                                    className="lobster-static absolute top-0 bottom-0 my-auto left-0"
                                                />
                                                <img
                                                    src="/assets/lobster-animated.gif"
                                                    alt="Lobster"
                                                    width={20}
                                                    height={20}
                                                    className="lobster-animated absolute top-0 bottom-0 my-auto left-0"
                                                />
                                            </span>
                                        ) : (
                                            <span className="flex-1 min-w-0" />
                                        )}
                                        <span className={`text-xs shrink-0 ${item.metricClass}`}>
                                            {item.metric}
                                        </span>
                                    </Link>
                                    <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white shadow z-10">
                                        {item.name} {item.metric}
                                    </span>
                                </li>
                            )
                        })}
                    </ol>
                )}
                <p className="text-[10px] text-gray-300 mt-3">
                    Updated {updatedAt}
                </p>
            </div>
        </div>
    )
}

export default LeftSidebar
