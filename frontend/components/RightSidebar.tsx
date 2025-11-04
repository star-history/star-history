/* eslint-disable @next/next/no-img-element */
import React from "react"
import { randomSponsors } from "../helpers/sponsor"

const RightSidebar: React.FC = () => {
    return (
        <div className="sticky top-4 flex flex-col justify-start items-start w-full h-fit">
            {/* Sponsors Section */}
            <div className="w-full px-2 pt-4 flex flex-col justify-start items-start">
                {randomSponsors.map((sponsor) => (
                    <a
                        key={sponsor.name}
                        href={sponsor.link}
                        className="bg-gray-50 p-2 rounded w-full flex flex-col justify-center items-center mb-2 text-zinc-600 hover:opacity-80 hover:text-blue-600 hover:underline"
                        target="_blank"
                    >
                        <img className="w-auto max-w-full" src={sponsor.logo} alt={sponsor.name} />
                        <span className="text-xs mt-2">{sponsor.logoSlogan}</span>
                    </a>
                ))}
                <a
                    href="mailto:star@bytebase.com?subject=I'm interested in sponsoring star-history.com"
                    target="_blank"
                    className="w-full p-2 text-center bg-gray-50 text-xs leading-6 text-gray-400 rounded hover:underline hover:text-blue-600"
                >
                    📨 Promote your project
                </a>

                {/* Newsletter Subscribe Button */}
                <a
                    href="https://newsletter.star-history.com/subscribe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-4 p-3 text-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors"
                >
                    Subscribe to Newsletter
                </a>
            </div>
        </div>
    )
}

export default RightSidebar
