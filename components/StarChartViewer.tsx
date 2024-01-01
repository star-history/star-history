import { useState, useEffect, useRef, useMemo } from "react";
import {useAppStore} from "../store";
import { XYChartData } from "../packages/xy-chart";
import utils from "../common/utils";
import { convertDataToChartData, getRepoData } from "../common/chart";
import api from "../common/api";
import toast from "../helpers/toast";
import { RepoData } from "../types/chart";
import BytebaseBanner from "./SponsorView";
import StarXYChart from "./Charts/StarXYChart";
import TokenSettingDialog from "./TokenSettingDialog";
import GenerateEmbedCodeDialog from "./GenerateEmbedCodeDialog";
import EmbedMarkdownSection from "./EmbedMarkdownSection";
import EmbedChartGuideDialog from "./EmbedChartGuideDialog";

interface State {
  chartMode: "Date" | "Timeline";
  repoCacheMap: Map<
    string,
    {
      starData: {
        date: string;
        count: number;
      }[];
      logoUrl: string;
    }
  >;
  chartData: XYChartData | undefined;
  isGeneratingImage: boolean;
  showSetTokenDialog: boolean;
  showGenEmbedCodeDialog: boolean;
  showEmbedChartGuideDialog: boolean;
}

const StarHistory = () => {
  
  const [embedCode, setEmbedCode] = useState(""); 


  const [state, setState] = useState<State>({
    chartMode: "Date",
    repoCacheMap: new Map(),
    chartData: undefined,
    isGeneratingImage: false,
    showSetTokenDialog: false,
    showGenEmbedCodeDialog: false,
    showEmbedChartGuideDialog: false,
  });
  const store = useAppStore();
  const containerElRef = useRef<HTMLDivElement | null>(null);

  const isFetching = useMemo(() => {
    return store.isFetching;
  }, [store.isFetching]);

  const chartMode = useMemo(() => {
    return store.chartMode;
  }, [store.chartMode]);

  useEffect(() => {
    if (store.repos.length > 0) {
      fetchReposData(store.repos);
    }
  }, [store.repos]);

  useEffect(() => {
    fetchReposData(store.repos);
  }, [store.repos]);

  const fetchReposData = async (repos: string[]) => {
    store.isFetching(true);
    const notCachedRepos: string[] = [];
    for (const repo of repos) {
      const cachedRepo = state.repoCacheMap.get(repo);
      if (!cachedRepo) {
        notCachedRepos.push(repo);
      }
    }
    try {
      const data = await getRepoData(notCachedRepos, store.token);
      for (const { repo, starRecords, logoUrl } of data) {
        state.repoCacheMap.set(repo, {
          starData: starRecords,
          logoUrl,
        });
      }
    } catch (error: any) {
      toast.warn(error.message);
      if (error.status === 401 || error.status === 403) {
        setState((prevState) => ({
          ...prevState,
          showSetTokenDialog: true,
        }));
      } else if (error.status === 404 || error.status === 501) {
        store.delRepo(error.repo);
      }
    }
    store.isFetching(false);
    const repoData: RepoData[] = [];
    for (const repo of repos) {
      const cachedRepo = state.repoCacheMap.get(repo);
      if (cachedRepo) {
        repoData.push({
          repo,
          starRecords: cachedRepo.starData,
          logoUrl: cachedRepo.logoUrl,
        });
      }
    }
    if (repoData.length === 0) {
      setState((prevState) => ({
        ...prevState,
        chartData: undefined,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        chartData: convertDataToChartData(repoData, chartMode),
      }));
    }
  };

  const handleCopyLinkBtnClick = async () => {
    await utils.copyTextToClipboard(window.location.href);
    toast.succeed("Link copied");
  };

  const handleGenerateImageBtnClick = async () => {
    if (state.isGeneratingImage) {
      return;
    }
    const svgElement = containerElRef.current
      ?.querySelector("svg")
      ?.cloneNode(true) as SVGSVGElement;
    svgElement
      ?.querySelectorAll(".chart-tooltip-dot")
      ?.forEach((d) => d.remove());

    // convert images from url href to data url href
    for (const i of Array.from(svgElement.querySelectorAll("image"))) {
      const url = i.getAttribute("href");
      if (url) {
        const dataUrl = await utils.getBase64Image(url);
        i.setAttribute("href", dataUrl);
      }
    }

    svgElement.setAttribute("class", "fixed -z-10");
    document.body.append(svgElement);

    if (!svgElement || !containerElRef.current) {
      toast.warn("Chart element not found, please try later");
      return;
    }

    setState((prevState) => ({
      ...prevState,
      isGeneratingImage: true,
    }));

    let destoryGeneratingToast = () => {
      // do nth
    };

    setTimeout(() => {
      if (state.isGeneratingImage) {
        const cbs = toast.warn(
          `<i class="fas fa-spinner animate-spin text-2xl mr-3"></i>Generating image`,
          -1
        );
        destoryGeneratingToast = cbs.destroy;
      }
    }, 2000);

    try {
      // Get image's width and height from the container, because the svg's width is set to 100%
      const { width: imgWidth, height: imgHeight } =
        containerElRef.current.getBoundingClientRect();

      const canvas = document.createElement("canvas");
      const scale = Math.floor(window.devicePixelRatio * 2);
      canvas.width = (imgWidth + 20) * scale;
      canvas.height = (imgHeight + 30) * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.warn("Get canvas context failed.");
        return;
      }

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw chart image
      const chartDataURL = utils.convertSVGToDataURL(svgElement);
      const chartImage = new Image();
      chartImage.src = chartDataURL;
      await utils.waitImageLoaded(chartImage);

      ctx.drawImage(
        chartImage,
        10 * scale,
        10 * scale,
        imgWidth * scale,
        imgHeight * scale
      );

      const link = document.createElement("a");
      link.download = `star-history-${utils.getDateString(
        Date.now(),
        "yyyyMMdd"
      )}.png`;
      link.href = canvas.toDataURL();
      link.click();

      setState((prevState) => ({
        ...prevState,
        isGeneratingImage: false,
      }));

      destoryGeneratingToast();
      toast.succeed("Image Downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Generate image failed");
    }

    svgElement.remove();
  };

  
  const handleExportAsCSVBtnClick = () => {
    let CSVContent = "";
    for (const repo of store.repos) {
      const records = state.repoCacheMap.get(repo)?.starData;
      if (records) {
        const temp: any[] = [];
        for (const i of records) {
          temp.push([repo, new Date(i.date), i.count]);
        }
        CSVContent += temp
          .map((item) =>
            typeof item === "string" && item.indexOf(",") >= 0
              ? `"${item}"`
              : String(item)
          )
          .join("\n");
        CSVContent += "\n";
      }
    }

    const encodedUri = encodeURI(
      "data:text/csv;charset=utf-8," + CSVContent
    );
    const link = document.createElement("a");
    link.download = `star-history-${utils.getDateString(
      Date.now(),
      "yyyyMMdd"
    )}.csv`;
    link.href = encodedUri;
    link.click();

    toast.succeed("CSV Downloaded");
  };

  const handleShareToTwitterBtnClick = async () => {
    const repos = store.repos;
    if (repos.length === 0) {
      toast.error("No repo found");
      return;
    }

    const starhistoryLink = encodeURIComponent(window.location.href);
    let text = "";

    if (repos.length === 1) {
      const repo = repos[0];
      let starCount = 0;

      try {
        starCount = await api.getRepoStargazersCount(repo, store.token);
      } catch (error) {
        // do nth
      }

      let starText = "";
      if (starCount > 0) {
        starText = `${
          (starCount < 1000
            ? starCount
            : (starCount / 1000).toFixed(1) + "K") + " ⭐️ "
        }`;
      }

      text = `${starText}Thank you! 🙏%0A${starhistoryLink}%0A%0A`;
    } else {
      text = repos.join(" vs ") + "%0A%0A";
    }

    const addtionLink =
      repos.length === 1 ? `github.com/${repos[0]}` : starhistoryLink;
    text += `${addtionLink}%0A%0A`;
    text += `${encodeURIComponent("#starhistory #GitHub #OpenSource ")}`;

    const tweetShareLink = `https://twitter.com/intent/tweet?text=${text}%0A&via=StarHistoryHQ`;
    const link = document.createElement("a");
    link.href = tweetShareLink;
    link.target = "_blank";
    link.click();
  };

  const handleGenEmbedCodeDialogBtnClick = () => {
    setState((prevState) => ({
      ...prevState,
      showGenEmbedCodeDialog: true,
    }));
  };

  const handleGenEmbedCodeDialogClose = () => {
    setState((prevState) => ({
      ...prevState,
      showGenEmbedCodeDialog: false,
    }));
  };

  const handleToggleChartBtnClick = () => {
    store.chartMode(chartMode === "Date" ? "Timeline" : "Date");
    fetchReposData(store.repos);
  };

  const handleSetTokenDialogClose = () => {
    setState((prevState) => ({
      ...prevState,
      showSetTokenDialog: false,
    }));
  };

  return (
    <>
      <div
        ref={containerElRef}
        className="relative w-full h-auto min-h-400px self-center max-w-3xl 2xl:max-w-4xl sm:p-4 pt-0"
      >
        {isFetching && (
          <div className="absolute w-full h-full flex justify-center items-center z-10 top-0">
            <div className="absolute w-full h-full blur-md bg-white bg-opacity-80"></div>
            <i className="fas fa-spinner animate-spin text-4xl z-10"></i>
          </div>
        )}

        {state.chartData && (
          <div className="absolute top-0 right-1 p-2 flex flex-row">
            <div className="flex flex-row justify-center items-center rounded leading-8 text-sm px-3 cursor-pointer z-10 text-dark select-none hover:bg-gray-100">
              <input
                className="mr-2"
                type="checkbox"
                checked={chartMode === "Timeline"}
              />
              Align timeline
            </div>
          </div>
        )}

        {state.chartData && (
          <StarXYChart
            classname="w-full h-auto mt-4"
            data={state.chartData}
            chart-mode={chartMode}
          />
        )}
      </div>

      {state.chartData && (
        <div className="relative mt-4 mb-4 w-full px-3 mx-auto max-w-4xl flex flex-row flex-wrap justify-between items-center">
          <div className="flex flex-row justify-start items-center mb-2">
            <a
              className="h-full flex flex-row justify-center items-center leading-8 hover:opacity-80 underline underline-offset-2 mb-2 decoration-dark"
              href="https://chrome.google.com/webstore/detail/iijibbcdddbhokfepbblglfgdglnccfn"
              target="_blank"
            >
              <img className="w-5 h-auto mr-1" src="/icons/free.svg" />
              <span className="text-dark">Get Chrome Extension</span>
            </a>
          </div>

          <div className="flex flex-row flex-wrap justify-end items-center mb-2">
            <button
              className={`ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200 ${
                state.isGeneratingImage ? "bg-gray-200 cursor-wait" : ""
              }`}
              onClick={handleGenerateImageBtnClick}
            >
              <i className="fas fa-download"></i>
              Image
            </button>

            <button
              className="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200"
              onClick={handleExportAsCSVBtnClick}
            >
              <i className="fas fa-download"></i>
              CSV
            </button>

            <button
              className="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200"
              onClick={handleGenEmbedCodeDialogBtnClick}
            >
              <i className="fas fa-code"></i>
              Embed
            </button>

            <button
              className="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200"
              onClick={handleCopyLinkBtnClick}
            >
              <i className="far fa-copy"></i>
              Link
            </button>

            <button
              className="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-600 border border-transparent text-white hover:bg-green-700"
              onClick={handleShareToTwitterBtnClick}
            >
              <i className="relative -bottom-px fab fa-twitter"></i>
              Share on Twitter
            </button>
          </div>
        </div>
      )}

      {state.chartData && <EmbedMarkdownSection />}

      <div className="grow"></div>

      <div className="mb-12">
        <iframe
          src="https://embeds.beehiiv.com/2803dbaa-d8dd-4486-8880-4b843f3a7da6?slim=true"
          data-test-id="beehiiv-embed"
          height="52"
          frameBorder="0"
          scrolling="no"
          style={{
            margin: 0,
            borderRadius: "0px !important",
            backgroundColor: "transparent",
          }}
        ></iframe>
      </div>

      {state.chartData && <BytebaseBanner />}

      {state.showSetTokenDialog && (
        <TokenSettingDialog onClose={handleSetTokenDialogClose} tokenCache={true} />        
              )}

      {state.showGenEmbedCodeDialog && (
        <GenerateEmbedCodeDialog show={state.showGenEmbedCodeDialog} onClose={handleGenEmbedCodeDialogClose} />
)}

{state.showEmbedChartGuideDialog && (
  <EmbedChartGuideDialog
    show={state.showEmbedChartGuideDialog}
    embedCode={embedCode}
    onClose={() => setState({ ...state, showEmbedChartGuideDialog: false })}
  />
)}
    </>
  );
};

export default StarHistory;
