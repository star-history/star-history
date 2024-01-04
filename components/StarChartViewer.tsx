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


function StarChartViewer() {
  const store = useAppStore()


 const [state, setState] = useState({
   chartMode: 'Date',
   repoCacheMap: new Map(),
   chartData: [],
   isGeneratingImage: false,
   showSetTokenDialog: false,
   showGenEmbedCodeDialog: false,
   showEmbedChartGuideDialog: false,
 });

 const containerElRef = useRef(null);


  useEffect(() => {
    const repos = store.repos
    if (Array.isArray(repos) && repos.length > 0) {
      if (Array.isArray(repos) && repos.length > 0) {
        repos.forEach(repoObj => fetchReposData(repoObj));
      }    }
  }, [store.repos]);

 
  const fetchReposData = async (repo: string) => {
    try {
     store.actions.setIsFetching(true);
     const response = await fetch(`https://api.github.com/repos/${repo}`);
     const data = await response.json();
     console.log(data)
     setState((prevState) => ({ ...prevState, chartData: data }));
     store.actions.setIsFetching(false);
    } catch (error) {
     console.error("Error:", error);
     store.actions.setIsFetching(false);
    }
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


const handleExportAsCSVBtnClick = async () => {
    const rows = await state.chartData;

    let csvContent = "data:text/csv;charset=utf-8,";

    if (!rows || !rows.length) {
      console.error("No chart data available");
      return;
    }

    // Get the headers
    const headers = Object.keys(rows[0]).join(",") + "\n";
    csvContent += headers;

    // Loop through the rows and add them to the CSV content
    for (let row of rows) {
      const values = Object.values(row).join(",");
      csvContent += values + "\n";
    }

    // Create a link element
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for Firefox

    // Simulate click
    link.click();

    // Remove the link
    document.body.removeChild(link);
  };


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
 {state.chartData && state.chartData.length > 0 && (
 <StarXYChart
   classname="w-full h-auto mt-4"
   data={{ datasets: state.chartData }}
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
  );
}

export default StarChartViewer;
