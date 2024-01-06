import React, { useState, useEffect, useRef } from 'react';
import StarXYChart from './Charts/StarXYChart';
import TokenSettingDialog from './TokenSettingDialog';
import GenerateEmbedCodeDialog from './GenerateEmbedCodeDialog';
import EmbedMarkdownSection from './EmbedMarkdownSection';
import EmbedChartGuideDialog from './EmbedChartGuideDialog';
import html2canvas from 'html2canvas';
import { Storage } from '../helpers/storage';
import { useAppStore } from 'store';
import { FaSpinner } from "react-icons/fa";
import { XYChartData } from 'packages/xy-chart';
import { convertDataToChartData, getRepoData } from 'common/chart';
import toast from 'helpers/toast';
import { RepoData } from 'types/chart';


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

function StarChartViewer() {
  const store = useAppStore()


 const [state, setState] = useState <State>({
  chartMode: "Date",
  repoCacheMap: new Map(),
  chartData: undefined,
  isGeneratingImage: false,
  showSetTokenDialog: false,
  showGenEmbedCodeDialog: false,
  showEmbedChartGuideDialog: false,
 });

 const containerElRef = useRef(null);


  useEffect(() => {
    // const repos = store.repos
    // if (Array.isArray(repos) && repos.length > 0) {
    //   if (Array.isArray(repos) && repos.length > 0) {
    //     repos.forEach(repoObj => fetchReposData(repoObj));
    //   }    }

      if (store.repos.length > 0) {
        fetchReposData(store.repos);
      }
  }, [store.repos]);

 
  const fetchReposData = async (repo: string) => {
    store.actions.setIsFetching(true)
    const notCachedRepos: string[] = [];
  
    for (const repo of store.repos) {
      const cachedRepo = state.repoCacheMap.get(repo);
  
      if (!cachedRepo) {
        notCachedRepos.push(repo);
      }
    }
  
    try {
      const data = await getRepoData(notCachedRepos, store.token);
     // console.log(data)
      for (const { repo, starRecords, logoUrl } of data) {
        state.repoCacheMap.set(repo, {
          starData: starRecords,
          logoUrl,
        });
      }
      console.log(state)
    } catch (error: any) {
      toast.warn(error.message);
  
      if (error.status === 401 || error.status === 403) {
        state.showSetTokenDialog = true;
      } else if (error.status === 404 || error.status === 501) {
        store.delRepo(error.repo);
      }
    }
    store.actions.setIsFetching(false);
  
    const repoData: RepoData[] = [];
    for (const repo of store.repos) {
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
      state.chartData = undefined;
    } else {
      state.chartData = convertDataToChartData(repoData, store.chartMode.value);
    }
    console.log(state)
   };


   const handleCopyLinkBtnClick = async () => {
    const url = window.location.href; // Replace this with the actual URL you want to copy
    const tempElement = document.createElement('textarea');
    tempElement.value = url;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);
    alert('URL copied to clipboard!');
   };

  const handleGenerateImageBtnClick = async () => {
    const element = document.querySelector("#capture") as HTMLElement;
    if (!element) {
      throw new Error("Element with id 'capture' not found");
    }
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    // Now you can download the image or display it somewhere
  };


// const handleExportAsCSVBtnClick = async () => {
//     const rows = await state.chartData;

//     let csvContent = "data:text/csv;charset=utf-8,";

//     if (!rows || !rows.length) {
//       console.error("No chart data available");
//       return;
//     }

//     // Get the headers
//     const headers = Object.keys(rows[0]).join(",") + "\n";
//     csvContent += headers;

//     // Loop through the rows and add them to the CSV content
//     for (let row of rows) {
//       const values = Object.values(row).join(",");
//       csvContent += values + "\n";
//     }

//     // Create a link element
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "my_data.csv");
//     document.body.appendChild(link); // Required for Firefox

//     // Simulate click
//     link.click();

//     // Remove the link
//     document.body.removeChild(link);
//   };


 const handleShareToTwitterBtnClick = () => {
    const url = window.location.href; // Replace this with the actual URL you want to share
    const text = 'Check out this cool thing I found!'; // Replace this with the actual text you want to share
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank');
   };
   const [showEmbedCodeDialog, setShowEmbedCodeDialog] = useState(false);

   const handleGenEmbedCodeDialogBtnClick = () => {
    setShowEmbedCodeDialog(true);
   };

 const handleGenEmbedCodeDialogClose = () => {
    setShowEmbedCodeDialog(false);
};

const [chartMode, setChartMode] = useState('Date');

const handleToggleChartBtnClick = () => {
 setChartMode(prevMode => prevMode === 'Date' ? 'Timeline' : 'Date');
};
const handleSetTokenDialogClose = () => {
    setState(prevState => ({...prevState, showSetTokenDialog: false}));
   };

  return (
    <>
    <div
      ref={containerElRef}
      className="relative w-full h-auto min-h-400px self-center max-w-3xl 2xl:max-w-4xl sm:p-4 pt-0"
    >
      {store.isFetching && (
        <div className="absolute w-full h-full flex justify-center items-center z-10 top-0">
          <div className="absolute w-full h-full blur-md bg-white bg-opacity-80"></div>
          <FaSpinner className="fas fa-spinner animate-spin text-4xl z-10"/>
        </div>
      )}
      {state.chartData && (
        <div className="absolute top-0 right-1 p-2 flex flex-row">
          <div
            className="flex flex-row justify-center items-center rounded leading-8 text-sm px-3 cursor-pointer z-10 text-dark select-none hover:bg-gray-100"
            onClick={handleToggleChartBtnClick}
          >
            <input
              className="mr-2"
              type="checkbox"
              checked={chartMode === "Timeline"}
            />
            Align timeline
          </div>
        </div>
      )}
 {state.chartData && state.chartData.datasets.length > 0 && (
 <StarXYChart
   classname="w-full h-auto mt-4"
   data={{ datasets: state.chartData.datasets }}
   chart-mode={chartMode}
 />
)}
      {/* ... rest of the JSX here */}
      {state.showSetTokenDialog && (
        <TokenSettingDialog
          onClose={handleSetTokenDialogClose}
          show={state.showSetTokenDialog}
        />
      )}
    </div>

    {state.chartData && state.chartData.datasets.length > 0 && (

    <div>
<div className="relative mt-4 mb-4 w-full px-3 mx-auto max-w-4xl flex flex-row flex-wrap justify-between items-center">
<div className="flex flex-row justify-start items-center mb-2">
  <a className="h-full flex flex-row justify-center items-center leading-8 hover:opacity-80 underline underline-offset-2 mb-2 decoration-dark" href="https://chrome.google.com/webstore/detail/iijibbcdddbhokfepbblglfgdglnccfn" target="_blank">
    <img className="w-5 h-auto mr-1" src="https://star-history.com/icons/free.svg" />
    <span className="text-dark">Get Chrome Extension</span>
  </a>
</div>
<div className="flex flex-row flex-wrap justify-end items-center mb-2">
  <button className="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200" onClick={handleGenerateImageBtnClick}>
    <i className="fas fa-download"></i>
    Image
  </button>

  <button className="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200" onClick={handleGenEmbedCodeDialogBtnClick}>
    <i className="fas fa-code"></i>
    Embed
  </button>
  <button className="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200" onClick={handleCopyLinkBtnClick}>
    <i className="far fa-copy"></i>
    Link
  </button>
  <button className="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-600 border border-transparent text-white hover:bg-green-700" onClick={handleShareToTwitterBtnClick}>
    <i className="relative -bottom-px fab fa-twitter"></i>
    Share on Twitter
  </button>
</div>
</div>
<EmbedMarkdownSection />
<div className="grow"></div>
<div className="mb-12 flex justify-center">
<iframe src="https://embeds.beehiiv.com/2803dbaa-d8dd-4486-8880-4b843f3a7da6?slim=true" data-test-id="beehiiv-embed" height="52" frameBorder="0" scrolling="no" style={{margin: 0, borderRadius: 0, backgroundColor: 'transparent'}}></iframe>
</div>

</div>
)}

</>
  );

}

export default StarChartViewer;
