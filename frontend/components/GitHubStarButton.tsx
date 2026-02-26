import React, { useEffect, useState } from "react"
import axios from "axios"


const SketchGitHubIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="xkcdify-gh" filterUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" />
                <feDisplacementMap scale="3" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="noise" />
            </filter>
        </defs>
        <g filter="url(#xkcdify-gh)">
            <path
                d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.6 3 8.6 7.2 10 .5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.4-3.5-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.8.8.1-.6.3-1.1.6-1.3-2.3-.3-4.8-1.2-4.8-5.2 0-1.1.4-2.1 1-2.8-.1-.3-.5-1.3.1-2.8 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3s1.7.1 2.5.3c1.9-1.3 2.7-1 2.7-1 .6 1.5.2 2.5.1 2.8.6.7 1 1.7 1 2.8 0 4-2.5 4.9-4.8 5.2.4.3.7 1 .7 2v3c0 .3.2.6.7.5 4.2-1.4 7.2-5.4 7.2-10C22.5 6.2 17.8 1.5 12 1.5z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.5"
            />
        </g>
    </svg>
)

const GitHubStarButton = () => {
    const [starCount, setStarCount] = useState<number | null>(null)

    useEffect(() => {
        const getRepoStarCount = async () => {
            try {
                const { data } = await axios.get(`https://api.github.com/repos/star-history/star-history`, {
                    headers: {
                        Accept: "application/vnd.github.v3.star+json",
                        Authorization: ""
                    }
                })
                setStarCount(data.stargazers_count)
            } catch (error) {
                console.error('Failed to fetch GitHub star', error)
            }
        }

        getRepoStarCount()
    }, [])

    return (
        <a
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            href="https://github.com/star-history/star-history"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star star-history/star-history on GitHub"
            style={{ fontFamily: '"xkcd", cursive' }}
        >
            <SketchGitHubIcon />
            {starCount !== null && (
                <span className="text-lg">{starCount.toLocaleString()}</span>
            )}
        </a>
    )
}

export default GitHubStarButton
