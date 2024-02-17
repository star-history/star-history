import React, { useState, useEffect, useRef } from "react"
import StarXYChart from "./Charts/StarXYChart"
import TokenSettingDialog from "./TokenSettingDialog"
import GenerateEmbedCodeDialog from "./GenerateEmbedCodeDialog"
import EmbedMarkdownSection from "./EmbedMarkdownSection"
import EmbedChartGuideDialog from "./EmbedChartGuideDialog"
import html2canvas from "html2canvas"
import { Storage } from "../helpers/storage"
import { useAppStore } from "store"
import { FaSpinner } from "react-icons/fa"
import { XYChartData } from "packages/xy-chart"
import { convertDataToChartData, getRepoData } from "common/chart"
import toast from "helpers/toast"
import { ChartMode, RepoData } from "types/chart"
import BytebaseBanner from "./SponsorView"
import utils from "common/utils"
import api from "common/api"

interface State {
    chartMode: "Date" | "Timeline"
    repoCacheMap: Map<
        string,
        {
            starData: {
                date: string
                count: number
            }[]
            logoUrl: string
        }
    >
    chartData: XYChartData | undefined
    isGeneratingImage: boolean
    showSetTokenDialog: boolean
    showGenEmbedCodeDialog: boolean
    showEmbedCodeDialog: boolean
    showEmbedChartGuideDialog: boolean
}

function StarChartViewer() {
    const store = useAppStore()

    const [state, setState] = useState<State>({
        chartMode: "Date",
        repoCacheMap: new Map(),
        chartData: undefined,
        isGeneratingImage: false,
        showEmbedCodeDialog: false,
        showSetTokenDialog: false,
        showGenEmbedCodeDialog: false,
        showEmbedChartGuideDialog: false
    })

    const containerElRef = useRef(null)

    useEffect(() => {
        if (store.repos.length > 0 && state.repoCacheMap.size === 0) {
            fetchReposData(store.repos)
        }
    }, [store.repos])

    const fetchReposData = React.useCallback(
        async (repos: string[], chartMode?: ChartMode) => {
            store.actions.setIsFetching(true)
            const notCachedRepos: string[] = []

            // Check if the repo data is cached
            for (const repo of store.repos) {
                const cachedRepo = state.repoCacheMap.get(repo)

                if (!cachedRepo) {
                    notCachedRepos.push(repo)
                }
            }

            try {
                const data = await getRepoData(notCachedRepos, store.token)
                for (const { repo, starRecords, logoUrl } of data) {
                    state.repoCacheMap.set(repo, {
                        starData: starRecords,
                        logoUrl
                    })
                }
            } catch (error: any) {
                toast.warn(error.message)

                if (error.status === 401 || error.status === 403) {
                    setState((prevState) => ({ ...prevState, showSetTokenDialog: true }))
                } else if (error.status === 404 || error.status === 501) {
                    store.delRepo(error.repo)
                }
            }
            store.actions.setIsFetching(false)

            const repoData: RepoData[] = []
            for (const repo of store.repos) {
                const cachedRepo = state.repoCacheMap.get(repo)
                if (cachedRepo) {
                    repoData.push({
                        repo,
                        starRecords: cachedRepo.starData,
                        logoUrl: cachedRepo.logoUrl
                    })
                }
            }

            if (repoData.length === 0) {
                setState((prevState) => ({ ...prevState, chartData: undefined }))
            } else {
                setState((prevState) => ({
                    ...prevState,
                    chartData: convertDataToChartData(repoData, chartMode ?? state.chartMode)
                }))
            }
        },
        [state.chartMode, store.repos, store.token, state.repoCacheMap]
    )

    const handleCopyLinkBtnClick = async () => {
        try {
            await utils.copyTextToClipboard(window.location.href)
            toast.succeed("Link copied")
        } catch (error) {
            console.error("Error copying link:", error)
            toast.error("Failed to copy link")
        }
    }

    const handleGenerateImageBtnClick = async () => {
        const element = document.querySelector("#capture") as HTMLElement
        if (!element) {
            throw new Error("Element with id 'capture' not found")
        }
        const canvas = await html2canvas(element)
        const imgData = canvas.toDataURL("image/png")

        // Create a link element for downloading
        const downloadLink = document.createElement("a")
        downloadLink.href = imgData
        downloadLink.download = "chart.png" // You can name the file here
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    const handleShareToTwitterBtnClick = async () => {
        const repos = store.repos

        if (repos.length === 0) {
            toast.error("No repo found")
            return
        }

        const starhistoryLink = encodeURIComponent(window.location.href)
        let text = ""

        if (repos.length === 1) {
            const repo = repos[0]
            let starCount = 0

            try {
                starCount = await api.getRepoStargazersCount(repo, store.token)
            } catch (error) {
                // handle error
            }

            let starText = ""
            if (starCount > 0) {
                starText = `${starCount < 1000 ? starCount : (starCount / 1000).toFixed(1) + "K"} ⭐️`
            }

            text = `${starText} Thank you! 🙏%0A${starhistoryLink}%0A%0A`
        } else {
            text = `Check out my GitHub star history across multiple repos: ${starhistoryLink}%0A%0A`
        }

        const addtionLink = repos.length === 1 ? `github.com/${repos[0]}` : starhistoryLink
        text += `${addtionLink}%0A%0A`
        text += `${encodeURIComponent("#starhistory #GitHub #OpenSource ")} via @StarHistoryHQ`

        const tweetShareLink = `https://twitter.com/intent/tweet?text=${text}`
        window.open(tweetShareLink, "_blank")
    }

    const handleGenEmbedCodeDialogBtnClick = () => {
        setState((prevState) => ({ ...prevState, showEmbedCodeDialog: true }))
    }

    const handleGenEmbedCodeDialogClose = () => {
        setState((prevState) => ({ ...prevState, showEmbedCodeDialog: false }))
    }

    const handleToggleChartBtnClick = React.useCallback(() => {
        const newChartMode = state.chartMode === "Date" ? "Timeline" : "Date"
        setState((prevState) => {
            return { ...prevState, chartMode: newChartMode }
        })
        fetchReposData(store.repos, newChartMode)
    }, [state.chartMode, store.repos])

    const handleSetTokenDialogClose = () => {
        setState((prevState) => ({ ...prevState, showSetTokenDialog: false }))
    }
    return (
        <>
            <div ref={containerElRef} className="relative w-full h-auto min-h-400px self-center max-w-3xl 2xl:max-w-4xl sm:p-4 pt-0">
                {store.isFetching && (
                    <div className="absolute w-full h-full flex justify-center items-center z-10 top-0">
                        <div className="absolute w-full h-full blur-md bg-white bg-opacity-80"></div>
                        <FaSpinner className="animate-spin text-4xl z-10" />
                    </div>
                )}
                {state.chartData && (
                    <div className="absolute top-0 right-1 p-2 flex flex-row">
                        <div
                            className="flex flex-row justify-center items-center rounded leading-8 text-sm px-3 cursor-pointer z-10 text-dark select-none hover:bg-gray-100"
                            onClick={handleToggleChartBtnClick}
                        >
                            <input className="mr-2" type="checkbox" checked={state.chartMode === "Timeline"} />
                            {state.chartMode === "Timeline" ? "Timeline" : "Date"}
                        </div>
                    </div>
                )}
                <div id="capture">{state.chartData && state.chartData.datasets.length > 0 && <StarXYChart classname="w-full h-auto mt-4" data={state.chartData} chartMode={state.chartMode} />}</div>
                {/* ... rest of the JSX here */}
                {state.showSetTokenDialog && <TokenSettingDialog onClose={handleSetTokenDialogClose} show={state.showSetTokenDialog} />}

                {state.showEmbedCodeDialog && <GenerateEmbedCodeDialog onClose={handleGenEmbedCodeDialogClose} show={state.showEmbedCodeDialog} />}
            </div>

            {state.chartData && state.chartData.datasets.length > 0 && (
                <>
                    <div>
                        <div className="relative mt-4 mb-4 w-full px-3 mx-auto max-w-4xl flex flex-row flex-wrap justify-between items-center">
                            <div className="flex flex-row justify-start items-center mb-2">
                                <a
                                    className="h-full flex flex-row justify-center items-center leading-8 hover:opacity-80 underline underline-offset-2 mb-2 decoration-dark"
                                    href="https://chrome.google.com/webstore/detail/iijibbcdddbhokfepbblglfgdglnccfn"
                                    target="_blank"
                                >
                                    <img className="w-5 h-auto mr-1" src="https://star-history.com/icons/free.svg" />
                                    <span className="text-dark">Get Chrome Extension</span>
                                </a>
                            </div>
                            <div className="flex flex-row flex-wrap justify-end items-center mb-2">
                                <button className="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200" onClick={handleGenerateImageBtnClick}>
                                    <i className="fas fa-download"></i> Image
                                </button>

                                <button className="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200" onClick={handleGenerateImageBtnClick}>
                                    <i className="fas fa-download"></i> CSV
                                </button>

                                <button className="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200" onClick={handleGenEmbedCodeDialogBtnClick}>
                                    <i className="fas fa-code"></i> Embed
                                </button>
                                <button className="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200" onClick={handleCopyLinkBtnClick}>
                                    <i className="far fa-copy"></i> Link{" "}
                                </button>
                                <button
                                    className="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-600 border border-transparent text-white hover:bg-green-700"
                                    onClick={handleShareToTwitterBtnClick}
                                >
                                    <i className="relative -bottom-px fab fa-twitter"></i> Share on Twitter{" "}
                                </button>
                            </div>
                        </div>
                        <EmbedMarkdownSection />

                        <div className="flex-grow"></div>
                        <div className="flex justify-center mb-12">
                            <iframe
                                src="https://embeds.beehiiv.com/2803dbaa-d8dd-4486-8880-4b843f3a7da6?slim=true"
                                data-test-id="beehiiv-embed"
                                height="52"
                                frameBorder="0"
                                scrolling="no"
                                style={{
                                    margin: 0,
                                    borderRadius: 0,
                                    backgroundColor: "transparent"
                                }}
                            ></iframe>
                        </div>
                    </div>
                    <BytebaseBanner v-if="state.chartData" />
                </>
            )}
        </>
    )
}

export default StarChartViewer
