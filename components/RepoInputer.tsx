import React, { useEffect, useRef, useState } from "react"
import { head } from "lodash"
import { GITHUB_REPO_URL_REG } from "../helpers/consts"
import toast from "../helpers/toast"
import { useAppStore } from "../store"
import { FaExternalLinkAlt } from "react-icons/fa"
import Link from "next/link"
import { Blog } from "helpers/types/blog"

interface State {
    repo: string
    repos: {
        name: string
        visible: boolean
    }[]
    latestBlog?: Blog
}

interface RepoInputerProps {
    isChartVisible: boolean
    setChartVisibility: React.Dispatch<React.SetStateAction<boolean>>
}

export default function RepoInputer({ setChartVisibility }: RepoInputerProps) {
    const store = useAppStore()
    const [state, setState] = useState<State>({
        repo: "",
        repos: []
    })

    const inputElRef = useRef<HTMLInputElement | null>(null)

    // console.log(store)

    useEffect(() => {
        if (store.repos.length === 0) {
            console.log("store.repos ->", store.repos)
            const fetchData = async () => {
                const res = await fetch("/blog/data.json")
                const blogList = (await res.json()) as Blog[]
                for (const blog of blogList) {
                    if (blog.featured) {
                        setState((prev) => ({ ...prev, latestBlog: blog }))
                        break
                    }
                }

                if (state.repos.length === 0) {
                    setState((prev) => ({ ...prev, repos: [] }))
                }
            }

            fetchData()
        }
    }, [store.repos])


    useEffect(() => {
        setChartVisibility(true)
    }, [setChartVisibility])


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
                hash = `#${store.state.repos.join("&")}&${store.state.chartMode}`
            }
            // Sync location hash only right here
            window.location.hash = hash
        }

        handleWatch()
    }, [store.state.repos, store.state.chartMode, state.repos])

    const handleAddRepoBtnClick = () => {
        if (store.isFetching) {
            return
        }
        let rawRepos = state.repo
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
                    setState((prev) => ({ ...prev, repo: "" }))
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
        setState((prev) => ({ ...prev, repo: "" }))
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

            // Update the store with the new list of visible repos
            store.actions.setRepos(newRepos.filter((r) => r.visible).map((r) => r.name))

            // if (newRepos.filter((r) => r.visible).length === 0) {
            //     setChartVisibility(false)
            // }
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
        if (event.key === "Enter") {
            event.preventDefault()
            handleAddRepoBtnClick()
        }
    }

    return (
        <div className="w-full px-3 shrink-0 flex flex-col justify-start items-center">
            <div className={`w-auto mx-auto mt-6 mb-2 flex flex-row justify-center items-center flex-wrap ${state.latestBlog ? "" : "invisible"}`}>
                <span className="px-2 -mt-px leading-7 rounded mr-2 text-sm bg-green-100 text-green-600 font-medium">{"What's new"}</span>
                <div className="flex items-center">
                    <Link className="text-gray-700 hover:underline" href={`/blog/${state.latestBlog?.slug}`}>
                        {state.latestBlog?.title} <i className="fas fa-chevron-right mr-1 text-gray-500 text-sm"></i>
                    </Link>
                </div>
            </div>
            <div className="w-auto sm:w-full grow max-w-3xl 2xl:max-w-4xl mt-4 flex flex-row justify-center items-center shadow-inner border border-solid border-black rounded">
                <input
                    ref={inputElRef}
                    value={state.repo}
                    onChange={(e) => setState((prev) => ({ ...prev, repo: e.target.value }))}
                    className="w-auto h-9 px-2 grow shrink text-dark outline-none rounded rounded-r-none placeholder:text-gray-300 focus:shadow-focus"
                    type="text"
                    placeholder={state.repos.length > 0 ? "...add next repository" : "star-history or star-history/star-history or https://github.com/star-history/star-history"}
                    onPaste={handleInputerPasted}
                    onKeyDown={handleInputerKeyDown}
                />
                <button
                    className={`h-9 pl-4 pr-4 whitespace-nowrap w-auto text-black border-l border-black hover:bg-zinc-700 hover:text-white ${store.isFetching ? "cursor-wait" : ""}`}
                    onClick={handleAddRepoBtnClick}
                >
                    View star history
                </button>
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
                            <a href={`https://github.com/${item.name}`} target="_blank">
                                <FaExternalLinkAlt className="fas fa-external-link-alt fa-sm text-gray-400 hover:text-green-600" />
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