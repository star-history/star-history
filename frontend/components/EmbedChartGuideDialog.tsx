import Dialog from "./Dialog"
import utils from "../shared/common/utils"
import toast from "../helpers/toast"

interface EmbedCodeProps {
    show: boolean
    onClose: () => void
    embedCode: string
}

const EmbedChartGuideDialog: React.FC<EmbedCodeProps> = ({ onClose, embedCode }) => {
    const handleCopyBtnClick = () => {
        utils.copyTextToClipboard(embedCode)
        toast.succeed("Embed markdown code copied")
    }

    const handleCloseBtnClick = () => {
        onClose()
    }

    return (
        <Dialog>
            <div className="dialog-panel w-160 max-w-full">
                <header className="dialog-header">
                    <span className="dialog-title">Step-to-step guide</span>
                    <i className="dialog-close fas fa-times-circle" onClick={handleCloseBtnClick}></i>
                </header>
                <main className="dialog-body">
                    <p className="leading-7">{"It's very easy to add star-history chart into GitHub README, just two steps"}:</p>
                    <ol className="list-decimal pl-5 mt-3">
                        <li className="mb-2">
                            <p>Copy the raw markdown string below</p>
                            <div className="code-block mt-2">
                                <pre className="code-text whitespace-pre-wrap">{embedCode}</pre>
                                <button className="absolute top-2 right-2 btn-primary leading-8 text-sm" onClick={handleCopyBtnClick}>
                                    Copy
                                </button>
                            </div>
                        </li>
                        <li className="mb-2">
                            <p>
                                Paste it into your repo
                                {/* Provide a direct link to the README if there is only one repository selected */}
                            </p>
                        </li>
                    </ol>
                </main>
            </div>
        </Dialog>
    )
}

export default EmbedChartGuideDialog
