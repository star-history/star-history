import React, { useEffect, useState } from "react"
import axios from "axios"
import { SketchGitHubIcon } from "./SketchIcons"

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
