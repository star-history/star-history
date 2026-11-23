import React, { useEffect, useRef, useState } from "react"
import { head } from "lodash"
import { GITHUB_REPO_URL_REG, NEWSLETTER_URL } from "../helpers/consts"
import toast from "../helpers/toast"
import { useAppStore } from "../store"
import { SketchExternalLinkIcon } from "./SketchIcons"
import Link from "next/link"
import { Blog } from "helpers/types/blog"
import blogs from "helpers/blog.json"
import { SketchMailboxIcon } from "./SketchIcons"
import api, { RepoSearchResult } from "@shared/common/api"
import { formatNumber } from "../helpers/format"
import { FaSpinner } from "react-icons/fa"

interface State {
    repo: string
    repos: {
        name: string
        visible: boolean
    }[]
    latestBlog?: Blog
    suggestions: RepoSearchResult[]
    showSuggestions: boolean
    highlightedIndex: number
    isSearching: boolean
    searchError: boolean
}

interface RepoInputerProps {
    isChartVisible: boolean
    setChartVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

export default function RepoInputer({ setChartVisibility }: RepoInputerProps) {
    const store = useAppStore()
    const [state, setState] = useState<State>({
        repo: "",
        repos: [],
        suggestions: [],
        showSuggestions: false,
        highlightedIndex: -1,
        isSearching: false,
        searchError: false,
    })

    const inputElRef = useRef<HTMLInputElement | null>(null)
    const containerElRef = useRef<HTMLDivElement | null>(null)
    const searchSeqRef = useRef(0)

    useEffect(() => {
        const latest = (blogs as Blog[]).find(blog => blog.featured);
        if (latest) {
            setState(prev => ({ ...prev, latestBlog: latest }));
        }
    }, []);
    

    useEffect(() => {
        setChartVisibility(true)
    }, [setChartVisibility])

    
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
           
            const reposFromHash = hash.substring(1).split('&');
            setState(prev => ({ ...prev, repos: reposFromHash.map(name => ({ name, visible: true })) }));

        }
    }, []);

    

    // Sync local state when store repos change (e.g. from sidebar click)
    useEffect(() => {
        const localNames = state.repos.map(r => r.name)
        const newRepos = store.state.repos.filter(name => !localNames.includes(name))
        if (newRepos.length > 0) {
            setState(prev => ({
                ...prev,
                repos: [
                    ...prev.repos,
                    ...newRepos.map(name => ({ name, visible: true }))
                ]
            }))
        }
    }, [store.state.repos])

    useEffect(() => {
        const handleWatch = () => {
            for (const r of state.repos) {
                if (r.visible && !store.state.repos.includes(r.name)) {
                    setState((prev) => ({
                        ...prev,
                        repos: prev.repos.filter((repo) => repo.name !== r.name)
                    }))
                }
            }

            let hash = ""
            if (store.state.repos.length > 0) {
                const chartModeParam = store.state.chartMode === "Date" ? "date" : "timeline"
                hash = `#${store.state.repos.join("&")}&type=${chartModeParam}`
                if (store.state.useLogScale) {
                    hash += "&logscale"
                }
                hash += `&legend=${store.state.legendPosition}`
            }
            // Sync location hash only right here
            window.location.hash = hash
        }

        handleWatch()
    }, [store.state.repos, store.state.chartMode, store.state.useLogScale, store.state.legendPosition, state.repos])

    // Fuzzy-search GitHub repos while typing and show full name + star count suggestions.
    useEffect(() => {
        const query = state.repo.trim()
        const seq = ++searchSeqRef.current

        setState((prev) => ({ ...prev, highlightedIndex: -1, searchError: false }))

        if (query.length < 2 || GITHUB_REPO_URL_REG.test(query)) {
            setState((prev) => ({
                ...prev,
                suggestions: [],
                showSuggestions: false,
                isSearching: false,
            }))
            return
        }

        const timer = setTimeout(async () => {
            setState((prev) => ({ ...prev, isSearching: true, showSuggestions: true }))
            try {
                const suggestions = await api.searchRepos(query, store.token)
                if (seq !== searchSeqRef.current) {
                    return
                }
                setState((prev) => ({
                    ...prev,
                    suggestions,
                    showSuggestions: suggestions.length > 0,
                }))
            } catch (e) {
                if (seq !== searchSeqRef.current) {
                    return
                }
                setState((prev) => ({
                    ...prev,
                    suggestions: [],
                    showSuggestions: true,
                    searchError: true,
                }))
            } finally {
                if (seq === searchSeqRef.current) {
                    setState((prev) => ({ ...prev, isSearching: false }))
                }
            }
        }, 400)

        return () => clearTimeout(timer)
    }, [state.repo, store.token])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerElRef.current && !containerElRef.current.contains(e.target as Node)) {
                setState((prev) => ({ ...prev, showSuggestions: false, highlightedIndex: -1 }))
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleAddRepos = (rawReposInput: string) => {
        if (store.isFetching) {
            return
        }
        let rawRepos = rawReposInput
        if (rawRepos === "" && state.repos.length === 0) {
            rawRepos = "star-history/star-history"
        }

        if (rawRepos === "") {
            toast.warn("Please input the repo name")
            return
        }

        for (const rawRepo of rawRepos.split(",")) {
            let repo = ""

            if (GITHUB_REPO_URL_REG.test(rawRepo)) {
                repo = (rawRepo.match(GITHUB_REPO_URL_REG) as string[])[1]
            }
            repo = head(rawRepo.split("#")) as string
            if (repo === "") {
                continue
            }

            if (GITHUB_REPO_URL_REG.test(repo)) {
                const regResult = GITHUB_REPO_URL_REG.exec(repo)
                if (regResult && regResult[1]) {
                    repo = regResult[1]
                }
            }

            const valueList = repo.split("/")
            if (valueList.length === 1) {
                repo = `${valueList[0]}/${repo}`
            } else if (valueList.length >= 2) {
                repo = `${valueList[0]}/${valueList[1]}`
            }

            for (const r of state.repos) {
                if (r.name === repo) {
                    if (r.visible) {
                        toast.warn(`Repo ${repo} is already on the chart`)
                    } else {
                        r.visible = true
                        store.actions.setRepos(state.repos.filter((r) => r.visible).map((r) => r.name))
                        setChartVisibility(true)
                    }
                    setState((prev) => ({ ...prev, repo: "", showSuggestions: false }))
                    return
                }
            }
            setState((prev) => ({
                ...prev,
                repos: [
                    ...prev.repos,
                    {
                        name: repo,
                        visible: true
                    }
                ]
            }))
            store.actions.addRepo(repo)
            setChartVisibility(true)
        }
        setState((prev) => ({ ...prev, repo: "", suggestions: [], showSuggestions: false }))
    }

    const handleAddRepoBtnClick = () => {
        handleAddRepos(state.repo)
    }

    const handleSuggestionSelect = (repoName: string) => {
        handleAddRepos(repoName)
        inputElRef.current?.focus()
    }

    const handleToggleRepoItemVisible = React.useCallback(
        (repo: string) => {
            const prevRepos = state.repos
            const newRepos = prevRepos.map((r) => (r.name === repo ? { ...r, visible: !r.visible } : r))
            setState((prev) => ({
                ...prev,
                repos: newRepos
            }))

            // Determine if any repo is visible
            const anyRepoVisible = newRepos.some((r) => r.visible)

            // Set the chart visibility based on whether any repo is visible
            setChartVisibility(anyRepoVisible)

            store.actions.setRepos(newRepos.filter((r) => r.visible).map((r) => r.name))
        },
        [state.repos, store.actions, setChartVisibility]
    )

    const handleDeleteRepoBtnClick = (repo: string) => {
        setState((prev) => ({
            ...prev,
            repos: prev.repos.filter((r) => r.name !== repo)
        }))
        store.actions.delRepo(repo)

        if (state.repos.length === 1) {
            setChartVisibility(false)
        }
    }

    const handleClearAllRepoBtnClick = () => {
        setState((prev) => ({
            ...prev,
            repos: []
        }))
        store.actions.setRepos([])
        setChartVisibility(false)
    }

    const handleInputerPasted = async (event: React.ClipboardEvent<HTMLInputElement>) => {
        if (!inputElRef.current) {
            return
        }
        const inputEl = inputElRef.current
        if (event.clipboardData) {
            event.preventDefault()
            const text = event.clipboardData.getData("text").replace(/(?:\r\n|\r|\n| )/g, "")
            const value = state.repo
            const prevStr = value.slice(0, Math.min(inputEl.selectionStart || 0, inputEl.selectionEnd || 0))
            const nextStr = value.slice(Math.max(inputEl.selectionStart || 0, inputEl.selectionEnd || 0))
            setState((prev) => ({ ...prev, repo: `${prevStr}${text}${nextStr}` }))
        }
    }

    const handleInputerKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            setState((prev) => ({ ...prev, showSuggestions: false, highlightedIndex: -1 }))
            return
        }

        if (state.showSuggestions && state.suggestions.length > 0) {
            if (event.key === "ArrowDown") {
                event.preventDefault()
                setState((prev) => ({
                    ...prev,
                    highlightedIndex: Math.min(prev.highlightedIndex + 1, prev.suggestions.length - 1),
                }))
                return
            }
            if (event.key === "ArrowUp") {
                event.preventDefault()
                setState((prev) => ({ ...prev, highlightedIndex: Math.max(prev.highlightedIndex - 1, -1) }))
                return
            }
            if (event.key === "Enter") {
                event.preventDefault()
                if (state.highlightedIndex >= 0) {
                    handleSuggestionSelect(state.suggestions[state.highlightedIndex].fullName)
                } else {
                    handleAddRepoBtnClick()
                }
                return
            }
        }

        if (event.key === "Enter") {
            event.preventDefault()
            handleAddRepoBtnClick()
        }
    }

    const isDropdownVisible =
        state.showSuggestions && (state.isSearching || state.searchError || state.suggestions.length > 0)

    return (
        <div className="w-full px-3 shrink-0 flex flex-col justify-start items-center">
            <div className={`w-auto mx-auto mt-6 mb-2 flex flex-row justify-center items-center flex-wrap ${state.latestBlog ? "" : "invisible"}`}>
                <span className="px-2 -mt-px leading-7 rounded mr-2 text-sm accent-badge font-medium">
                    {state.latestBlog?.publishedDate ? (() => {
                        const dateStr = state.latestBlog.publishedDate;
                        return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    })() : "What's new"}
                </span>
                <div className="flex items-center">
                    <Link className="text-gray-700 hover:underline" href={`/blog/${state.latestBlog?.slug}`}>
                        {state.latestBlog?.title}
                    </Link>
                </div>
                <a
                    href={NEWSLETTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 text-gray-700 hover:underline flex items-center gap-1"
                >
                   <SketchMailboxIcon /> Subscribe
                </a>
            </div>
            <div ref={containerElRef} className="relative w-auto sm:w-full grow max-w-3xl 2xl:max-w-4xl mt-4">
                <div className="w-full flex flex-row justify-center items-center shadow-inner border border-solid border-black rounded">
                    <input
                        ref={inputElRef}
                        value={state.repo}
                        onChange={(e) => setState((prev) => ({ ...prev, repo: e.target.value }))}
                        className="w-auto h-9 px-2 grow shrink text-dark outline-none rounded rounded-r-none placeholder:text-gray-300 focus:shadow-focus"
                        type="text"
                        placeholder={state.repos.length > 0 ? "...add next repository" : "star-history or star-history/star-history or https://github.com/star-history/star-history"}
                        onPaste={handleInputerPasted}
                        onKeyDown={handleInputerKeyDown}
                        onFocus={() => {
                            if (state.suggestions.length > 0) {
                                setState((prev) => ({ ...prev, showSuggestions: true }))
                            }
                        }}
                    />
                    <button
                        className={`h-9 pl-4 pr-4 whitespace-nowrap w-auto text-black border-l border-black hover:bg-zinc-700 hover:text-white ${store.isFetching ? "cursor-wait" : ""}`}
                        onClick={handleAddRepoBtnClick}
                    >
                        View star history
                    </button>
                </div>
                {isDropdownVisible && (
                    <ul
                        role="listbox"
                        className="absolute left-0 right-0 top-full z-20 mt-1 bg-white border border-black rounded shadow-lg overflow-hidden"
                    >
                        {state.isSearching && (
                            <li className="flex flex-row items-center px-3 py-2 text-sm text-gray-500">
                                <FaSpinner className="animate-spin mr-2" />
                                Searching GitHub...
                            </li>
                        )}
                        {!state.isSearching && state.searchError && (
                            <li className="px-3 py-2 text-sm text-gray-500">
                                GitHub search is unavailable. Press Enter to view it directly.
                            </li>
                        )}
                        {!state.isSearching &&
                            state.suggestions.map((suggestion, i) => (
                                <li
                                    role="option"
                                    aria-selected={i === state.highlightedIndex}
                                    key={suggestion.fullName}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        handleSuggestionSelect(suggestion.fullName)
                                    }}
                                    onMouseEnter={() => setState((prev) => ({ ...prev, highlightedIndex: i }))}
                                    className={`flex flex-row items-center justify-between px-3 py-2 text-sm cursor-pointer ${
                                        i === state.highlightedIndex ? "bg-gray-100" : "hover:bg-gray-50"
                                    }`}
                                >
                                    <span className="text-dark truncate">{suggestion.fullName}</span>
                                    <span className="text-gray-400 text-xs ml-2 shrink-0">
                                        &#9733; {formatNumber(suggestion.stars)}
                                    </span>
                                </li>
                            ))}
                    </ul>
                )}
            </div>
            <div className="w-full mt-4 flex flex-row justify-center items-center">
                <div className={`w-full max-w-2xl flex flex-row flex-wrap justify-center items-center ${state.repos.length > 0 ? "" : "invisible"}`}>
                    {state.repos.map((item) => (
                        <div key={item.name} className="leading-8 px-3 pr-2 mb-2 text-dark rounded flex flex-row justify-center items-center border mr-3 last:mr-0">
                            <span className="relative w-3 h-3 mr-1 flex flex-row justify-center items-center cursor-pointer hover:opacity-60" onClick={() => handleDeleteRepoBtnClick(item.name)}>
                                <span className="w-3 rotate-45 h-px bg-[black] absolute top-1/2"></span>
                                <span className="w-3 -rotate-45 h-px bg-black absolute top-1/2"></span>
                            </span>
                            <span
                                className={`mr-1 cursor-pointer hover:line-through select-none ${item.visible ? "" : "line-through text-gray-400"}`}
                                onClick={() => handleToggleRepoItemVisible(item.name)}
                            >
                                {item.name}
                            </span>
                            <a href={`https://github.com/${item.name}`} target="_blank" className="flex items-center text-gray-400 hover:text-green-600">
                                <SketchExternalLinkIcon />
                            </a>
                        </div>
                    ))}
                    <button className="leading-8 mb-2 text-black hover:bg-gray-100 px-3 rounded border border-transparent" onClick={handleClearAllRepoBtnClick}>
                        Clear all
                    </button>
                </div>
            </div>
        </div>
    )
}