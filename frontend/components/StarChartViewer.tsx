/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react"
import StarXYChart from "./Charts/StarXYChart"
import TokenSettingDialog from "./TokenSettingDialog"
import GenerateEmbedCodeDialog from "./GenerateEmbedCodeDialog"
import EmbedMarkdownSection from "./EmbedMarkdownSection"
import { useAppStore } from "store"
import { FaSpinner } from "react-icons/fa"
import { XYChartData } from "shared/packages/xy-chart"
import { convertDataToChartData, getRepoData } from "shared/common/chart"
import toast from "helpers/toast"
import { ChartMode, RepoData, LegendPosition } from "shared/types/chart"

const VALID_LEGEND_POSITIONS: LegendPosition[] = ["top-left", "bottom-right"]
import BytebaseBanner from "./SponsorView"
import utils from "shared/common/utils"
import api from "shared/common/api"

interface State {
    chartMode: "Date" | "Timeline"
    useLogScale: boolean
    legendPosition: LegendPosition
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

interface StarChartViewerProps {
    compact?: boolean
}

function StarChartViewer({ compact = false }: StarChartViewerProps) {
    const store = useAppStore()

    const [state, setState] = useState<State>({
        chartMode: "Date",
        useLogScale: false,
        legendPosition: "top-left",
        repoCacheMap: new Map(),
        chartData: undefined,
        isGeneratingImage: false,
        showEmbedCodeDialog: false,
        showSetTokenDialog: false,
        showGenEmbedCodeDialog: false,
        showEmbedChartGuideDialog: false
    })

    const containerElRef = useRef<HTMLDivElement>(null)

    const fetchReposData = React.useCallback(
        async (repos: string[], chartMode?: ChartMode) => {
            store.actions.setIsFetching(true)
            const notCachedRepos: string[] = []

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
        [state.chartMode, state.repoCacheMap, store]
    )
    
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            const alignTimeline = hash.includes("timeline") || hash.includes("Timeline");
            const useLogScale = hash.includes("logscale") || hash.includes("LogScale");

            // Parse legend position from hash
            let legendPosition: LegendPosition = "top-left";
            const legendRegex = new RegExp(`legend=(${VALID_LEGEND_POSITIONS.join("|")})`);
            const legendMatch = hash.match(legendRegex);
            if (legendMatch) {
                const position = legendMatch[1] as LegendPosition;
                if (VALID_LEGEND_POSITIONS.includes(position)) {
                    legendPosition = position;
                }
            }

            if (alignTimeline) {
                const newChartMode = "Timeline";
                setState(prevState => ({ ...prevState, chartMode: newChartMode, useLogScale, legendPosition }));
                fetchReposData(store.repos, newChartMode);
            } else {
                setState(prevState => ({ ...prevState, useLogScale, legendPosition }));
            }
        };

        handleHashChange();

        window.addEventListener("hashchange", handleHashChange);

        fetchReposData(store.repos, state.chartMode);

        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, [store.repos, state.chartMode]);
    
    
    
    useEffect(() => {
        if (store.repos.length > 0) {
            fetchReposData(store.repos)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.repos])

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
        if (state.isGeneratingImage) {
            return
        }

        const svgElement = containerElRef.current?.querySelector("svg")?.cloneNode(true) as SVGSVGElement
        svgElement.querySelectorAll(".chart-tooltip-dot").forEach((d) => d.remove())
        svgElement.querySelectorAll(".browser-only").forEach((d) => d.remove())
        // convert images from url href to data url href
        for (const i of Array.from(svgElement.querySelectorAll("image"))) {
            const url = i.getAttribute("href")
            if (url) {
                const dataUrl = await utils.getBase64Image(url)
                i.setAttribute("href", dataUrl)
            }
        }
        svgElement.setAttribute("class", "fixed -z-10")
        document.body.append(svgElement)

        if (!svgElement || !containerElRef.current) {
            toast.warn("Chart element not found, please try later")
            return
        }

        state.isGeneratingImage = true

        let destoryGeneratingToast = () => {
            // do nth
        }
        setTimeout(() => {
            if (state.isGeneratingImage) {
                const cbs = toast.warn(`<i class="fas fa-spinner animate-spin text-2xl mr-3"></i>Generating image`, -1)
                destoryGeneratingToast = cbs.destroy
            }
        }, 2000)

        try {
            // Get image's width and height from the container, because the svg's width is set to 100%
            const { width: imgWidth, height: imgHeight } = containerElRef.current.getBoundingClientRect()
            const canvas = document.createElement("canvas")
            const scale = Math.floor(window.devicePixelRatio * 2)
            canvas.width = (imgWidth + 20) * scale
            canvas.height = (imgHeight + 30) * scale
            const ctx = canvas.getContext("2d")
            if (!ctx) {
                toast.warn("Get canvas context failed.")
                return
            }
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // draw chart image
            const chartDataURL = utils.convertSVGToDataURL(svgElement)
            const chartImage = new Image()
            chartImage.src = chartDataURL
            await utils.waitImageLoaded(chartImage)
            ctx.drawImage(chartImage, 10 * scale, 10 * scale, imgWidth * scale, imgHeight * scale)

            const link = document.createElement("a")
            link.download = `star-history-${utils.getDateString(Date.now(), "yyyyMMdd")}.png`
            link.href = canvas.toDataURL()
            link.click()
            state.isGeneratingImage = false
            destoryGeneratingToast()
            toast.succeed("Image Downloaded")
        } catch (error) {
            console.error(error)
            toast.error("Generate image failed")
        }
        svgElement.remove()
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

    const handleGenerateCSVBtnClick = () => {
        if (state.chartData) {
            const currentDate = new Date()
            const formattedDate = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}`
            const filename = `star-history-${formattedDate}.csv`

            const csvContent =
                "data:text/csv;charset=utf-8," +
                state.chartData.datasets.reduce((acc: string, dataset: any) => {
                    dataset.data.forEach((dataPoint: any) => {
                        acc += `${dataset.label},${new Date(dataPoint.x).toString()},${dataPoint.y}\n`
                    })
                    return acc
                }, "Repository,Date,Stars\n")

            const encodedUri = encodeURI(csvContent)
            const link = document.createElement("a")
            link.setAttribute("href", encodedUri)
            link.setAttribute("download", filename)
            document.body.appendChild(link)
            link.click()
            toast.succeed("CSV Downloaded")
            document.body.removeChild(link)
        } else {
            toast.error("No chart data available to export")
        }
    }

    const handleGenEmbedCodeDialogBtnClick = () => {
        setState((prevState) => ({ ...prevState, showEmbedCodeDialog: true }))
    }

    const handleGenEmbedCodeDialogClose = () => {
        setState((prevState) => ({ ...prevState, showEmbedCodeDialog: false }))
    }

    const handleToggleChartBtnClick = React.useCallback(() => {
        const newChartMode = state.chartMode === "Date" ? "Timeline" : "Date"
        store.actions.setChartMode(newChartMode)

        setState((prevState) => {
            return { ...prevState, chartMode: newChartMode }
        })
        fetchReposData(store.repos, newChartMode)
    }, [state.chartMode, store.actions, store.repos, fetchReposData])

    const handleToggleLogScaleBtnClick = React.useCallback(() => {
        const newUseLogScale = !state.useLogScale
        store.actions.setUseLogScale(newUseLogScale)

        setState((prevState) => {
            return { ...prevState, useLogScale: newUseLogScale }
        })
        fetchReposData(store.repos, state.chartMode)
    }, [state.useLogScale, state.chartMode, store.actions, store.repos, fetchReposData])

    const handleLegendPositionChange = React.useCallback((position: LegendPosition) => {
        store.actions.setLegendPosition(position)

        setState((prevState) => {
            return { ...prevState, legendPosition: position }
        })
        fetchReposData(store.repos, state.chartMode)
    }, [state.chartMode, store.actions, store.repos, fetchReposData])

    const handleSetTokenDialogClose = () => {
        setState((prevState) => ({ ...prevState, showSetTokenDialog: false }))
    }
    return (
        <>
            <div ref={containerElRef} className={`relative w-full h-auto self-center max-w-3xl 2xl:max-w-4xl sm:p-4 pt-0 ${compact ? "min-h-[200px]" : "min-h-400px"}`}>
                {store.isFetching && (
                    <div className="absolute w-full h-full flex justify-center items-center z-10 top-0">
                        <div className="absolute w-full h-full blur-md bg-white bg-opacity-80"></div>
                        <FaSpinner className="animate-spin text-4xl z-10" />
                    </div>
                )}
                {!compact && state.chartData && (
                    <>
                        <div className="absolute top-0 left-1 p-2 flex flex-row">
                            <div className="flex flex-row justify-center items-center rounded leading-8 text-sm px-3 z-10 text-dark select-none">
                                <span className="mr-2">Legend</span>
                                <label className="mr-2 cursor-pointer hover:opacity-80 flex items-center">
                                    <input
                                        className="mr-1"
                                        type="radio"
                                        name="legendPosition"
                                        checked={state.legendPosition === "top-left"}
                                        onChange={() => handleLegendPositionChange("top-left")}
                                    />
                                    Top left
                                </label>
                                <label className="cursor-pointer hover:opacity-80 flex items-center">
                                    <input
                                        className="mr-1"
                                        type="radio"
                                        name="legendPosition"
                                        checked={state.legendPosition === "bottom-right"}
                                        onChange={() => handleLegendPositionChange("bottom-right")}
                                    />
                                    Bottom right
                                </label>
                            </div>
                        </div>
                        <div className="absolute top-0 right-1 p-2 flex flex-row">
                            <div
                                className="flex flex-row justify-center items-center rounded leading-8 text-sm px-3 cursor-pointer z-10 text-dark select-none hover:bg-gray-100"
                                onClick={handleToggleLogScaleBtnClick}
                            >
                                <input className="mr-2" type="checkbox" checked={state.useLogScale} />
                                Log scale
                            </div>
                            <div
                                className="flex flex-row justify-center items-center rounded leading-8 text-sm px-3 cursor-pointer z-10 text-dark select-none hover:bg-gray-100"
                                onClick={handleToggleChartBtnClick}
                            >
                                <input className="mr-2" type="checkbox" checked={state.chartMode === "Timeline"} />
                                {state.chartMode === "Timeline" ? "Align timeline" : "Align timeline"}
                            </div>
                        </div>
                    </>
                )}
                <div id="capture">{state.chartData && state.chartData.datasets.length > 0 && <StarXYChart classname={`w-full h-auto ${compact ? "" : "mt-6"}`} data={state.chartData} chartMode={state.chartMode} useLogScale={state.useLogScale} legendPosition={state.legendPosition} />}</div>
                {/* ... rest of the JSX here */}
                {state.showSetTokenDialog && (
                    <TokenSettingDialog
                        onClose={handleSetTokenDialogClose}
                        show={state.showSetTokenDialog}
                    />
                )}

                {state.showEmbedCodeDialog && <GenerateEmbedCodeDialog onClose={handleGenEmbedCodeDialogClose} show={state.showEmbedCodeDialog} />}
            </div>

            {!compact && state.chartData && state.chartData.datasets.length > 0 && (
                <>
                    <div>
                        <div className="relative mt-4 mb-4 w-full px-3 mx-auto max-w-4xl flex flex-row flex-wrap justify-between items-center">
                            <div className="flex flex-row justify-start items-center mb-2">
                                <a
                                    className="h-full flex flex-row justify-center items-center leading-8 hover:opacity-80 underline underline-offset-2 mb-2 decoration-dark"
                                    href="https://chrome.google.com/webstore/detail/iijibbcdddbhokfepbblglfgdglnccfn"
                                    target="_blank"
                                >
                                    <img className="w-5 h-auto mr-1" src="/assets/free.svg" alt="" />
                                    <span className="text-dark">Get Chrome Extension</span>
                                </a>
                            </div>
                            <div className="flex flex-row flex-wrap justify-end items-center mb-2">
                                <button className="ml-2 mb-2 btn-secondary" onClick={handleGenerateImageBtnClick}>
                                    <i className="fas fa-download"></i> Image
                                </button>

                                <button className="ml-2 mb-2 btn-secondary" onClick={handleGenerateCSVBtnClick}>
                                    <i className="fas fa-download"></i> CSV
                                </button>

                                <button className="ml-2 mb-2 btn-secondary" onClick={handleGenEmbedCodeDialogBtnClick}>
                                    <i className="fas fa-code"></i> Embed
                                </button>
                                <button className="ml-2 mb-2 btn-secondary" onClick={handleCopyLinkBtnClick}>
                                    <i className="far fa-copy"></i> Link{" "}
                                </button>
                                <button
                                    className="ml-2 mb-2 btn-secondary"
                                    onClick={handleShareToTwitterBtnClick}
                                >
                                    <i className="fab fa-twitter"></i> Share on Twitter{" "}
                                </button>
                            </div>
                        </div>

                        <EmbedMarkdownSection />
                    </div>
                    <BytebaseBanner v-if="state.chartData" />
                </>
            )}
        </>
    )
}

export default StarChartViewer
