import React, { useEffect, useState } from "react"
import toast from "../helpers/toast"
import utils from "@shared/common/utils"
import { useAppStore } from "../store"
import Dialog from "./Dialog"
import { FaTimesCircle } from "react-icons/fa"

interface State {
    embedCode: string
    token: string
}

interface GenerateEmbedCodeDialogProps {
    show: boolean
    onClose: () => void
}

const GenerateEmbedCodeDialog: React.FC<GenerateEmbedCodeDialogProps> = ({ onClose }) => {
    const store = useAppStore() // Cast to the correct type
    const [state, setState] = useState<State>({
        embedCode: "",
        token: store.token
    })
    const generateEmbedCode = React.useCallback(() => {
        const secret = btoa(state.token)
        const chartModeParam = store.chartMode === "Date" ? "type=date" : "type=timeline"
        const logScaleParam = store.useLogScale ? "&logscale" : ""
        const legendParam = `&legend=${store.legendPosition}`
        setState({
            ...state,
            embedCode: `<iframe style="width:100%;height:auto;min-width:600px;min-height:400px;" src="${window.location.origin}/embed?secret=${secret}#${store.repos.join("&")}&${chartModeParam}${logScaleParam}${legendParam}" frameBorder="0"></iframe>`
        })
    }, [store.repos, store.chartMode, store.useLogScale, store.legendPosition, state])

    useEffect(() => {
        generateEmbedCode()
    }, [generateEmbedCode])

    const handleCopyBtnClick = () => {
        if (state.token === "") {
            toast.warn("Please input the token")
            return
        }

        utils.copyTextToClipboard(state.embedCode)
        toast.succeed("Embed code copied")
    }

    const handleCloseBtnClick = () => {
        onClose()
    }

    return (
        <Dialog>
            <div className="dialog-panel">
                <header className="dialog-header">
                    <span className="dialog-title">Embed Chart</span>
                    <FaTimesCircle className="dialog-close" onClick={handleCloseBtnClick} />
                </header>
                <main className="dialog-body">
                    <p>
                        Star-history will need your{" "}
                        <a className="link" href="https://github.com/settings/tokens" target="_blank">
                            personal access token{" "}
                        </a>
                        to unlimit the{" "}
                        <a className="link" href="https://developer.github.com/v3/#rate-limiting" target="_blank">
                            GitHub API rate limit
                        </a>
                        . If you {"don't"} have one,{" "}
                        <a className="link" href="https://github.com/settings/tokens/new" target="_blank">
                            create one
                        </a>
                        , and paste it into the textbox below (no scope to your personal data is needed).
                    </p>
                    <p className="leading-8 mt-4">
                        <span className="text-red-600">*</span> Access Token
                    </p>
                    <p className="rounded-md font-bold text-sm text-red-600">Please do not give ANY SCOPE PERMISSION to the token. If you did, someone could use this to access your personal data.</p>
                    <input
                        value={state.token}
                        onChange={(e) => setState({ ...state, token: e.target.value })}
                        className="input"
                        type="text"
                    />
                    <p className="leading-8 mt-4 mb-1">Copy and paste the below codes into your blog or website</p>
                    <div className="code-block pb-14">
                        <p className="code-text">{state.embedCode}</p>
                        <button className="absolute bottom-2 right-2 btn-primary" onClick={handleCopyBtnClick}>
                            Copy
                        </button>
                    </div>
                </main>
            </div>
        </Dialog>
    )
}

export default GenerateEmbedCodeDialog
