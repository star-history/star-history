import { useState, useEffect } from "react"
import { useAppStore } from "../store"
import utils from "../shared/common/utils"
import toast from "../helpers/toast"

const EmbedChart: React.FC = () => {
    const store = useAppStore()
    const [singleRepo, setSingleRepo] = useState<string | null>(null)

    useEffect(() => {
        setSingleRepo(store.repos.length === 1 ? store.repos[0] : null)
    }, [store.repos])

    const repoText = singleRepo ? singleRepo.split("/")[1] : "your repository's"

    // Build query parameters
    const buildQueryParams = (theme?: string) => {
        const chartModeParam = store.chartMode === "Date" ? "date" : "timeline"
        let params = `repos=${store.repos.join(",")}&type=${chartModeParam}`
        if (theme) {
            params += `&theme=${theme}`
        }
        if (store.useLogScale) {
            params += `&logscale`
        }
        params += `&legend=${store.legendPosition}`
        params += `&dateFormat=${encodeURIComponent(store.dateFormat)}`
        return params
    }

    const embedCode = `## Star History\n\n[![Star History Chart](https://api.star-history.com/svg?${buildQueryParams()})](${typeof window !== "undefined" ? window.location.href : ""})`

    const embedDarkModeCode = `## Star History\n\n<a href="${typeof window !== "undefined" ? window.location.href : ""}">\n <picture>\n   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?${buildQueryParams("dark")}" />\n   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?${buildQueryParams()}" />\n   <img alt="Star History Chart" src="https://api.star-history.com/svg?${buildQueryParams()}" />\n </picture>\n</a>`

    const handleCopyBtnClick = () => {
        utils.copyTextToClipboard(embedCode)
        toast.succeed("Embed markdown code copied")
    }

    const handleDarkModeCopyBtnClick = () => {
        utils.copyTextToClipboard(embedDarkModeCode)
        toast.succeed("Embed markdown code copied")
    }

    return (
        <div className="w-full h-auto mb-12 px-3 mx-auto max-w-4xl flex flex-col justify-start items-center">
            <p className="leading-8 mb-3">
                🌟 Show real-time chart on {repoText}{" "}
                {singleRepo ? (
                    <a className="font-mono underline text-blue-500 hover:opacity-80" href={`https://github.com/${singleRepo}/blob/master/README.md`} target="_blank">
                        README.md
                    </a>
                ) : (
                    <span className="font-mono text-gray-500">README.md</span>
                )}{" "}
                with the following code (
                <a className="font-mono underline text-blue-500 hover:opacity-80" href="https://github.com/star-history/star-history?tab=readme-ov-file#sparkles-star-history-sparkles" target="_blank">
                    example
                </a>
                ):
            </p>
            <div className="w-full bg-gray-100 text-dark rounded-md shadow">
                <pre className="w-full p-4 font-mono break-all whitespace-pre-wrap text-sm">{embedCode}</pre>
                <div style={{ display: "flex" }}>
                    <p
                        className="text-center py-4 bg-green-600 text-white font-mono rounded-b-md cursor-pointer hover:bg-green-700"
                        style={{
                            width: "70%",
                            borderBottomRightRadius: 0
                        }}
                        onClick={handleCopyBtnClick}
                    >
                        Copy to GitHub README.md
                    </p>
                    <div className="bg-gray-100" style={{ width: "1px" }} />
                    <p
                        className="text-center py-4 bg-gray-200 text-dark font-mono rounded-b-md cursor-pointer hover:bg-gray-300"
                        style={{
                            width: "30%",
                            minWidth: "max-content",
                            borderBottomLeftRadius: 0
                        }}
                        onClick={handleDarkModeCopyBtnClick}
                    >
                        (dark theme supported)
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EmbedChart
