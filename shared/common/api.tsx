import axios from "axios"
import utils from "./utils"

const API_PER_PAGE = 30  // GitHub star history API max weeks per request
const DAY_MS = 24 * 60 * 60 * 1000
const REQUEST_TIMEOUT_MS = 15000  // 15s timeout for GitHub API calls

interface StarHistoryWeek {
    week: number
    total: number
    days: number[]
}

function getLinkedPage(link: string, relation: string): number | undefined {
    for (const part of link.split(",")) {
        const match = /<([^>]+)>;\s*rel="([^"]+)"/.exec(part)
        if (match?.[2] === relation) {
            const page = Number(new URL(match[1]).searchParams.get("page"))
            if (Number.isInteger(page) && page > 0) return page
        }
    }
}

namespace api {
    export async function getRepoStarHistory(repo: string, token?: string, page = 1) {
        return axios.get<StarHistoryWeek[]>(`https://api.github.com/repos/${repo}/stargazers/history?per_page=${API_PER_PAGE}&page=${page}`, {
            headers: {
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2026-03-10",
                Authorization: token ? `token ${token}` : ""
            },
            timeout: REQUEST_TIMEOUT_MS,
        })
    }

    export async function getRepoStargazersCount(repo: string, token?: string) {
        const { data } = await axios.get(`https://api.github.com/repos/${repo}`, {
            headers: {
                Accept: "application/vnd.github.v3.star+json",
                Authorization: token ? `token ${token}` : ""
            },
            timeout: REQUEST_TIMEOUT_MS,
        })

        return data.stargazers_count
    }

    export async function getRepoStarRecords(repo: string, token: string, maxConcurrentRequests: number) {
        let response = await getRepoStarHistory(repo, token)
        const weeks = [...response.data]
        const concurrency = Number.isFinite(maxConcurrentRequests) ? Math.max(1, Math.floor(maxConcurrentRequests)) : 1

        // Every page is required: these buckets contain increments, not cumulative totals.
        // Bound concurrency instead of sampling pages and silently dropping stars.
        let nextPage = getLinkedPage(response.headers["link"] || "", "next")
        while (nextPage !== undefined) {
            if (nextPage > 100) throw new Error("GitHub star history exceeds the API pagination limit")
            const lastPage = getLinkedPage(response.headers["link"] || "", "last") || nextPage
            const pages = utils.range(nextPage, Math.min(lastPage, nextPage + concurrency - 1, 100))
            const responses = await Promise.all(pages.map((page) => getRepoStarHistory(repo, token, page)))
            responses.forEach(({ data }) => weeks.push(...data))
            response = responses[responses.length - 1]
            nextPage = getLinkedPage(response.headers["link"] || "", "next")
        }

        const starRecords: { date: string; count: number }[] = []
        let count = 0
        const now = Date.now()
        // Pages and weeks are newest first; days within each week start on Sunday.
        weeks.reverse().forEach((week) => {
            week.days.forEach((stars, day) => {
                const timestamp = week.week * 1000 + day * DAY_MS
                if (timestamp > now) return
                count += stars
                // Do not move the timeline's origin back before the first star.
                if (count > 0) starRecords.push({ date: utils.getDateString(timestamp), count })
            })
        })

        if (starRecords.length === 0) {
            throw { status: response.status, data: [] }
        }

        const starAmount = await getRepoStargazersCount(repo, token)
        starRecords.push({ date: utils.getDateString(now), count: starAmount })
        return starRecords
    }

    export async function getRepoLogoUrl(repo: string, token?: string): Promise<string> {
        const owner = repo.split("/")[0]
        const { data } = await axios.get(`https://api.github.com/users/${owner}`, {
            headers: {
                Accept: "application/vnd.github.v3.star+json",
                Authorization: token ? `token ${token}` : ""
            },
            timeout: REQUEST_TIMEOUT_MS,
        })

        return data.avatar_url
    }
}

export default api
