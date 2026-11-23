import axios from "axios"
import utils from "./utils"

const REQUEST_TIMEOUT_MS = 15000  // 15s timeout for GitHub API calls
const HISTORY_DAYS_PER_WEEK = 7  // stargazers/history returns one record per week with 7 daily counts
const MS_PER_DAY = 24 * 60 * 60 * 1000
const MAX_STAR_RECORD_POINTS = 20  // official charts sample each repo down to ~20 points
const ZERO_POINT_CREATED_AT_DAYS = 30  // start at repo creation when the first stars came within 30 days

interface StarHistoryWeek {
    week: number  // unix timestamp (seconds) of the week start (UTC Sunday)
    total: number  // stars gained during the week
    days: number[]  // 7 daily star counts
}

interface DailyStarCount {
    timestamp: number
    count: number
}

function getLastPage(linkHeader: string | undefined, page: number): number {
    if (!linkHeader) {
        return page
    }

    const match = /[?&]page=(\d+)[^>]*>;\s*rel="last"/.exec(linkHeader)
    if (match && Number.isInteger(Number(match[1]))) {
        return Number(match[1])
    }

    return page
}

function flattenHistoryWeeks(weeks: StarHistoryWeek[]): DailyStarCount[] {
    const sortedWeeks = [...weeks].sort((w1, w2) => w1.week - w2.week)
    const daily: DailyStarCount[] = []

    for (const week of sortedWeeks) {
        for (let i = 0; i < HISTORY_DAYS_PER_WEEK; i++) {
            daily.push({
                timestamp: week.week * 1000 + i * MS_PER_DAY,
                count: week.days[i] || 0,
            })
        }
    }

    return daily
}

namespace api {
    export async function getRepoInfo(repo: string, token?: string) {
        const { data } = await axios.get(`https://api.github.com/repos/${repo}`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: token ? `token ${token}` : ""
            },
            timeout: REQUEST_TIMEOUT_MS,
        })

        return {
            createdAt: data.created_at as string,
            stargazersCount: data.stargazers_count as number,
        }
    }

    export async function getRepoStargazersCount(repo: string, token?: string) {
        const { stargazersCount } = await getRepoInfo(repo, token)
        return stargazersCount
    }

    export async function getRepoStarHistoryPage(repo: string, token: string, page: number) {
        const res = await axios.get<StarHistoryWeek[]>(`https://api.github.com/repos/${repo}/stargazers/history`, {
            params: { page },
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: token ? `token ${token}` : ""
            },
            timeout: REQUEST_TIMEOUT_MS,
        })

        return {
            weeks: res.data,
            lastPage: getLastPage(res.headers["link"], page),
        }
    }

    export async function getRepoStarRecords(repo: string, token: string, maxRequestAmount: number) {
        const [repoInfo, firstPage] = await Promise.all([
            getRepoInfo(repo, token),
            getRepoStarHistoryPage(repo, token, 1),
        ])

        if (repoInfo.stargazersCount === 0) {
            throw {
                status: 200,
                data: []
            }
        }

        const weeks = [...firstPage.weeks]
        const restPages = utils.range(2, firstPage.lastPage)
        // Fetch in batches so a repo with a long history doesn't fire all requests at once.
        for (let i = 0; i < restPages.length; i += maxRequestAmount) {
            const batch = await Promise.all(
                restPages.slice(i, i + maxRequestAmount).map((page) => getRepoStarHistoryPage(repo, token, page))
            )
            for (const page of batch) {
                weeks.push(...page.weeks)
            }
        }

        // The current week also contains the remaining days, drop them so the
        // series never runs past today.
        const todayTimestamp = Math.floor(Date.now() / MS_PER_DAY) * MS_PER_DAY
        const daily = flattenHistoryWeeks(weeks).filter((day) => day.timestamp <= todayTimestamp)
        const starRecords: {
            date: string
            count: number
        }[] = []

        if (daily.length > 0) {
            const cumulative: number[] = []
            let sum = 0
            for (const day of daily) {
                sum += day.count
                cumulative.push(sum)
            }

            const firstStarIndex = Math.max(cumulative.findIndex((count) => count > 0), 0)
            const endIndex = cumulative.length - 1

            // Start the curve at zero like the official chart: at the repo's creation
            // date when the first stars arrived soon after, otherwise the day before
            // the first star to avoid a long flat line.
            const firstStarTimestamp = daily[firstStarIndex].timestamp
            const dayBeforeFirstStar = firstStarTimestamp - MS_PER_DAY
            const createdAtTimestamp = Date.parse(repoInfo.createdAt)
            const zeroPointTimestamp = Math.min(
                dayBeforeFirstStar - createdAtTimestamp <= ZERO_POINT_CREATED_AT_DAYS * MS_PER_DAY
                    ? createdAtTimestamp
                    : dayBeforeFirstStar,
                dayBeforeFirstStar
            )
            starRecords.push({
                date: new Date(zeroPointTimestamp).toISOString(),
                count: 0
            })

            // Sample the daily cumulative series down to a readable amount of points.
            const sampleCount = Math.min(
                Math.max(1, MAX_STAR_RECORD_POINTS - starRecords.length - 1),
                endIndex - firstStarIndex + 1
            )
            for (let i = 0; i < sampleCount; i++) {
                const index = firstStarIndex + Math.round((i * (endIndex - firstStarIndex)) / Math.max(sampleCount - 1, 1))
                starRecords.push({
                    date: new Date(daily[index].timestamp).toISOString(),
                    count: cumulative[index]
                })
            }
        }

        // The history endpoint only reports gained stars, so anchor the final point
        // to the live star count to also cover unstars and today's stars.
        starRecords.push({
            date: new Date().toISOString(),
            count: repoInfo.stargazersCount
        })

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