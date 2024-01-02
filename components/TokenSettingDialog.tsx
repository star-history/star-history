import { useState } from 'react';
import storage from '../helpers/storage';
import { useAppStore } from '../store';
import Dialog from './Dialog';
import { FaTimesCircle } from 'react-icons/fa';

interface TokenSettingDialogProps {
  onClose: () => void;
  tokenCache?: string;
 show: boolean; //
}

export default function TokenSettingDialog({ onClose, tokenCache }: TokenSettingDialogProps) {
  const [localTokenCache, setLocalTokenCache] = useState(false); // initial value can be whatever you need
  const store = useAppStore();
  const [token, setToken] = useState(store.token);

  const isEditing = tokenCache; // Determine if we are in editing mode

  const handleSaveTokenBtnClick = () => {
    store.setToken(token);
    storage.set({
      accessTokenCache: token,
    });
  };

  const handleCloseBtnClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleButtonClick = () => {
    handleSaveTokenBtnClick();
    onClose();
  };

  return (
    <>
      <Dialog>
        <div className="max-w-2xl justify-start items-start bg-white rounded-md overflow-hidden">
          <header className="w-full flex flex-row justify-between items-center p-4 pr-5 bg-gray-100 rounded-t-lg">
            <span className="text-2xl">
              {isEditing ? 'Edit' : 'Add'} GitHub Access Token
            </span>
            <FaTimesCircle
              className="fas fa-times-circle text-xl text-gray-400 cursor-pointer hover:text-gray-500"
              onClick={handleCloseBtnClick}
            />
          </header>
          <main className="w-full flex flex-col justify-start items-start p-4 pr-5 text-base">
            <p>
              Star-history uses the GitHub API to retrieve repository metadata. You may
              see this page because you have hit the{' '}
              <a
                className="text-blue-500"
                href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api"
                target="_blank"
              >
                GitHub API rate limit
              </a>
              .
            </p>
            <br />
            <p>
              Star-history will need your{' '}
              <a className="text-blue-500" href="https://github.com/settings/tokens" target="_blank">
                personal access token
              </a>{' '}
              to unlimit it. If you don't already have one,{' '}
              <a
                className="text-blue-500"
                href="https://github.com/settings/tokens/new"
                target="_blank"
              >
                create one
              </a>
              , and paste it into the textbox below (no scope to your personal data
              is needed).
            </p>
            <br />
            <p className="font-bold">Access Token (will be stored in your local storage)</p>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full outline-none border mt-2 shadow-inner p-2 rounded-md focus:shadow-focus"
              type="text"
            />
          </main>
          <footer className="w-full flex flex-row justify-end bg-gray-100 items-center p-4 pr-5 border-t rounded-b-md">
            <button
              className="pl-4 pr-4 h-10 rounded-md bg-green-500 shadow-inner text-white text-base hover:bg-green-600"
              onClick={handleButtonClick}
            >
              {isEditing ? 'Save Changes' : 'Add Token'}
            </button>
          </footer>
        </div>
      </Dialog>
    </>
  );
}
