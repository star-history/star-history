
import { useState } from "react";
import { randomSponsors } from "../helpers/sponsor";

const SponsorStaticBanner = () => {
  const [hide, setHide] = useState(false);

  const handleCloseButtonClick = () => {
    setHide(true);
  };

  return (
    <div
      className={`fixed right-0 top-32 ${
        hide ? "hidden" : ""
      } fixed right-0 top-32 hidden lg:flex flex-col justify-start items-start transition-all bg-white w-48 xl:w-56 p-2 z-50`}
    >
      <div className="w-full flex flex-row justify-between items-center mb-2">
        <span className="text-xs text-gray-400">Sponsors (random order)</span>
        <i
          className="fas fa-times text-xs text-gray-400 cursor-pointer hover:text-gray-500"
          onClick={handleCloseButtonClick}
        ></i>
      </div>
      {randomSponsors.map((sponsor) => (
        <a
          href={sponsor.link}
          className="bg-gray-50 p-2 rounded w-full flex flex-col justify-center items-center mb-2 text-zinc-600 hover:opacity-80 hover:text-blue-600 hover:underline"
          target="_blank"
          key={sponsor.name}
        >
          <img
            className="w-auto max-w-full"
            src={sponsor.logo}
            alt={sponsor.name}
          />
          <span className="text-xs mt-2">{sponsor.slogan}</span>
        </a>
      ))}
      <a
        href="mailto:star@bytebase.com?subject=I'm interested in sponsoring star-history.com"
        target="_blank"
        className="w-full p-2 text-center bg-gray-50 text-xs leading-6 text-gray-400 rounded hover:underline hover:text-blue-600"
      >
        Your logo
      </a>
    </div>
  );
};

export default SponsorStaticBanner;