import { randomSponsors } from "../helpers/sponsor";
import Link from "next/link";

interface BytebaseBannerProps {
  className?: string;
}

const BytebaseBanner: React.FC<BytebaseBannerProps> = ({ className }) => {
  const sponsor = randomSponsors[0];

  return (
    <div
      className={`w-full px-3 max-w-3xl mx-auto flex flex-col justify-center items-center text-center ${className}`}
    >
      <div className="w-full mb-6 flex flex-col justify-center items-center">
        <p className="mb-2 text-sm text-gray-600">
          <Link href={sponsor.link}>
            <span className="text-blue-500 hover:opacity-80 underline">
              {sponsor.name}
            </span>
          </Link>
          - {sponsor.logoSlogan}
        </p>
        <Link href={sponsor.link}>
          <div className="hover:opacity-80">
            <img
              className="w-auto max-w-full"
              src={sponsor.landingImage}
              alt={sponsor.name}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BytebaseBanner;
