import { randomSponsors } from "../helpers/sponsor";
import Link from 'next/link';

const SponsorView = () => {
  const sponsor = randomSponsors[0];

  return (
    <div className="w-full px-3 max-w-3xl mx-auto flex flex-col justify-center items-center text-center">
      <div className="w-full mb-6 flex flex-col justify-center items-center">
        <p className="mb-2 text-sm text-gray-600">
          <Link href={sponsor.link}>
            <a className="text-blue-500 hover:opacity-80 underline" target="_blank">
              {sponsor.name}
            </a>
          </Link>
          - {sponsor.slogan}
        </p>
        <Link href={sponsor.link}>
          <a className="hover:opacity-80" target="_blank">
            <img className="w-auto max-w-full" src={sponsor.landingImage} alt={sponsor.name} />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default SponsorView;