import { ReactElement, useEffect, useMemo } from 'react';
import { useAppStore } from '../store';
import Dialog from './Dialog';
import utils from '../common/utils';
import toast from '../helpers/toast';
import { useState } from 'react';


interface EmbedCodeProps {
  show: boolean;
  onClose: () => void;
  embedCode: string;
}

const StepByStepGuide: React.FC<EmbedCodeProps> = ({ embedCode }): ReactElement => {
  const store = useAppStore();

  const singleRepo = useMemo(() => (store.repos.length === 1 ? store.repos[0] : null), [store.repos]);

  const handleCopyBtnClick = () => {
    utils.copyTextToClipboard(embedCode);
    toast.succeed('Embed markdown code copied');
  };

  const handleCloseBtnClick = () => {
    // Handle close logic here
  };

  return (
    <Dialog>
      <div className="w-160 max-w-full h-auto flex flex-col justify-start items-start bg-white rounded-md">
        <header className="w-full flex flex-row justify-between items-center p-4 pr-5 bg-gray-100 rounded-t-lg">
          <span className="text-2xl">Step-to-step guide</span>
          <i
            className="fas fa-times-circle text-xl text-gray-400 cursor-pointer hover:text-gray-500"
            onClick={handleCloseBtnClick}
          ></i>
        </header>
        <main className="w-full flex flex-col justify-start items-start p-4 pr-5">
          <p className="leading-7">
            It's very easy to add star-history chart into GitHub README, just two steps:
          </p>
          <ol className="list-decimal pl-5 mt-3">
            <li className="mb-2">
              <p>Copy the raw markdown string below</p>
              <div className="relative w-full h-auto border mt-2 px-4 py-3 rounded-md shadow-inner">
                <pre className="font-mono break-all text-gray-600 text-sm whitespace-pre-wrap">{embedCode}</pre>
                <button
                  className="absolute top-2 right-2 px-4 leading-8 text-sm rounded-md bg-green-600 shadow-inner text-white hover:bg-green-700"
                  onClick={handleCopyBtnClick}
                >
                  Copy
                </button>
              </div>
            </li>
            <li className="mb-2">
              <p>
                Paste it into your repo
                {singleRepo ? (
                  <a
                    className="font-mono underline text-blue-600 hover:opacity-80"
                    href={`https://github.com/${singleRepo}/blob/master/README.md`}
                    target="_blank"
                  >
                    README
                  </a>
                ) : (
                  <span className="font-mono">README</span>
                )}
              </p>
            </li>
          </ol>
        </main>
      </div>
    </Dialog>
  );
};

export default StepByStepGuide;
