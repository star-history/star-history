import React, { useState, useEffect } from "react";
import TopBanner from "./TopBanner";
import GitHubStarButton from "./GitHubStarButton";
import TokenSettingDialog from "./TokenSettingDialog";
import Link from "next/link";
import { AppStateProvider, useAppStore } from "../store";

const Header: React.FC = () => {
  const store = useAppStore()
  const [showSetTokenDialog, setShowSetTokenDialog] = useState(false);
  const [headerText, setHeaderText] = useState("Add access token");
  const [state, setState] = useState<State>({
    showDropMenu: false,
    showSetTokenDialog: false,
  });

  interface State {
    showDropMenu: boolean;
    showSetTokenDialog: boolean;
    tokenCache?: string;
  }

  const handleSetTokenBtnClick = () => {
    setShowSetTokenDialog(true);
  };

  const handleToggleDropMenuBtnClick = () => {
    setState((prevState) => ({
      ...prevState,
      showDropMenu: !prevState.showDropMenu,
    }));
  };

  const handleSetTokenDialogClose = () => {
    setShowSetTokenDialog(false);
  };

useEffect(() => {
  setHeaderText(store.token ? "Edit access token" : "Add access token")
}, [store.token]);

  return (
    <>
      {showSetTokenDialog && (
        <TokenSettingDialog
          onClose={handleSetTokenDialogClose}
          tokenCache={false}
        />
      )}

      <AppStateProvider>
        { <TopBanner /> }
        <header className="w-full h-14 shrink-0 flex flex-row justify-center items-center bg-dark text-light">
          <div className="w-full h-full flex flex-row justify-between items-center px-4">
            <div className="h-full bg-dark flex flex-row justify-start items-center">
              <Link href="/" className="header-link px-3">
                <img className="w-7 h-auto" src="/assets/icon.png" alt="Logo" />
              </Link>
              <Link href="/blog" className="header-link text-base">
                <span className="text-white -2">Blog</span>
              </Link>
              <span
                className="header-link cursor-pointer text-white text-base"
                onClick={handleSetTokenBtnClick}
              >
                {headerText}
              </span>
            </div>
            <div className="hidden md:flex flex-row justify-center items-center">
              <Link href="/blog/how-to-use-github-star-history" className="flex flex-row items-center text-base px-2 hover:underline">
                <span className="text-white">📕 How to use this site</span>
              </Link>
            </div>
            <div className="h-full hidden md:flex flex-row justify-end items-center space-x-2">
              <a className="header-link" href="https://twitter.com/StarHistoryHQ" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter text-2xl text-blue-300"></i>
              </a>
              <a className="header-link" href="https://rss.beehiiv.com/feeds/BbNzf9ozGZ.xml" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-rss text-2xl text-orange-400"></i>
              </a>
              <GitHubStarButton />
            </div>

            <div className="h-full flex md:hidden flex-row justify-end items-center">
              <span
                className="relative h-full w-10 px-3 flex flex-row justify-center items-center cursor-pointer font-semibold text-light hover:bg-zinc-800"
                onClick={handleToggleDropMenuBtnClick}
              >
                <span className={`w-4 transition-all h-px bg-light absolute top-1/2 ${state.showDropMenu ? "w-6 rotate-45" : "-mt-1"}`}></span>
                <span className={`w-4 transition-all h-px bg-light absolute top-1/2 ${state.showDropMenu ? "hidden" : ""}`}></span>
                <span className={`w-4 transition-all h-px bg-light absolute top-1/2 ${state.showDropMenu ? "w-6 -rotate-45" : "mt-1"}`}></span>
              </span>
            </div>
          </div>
        </header>
        <div className={`w-full h-auto py-2 flex md:hidden flex-col justify-start items-start shadow-lg border-b ${state.showDropMenu ? "flex" : "hidden"}`}>
          <span
            className="h-12 px-3 text-base w-full flex flex-row justify-start items-center cursor-pointer font-semibold text-dark mr-2 hover:bg-gray-100 hover:text-blue-500"
            onClick={handleSetTokenBtnClick}
          >
            {headerText}
          </span>
          <span className="h-12 text-base px-3 w-full flex flex-row justify-start items-center">
            <a
              className="github-button -mt-1"
              href="https://github.com/star-history/star-history"
              data-show-count="true"
              aria-label="Star star-history/star-history on GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              Star
            </a>
          </span>
        </div>
      </AppStateProvider>
    </>
  );
};

export default Header;
