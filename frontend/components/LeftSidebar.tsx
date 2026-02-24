import React from "react"
import { useAppStore } from "../store"
import leaderboard from "../helpers/leaderboard.json"

function formatStars(count: number): string {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
    }
    return String(count)
}

const LeftSidebar: React.FC = () => {
    const store = useAppStore()

    const handleClick = (e: React.MouseEvent, repoName: string) => {
        e.preventDefault()
        store.actions.setRepos([repoName])
    }

    return (
        <div className="sticky top-28 flex flex-col w-full h-fit">
            <div className="pt-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    All-time Stars
                </h3>
                <ol className="space-y-0.5">
                    {leaderboard.map((repo, i) => {
                        const repoName = repo.name.split("/")[1]
                        return (
                            <li key={repo.name}>
                                <a
                                    href={`/#${repo.name}`}
                                    onClick={(e) => handleClick(e, repo.name)}
                                    className="flex items-center gap-2 py-1 text-sm group cursor-pointer"
                                >
                                    <span className="text-xs text-gray-300 w-4 shrink-0">
                                        {i + 1}
                                    </span>
                                    <span className="truncate text-gray-700 group-hover:text-blue-600">
                                        {repoName}{repo.name === "openclaw/openclaw" && " 🦞"}
                                    </span>
                                    <span className="ml-auto text-xs text-gray-400 shrink-0">
                                        {formatStars(repo.stars_total)}
                                    </span>
                                </a>
                            </li>
                        )
                    })}
                </ol>
            </div>
        </div>
    )
}

export default LeftSidebar
