import React, { useState, useEffect } from "react";
import TopBanner from "./TopBanner";
import GitHubStarButton from "./GitHubStarButton";
import TokenSettingDialog from "./TokenSettingDialog";
import Link from "next/link";
import { AppStateProvider, useAppStore } from "../store";

const SketchLightBulbIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="xkcdify-bulb" filterUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" />
        <feDisplacementMap scale="3" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="noise" />
      </filter>
    </defs>
    <g filter="url(#xkcdify-bulb)">
      {/* Bulb glass */}
      <path
        d="M12 2C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17h8v-2.3c1.8-1.2 3-3.3 3-5.7 0-3.9-3.1-7-7-7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Base rings */}
      <path d="M9 19h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Filament */}
      <path d="M10 12L12 8L14 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

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
        {/* { <TopBanner /> } */}
        <header className="w-full h-14 shrink-0 flex flex-row justify-center items-center bg-dark text-light">
          <div className="w-full h-full flex flex-row justify-between items-center px-4">
            <div className="h-full bg-dark flex flex-row justify-start items-center">
              <Link href="/" className="header-link px-3">
                <img className="w-7 h-auto" src="/assets/logo-icon.png" alt="Logo" />
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
                <span className="text-white flex items-center gap-1"><SketchLightBulbIcon /> How to use this site</span>
              </Link>
            </div>
            <div className="h-full hidden md:flex flex-row justify-end items-center px-3">
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
          <span className="h-12 text-base px-3 w-full flex flex-row justify-start items-center text-dark">
            <GitHubStarButton />
          </span>
        </div>
      </AppStateProvider>
    </>
  );
};

export default Header;
