// TokenSettingDialog.tsx

import { useEffect, useState } from "react";
import storage from "../helpers/storage";
import { useAppStore } from "../store";
import Dialog from "./Dialog";
import { FaTimesCircle } from "react-icons/fa";

interface TokenSettingDialogProps {
    onClose: () => void;
    tokenCache?: boolean;
    show?: boolean;
    onTokenChange?: (token: string) => void;
    onHeaderTextChange?: (text: string) => void;
}

export default function TokenSettingDialog({ onClose, tokenCache, show, onTokenChange, onHeaderTextChange }: TokenSettingDialogProps) {
    const store = useAppStore();
    const [token, setToken] = useState(store.token);
    const [hasToken, setHasToken] = useState(!!store.token);

    useEffect(() => {
        setHasToken(!!(tokenCache || store.token));
    }, [tokenCache, store.token]);

    const handleSaveTokenBtnClick = () => {
        store.setToken(token);
        storage.set({
            accessTokenCache: token,
        });
        setHasToken(true);
        if (onTokenChange) {
            onTokenChange(token);
        }
        if (onHeaderTextChange) {
            onHeaderTextChange(hasToken ? "Edit Access Token" : "Add Access Token");
        }
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
                <div className="max-w-2xl justify-start items-start bg-white rounded-md overflow-hidden">
                    <header className="w-full flex flex-row justify-between items-center p-4 pr-5 bg-gray-100 rounded-t-lg">
                        <span className="text-2xl">{hasToken ? "Edit" : "Add"} GitHub Access Token</span>
                        <FaTimesCircle className="fas fa-times-circle text-xl text-gray-400 cursor-pointer hover:text-gray-500" onClick={handleCloseBtnClick} />
                    </header>
                    <main className="w-full flex flex-col justify-start items-start p-4 pr-5 text-base">
                        <p>
                            Star-history uses the GitHub API to retrieve repository metadata. You may see this page because you have hit the{" "}
                            <a className="text-blue-500" href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api" target="_blank">
                                GitHub API rate limit
                            </a>
                            .
                        </p>
                        <br />
                        <p>
                            Star-history will need your{" "}
                            <a className="text-blue-500" href="https://github.com/settings/tokens" target="_blank">
                                personal access token
                            </a>{" "}
                            to unlimit it. If you don't already have one,{" "}
                            <a className="text-blue-500" href="https://github.com/settings/tokens/new" target="_blank">
                                create one
                            </a>
                            , and paste it into the textbox below (no scope to your personal data is needed).
                        </p>
                        <br />
                        <p className="font-bold">Access Token (will be stored in your local storage)</p>
                        <input value={token} onChange={(e) => setToken(e.target.value)} className="w-full outline-none border mt-2 shadow-inner p-2 rounded-md focus:shadow-focus" type="text" />
                    </main>
                    <footer className="w-full flex flex-row justify-end bg-gray-100 items-center p-4 pr-5 border-t rounded-b-md">
                        <button className="pl-4 pr-4 h-10 rounded-md bg-green-500 shadow-inner text-white text-base hover:bg-green-600" onClick={handleSaveTokenBtnClick}>
                            Save
                        </button>
                    </footer>
                </div>
            </Dialog>
        </>
    );
}
