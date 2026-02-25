/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react"
import { sponsorList, randomSponsors } from "../helpers/sponsor"

const RightSidebar: React.FC = () => {
    const [sponsors, setSponsors] = useState(sponsorList)

    useEffect(() => {
        setSponsors(randomSponsors)
    }, [])

    return (
        <div className="sidebar-sticky items-start">
            <div className="w-full px-2 pt-4 flex flex-col justify-start items-start">
                {sponsors.map((sponsor) => (
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
            </div>
        </div>
    )
}

export default RightSidebar
