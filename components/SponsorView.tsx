import { randomSponsors } from "../helpers/sponsor";

const SponsorView = () => {
  return (
    <div className="w-full px-3 max-w-3xl mx-auto flex flex-col justify-center items-center text-center">
      <div className="w-full mb-6 flex flex-col justify-center items-center">
        <p className="mb-2 text-sm text-gray-600">
          <a
            className="text-blue-500 hover:opacity-80 underline"
            href={randomSponsors[0].link}
            target="_blank"
          >
            {randomSponsors[0].name}
          </a>
          - {randomSponsors[0].slogan}
        </p>
        <a
          className="hover:opacity-80"
          href={randomSponsors[0].link}
          target="_blank"
        >
          <img
            className="w-auto max-w-full"
            src={randomSponsors[0].landingImage}
            alt={randomSponsors[0].name}
          />
        </a>
      </div>
    </div>
  );
};

export default SponsorView;