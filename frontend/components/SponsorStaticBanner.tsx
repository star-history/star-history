/* eslint-disable @next/next/no-img-element */
import { useState } from "react"
import { randomSponsors } from "../helpers/sponsor"
import { FaTimes } from "react-icons/fa"

export default function SponsorStaticBanner() {
    const [hideModal, setHideModal] = useState(false)

    return (
        <div className={`fixed right-0 top-16 hidden lg:flex flex-col justify-start items-start transition-all bg-white w-48 xl:w-56 p-2 z-10 ${hideModal ? "!hidden" : ""}`}>
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
                Your logo
            </a>
        </div>
    )
}
