import { useEffect, useState } from "react"
import storage from "../helpers/storage"
import { useAppStore } from "../store"
import Dialog from "./Dialog"
import { FaTimesCircle } from "react-icons/fa"

interface TokenSettingDialogProps {
    onClose: () => void
    tokenCache?: boolean
    show?: boolean
}

export default function TokenSettingDialog({ onClose, tokenCache }: TokenSettingDialogProps) {
    const store = useAppStore()
    const [token, setToken] = useState(store.token)
    const [hasToken, setHasToken] = useState(!!store.token)

    useEffect(() => {
        setHasToken(!!(tokenCache || store.token))
        if (!hasToken && token === "") {
            setToken("");
        }
    }, [tokenCache, store.token, hasToken, token])

    const handleSaveTokenBtnClick = () => {
        store.setToken(token);
        storage.set({
            accessTokenCache: token
        });
        setHasToken(true);

        if (onClose) {
            onClose();
        }
    };
    
    
    const handleCloseBtnClick = () => {
        if (onClose) {
            onClose();
        }
    };
    

    return (
        <>
            <Dialog>
                <div className="dialog-panel">
                    <header className="dialog-header">
                        <span className="dialog-title">{hasToken ? "Edit" : "Add"} GitHub Access Token</span>
                        <FaTimesCircle className="dialog-close" onClick={handleCloseBtnClick} />
                    </header>
                    <main className="dialog-body text-base">
                        <p>
                            Star-history uses the GitHub API to retrieve repository metadata. You may see this page because you have hit the{" "}
                            <a className="link" href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api" target="_blank">
                                GitHub API rate limit
                            </a>
                            .
                        </p>
                        <br />
                        <p>
                            Star-history will need your{" "}
                            <a className="link" href="https://github.com/settings/tokens" target="_blank">
                                personal access token
                            </a>{" "}
                            to unlimit it. If you {"don't"} already have one,{" "}
                            <a className="link" href="https://github.com/settings/tokens/new" target="_blank">
                                create one
                            </a>
                            , and paste it into the textbox below (no scope to your personal data is needed).
                        </p>
                        <br />
                        <p className="font-bold">Access Token (will be stored in your local storage)</p>
                        <input value={token} onChange={(e) => setToken(e.target.value)} className="input" type="text" />
                    </main>
                    <footer className="dialog-footer">
                        <button className="btn-primary" onClick={handleSaveTokenBtnClick}>
                            Save
                        </button>
                    </footer>
                </div>
            </Dialog>
        </>
    )
}
