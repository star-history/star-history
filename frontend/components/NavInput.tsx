import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/router"
import { GITHUB_REPO_URL_REG } from "../helpers/consts"
import repos from "@arena-data/repos.json"

const repoList = repos as { name: string; stars_total: number }[]

function formatStars(count: number): string {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
    }
    return String(count)
}

export default function NavInput() {
    const router = useRouter()
    const [navInput, setNavInput] = useState("")
    const [results, setResults] = useState<{ name: string; stars_total: number }[]>([])
    const [highlightIndex, setHighlightIndex] = useState(-1)
    const [showDropdown, setShowDropdown] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleNavSubmit = () => {
        let raw = navInput.trim()
        if (!raw) return

        if (GITHUB_REPO_URL_REG.test(raw)) {
            const match = raw.match(GITHUB_REPO_URL_REG)
            if (match) raw = match[1]
        }

        const parts = raw.split("/").filter(Boolean)
        if (parts.length === 1) {
            router.push(`/${parts[0]}/${parts[0]}`)
        } else if (parts.length >= 2) {
            router.push(`/${parts[0]}/${parts[1]}`)
        }
    }

    const closeDropdown = () => {
        setShowDropdown(false)
        setHighlightIndex(-1)
    }

    const navigateToRepo = (repoName: string) => {
        setNavInput(repoName)
        closeDropdown()
        router.push(`/${repoName}`)
    }

    const handleInputChange = (value: string) => {
        setNavInput(value)
        const query = value.trim().toLowerCase()
        if (!query) {
            setResults([])
            closeDropdown()
            return
        }
        const filtered = repoList.filter((r) => r.name.toLowerCase().includes(query)).slice(0, 8)
        setResults(filtered)
        setShowDropdown(filtered.length > 0)
        setHighlightIndex(-1)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown) {
            if (e.key === "Enter") handleNavSubmit()
            return
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                setHighlightIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
                break
            case "ArrowUp":
                e.preventDefault()
                setHighlightIndex((prev) => (prev > 0 ? prev - 1 : -1))
                break
            case "Enter":
                e.preventDefault()
                if (highlightIndex >= 0) {
                    navigateToRepo(results[highlightIndex].name)
                } else {
                    handleNavSubmit()
                }
                break
            case "Escape":
                closeDropdown()
                break
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                closeDropdown()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div ref={containerRef} className="w-full max-w-2xl mb-4 relative">
            <div className="flex items-center rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
                <input
                    type="text"
                    value={navInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (results.length > 0) setShowDropdown(true)
                    }}
                    placeholder="star-history or star-history/star-history or https://github.com/star-history/star-history"
                    className="flex-1 h-10 px-4 text-sm outline-none placeholder:text-neutral-400"
                />
                <button
                    onClick={handleNavSubmit}
                    className="h-10 px-4 text-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 border-l border-neutral-200 transition-colors"
                >
                    Go
                </button>
            </div>
            {showDropdown && results.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
                    {results.map((repo, i) => (
                        <li
                            key={repo.name}
                            onMouseDown={(e) => {
                                e.preventDefault()
                                navigateToRepo(repo.name)
                            }}
                            onMouseEnter={() => setHighlightIndex(i)}
                            className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer ${
                                i === highlightIndex ? "bg-neutral-100" : "hover:bg-neutral-50"
                            }`}
                        >
                            <span className="text-neutral-800 truncate">{repo.name}</span>
                            <span className="text-neutral-400 text-xs ml-2 shrink-0">
                                &#9733; {formatStars(repo.stars_total)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
