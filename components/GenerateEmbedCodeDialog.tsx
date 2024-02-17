import React, { useEffect, useState } from "react"
import toast from "../helpers/toast"
import utils from "../common/utils"
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
        setState({
            ...state,
            embedCode: `<iframe style="width:100%;height:auto;min-width:600px;min-height:400px;" src="${window.location.origin}/embed?secret=${secret}#${store.repos.join("&")}&${store.chartMode}" frameBorder="0"></iframe>`
        })
    }, [store.repos, store.chartMode, state])

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
            <div className="max-w-2xl h-auto flex flex-col justify-start items-start bg-white rounded-md">
                <header className="w-full flex flex-row justify-between items-center p-4 pr-5 bg-gray-100 rounded-t-lg">
                    <span className="text-2xl">Embed Chart</span>
                    <FaTimesCircle className="fas fa-times-circle text-xl text-gray-400 cursor-pointer hover:text-gray-500" onClick={handleCloseBtnClick} />
                </header>
                <main className="w-full flex flex-col justify-start items-start p-4 pr-5">
                    <p>
                        Star-history will need your{" "}
                        <a className="text-blue-500" href="https://github.com/settings/tokens" target="_blank">
                            personal access token{" "}
                        </a>
                        to unlimit the{" "}
                        <a className="text-blue-500" href="https://developer.github.com/v3/#rate-limiting" target="_blank">
                            GitHub API rate limit
                        </a>
                        . If you {"don't"} have one,{" "}
                        <a className="text-blue-500" href="https://github.com/settings/tokens/new" target="_blank">
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
                        className="w-full outline-none border mt-2 shadow-inner p-2 rounded-md focus:shadow-focus"
                        type="text"
                    />
                    <p className="leading-8 mt-4 mb-1">Copy and paste the below codes into your blog or website</p>
                    <div className="relative w-full h-auto border px-4 py-3 pb-14 rounded-md shadow-inner">
                        <p className="font-mono break-all text-gray-600 text-sm">{state.embedCode}</p>
                        <button className="absolute bottom-2 right-2 px-4 leading-10 rounded-md bg-green-600 shadow-inner text-light hover:bg-green-700" onClick={handleCopyBtnClick}>
                            Copy
                        </button>
                    </div>
                </main>
            </div>
        </Dialog>
    )
}

export default GenerateEmbedCodeDialog
