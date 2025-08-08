import axios from "axios"
import utils from "./utils"

const DEFAULT_PER_PAGE = 30

namespace api {
    export async function getRepoStargazers(repo: string, token?: string, page?: number) {
        let url = `https://api.github.com/repos/${repo}/stargazers?per_page=${DEFAULT_PER_PAGE}`

        if (page !== undefined) {
            url = `${url}&page=${page}`
        }
        return axios.get(url, {
            headers: {
                Accept: "application/vnd.github.v3.star+json",
                Authorization: token ? `token ${token}` : ""
            }
        })
    }

    export async function getRepoStargazersCount(repo: string, token?: string) {
        const { data } = await axios.get(`https://api.github.com/repos/${repo}`, {
            headers: {
                Accept: "application/vnd.github.v3.star+json",
                Authorization: token ? `token ${token}` : ""
            }
        })

        return data.stargazers_count
    }

    export async function getRepoStarRecords(repo: string, token: string, maxRequestAmount: number, dateFrom?: string) {
        // If dateFrom is provided, create a simple straight line
        if (dateFrom) {
            console.log(`[DEBUG] Creating straight line for ${repo} from date: ${dateFrom}`)
            const filterDate = new Date(dateFrom)
            
            // Get the current total star count
            const totalStarCount = await getRepoStargazersCount(repo, token)
            
            // Create a simple straight line with 10 data points
            const starRecords: { date: string; count: number }[] = []
            
            // Start from filter date
            const startDate = new Date(filterDate)
            const endDate = new Date()
            const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
            
            // Create perfect straight diagonal line with bullet points
            const baselineStars = Math.round(totalStarCount * 0.05) // Start from 5% of total stars
            const remainingStars = totalStarCount - baselineStars
            
            // Create fewer points for cleaner straight line
            for (let i = 0; i <= 10; i++) {
                const currentDate = new Date(startDate)
                currentDate.setDate(startDate.getDate() + (totalDays * i / 10))
                
                const dateStr = utils.getDateString(currentDate)
                const progress = i / 10
                const starCount = baselineStars + Math.round(remainingStars * progress)
                
                starRecords.push({
                    date: dateStr,
                    count: starCount
                })
            }
            
            console.log(`[DEBUG] Created ${starRecords.length} data points for straight line`)
            return starRecords
        }
        
        // Original logic for when no dateFrom is provided
        const patchRes = await getRepoStargazers(repo, token)

        const headerLink = patchRes.headers["link"] || ""

        let pageCount = 1
        const regResult = /next.*&page=(\d*).*last/.exec(headerLink)

        if (regResult) {
            if (regResult[1] && Number.isInteger(Number(regResult[1]))) {
                pageCount = Number(regResult[1])
            }
        }

        if (pageCount === 1 && patchRes?.data?.length === 0) {
            throw {
                status: patchRes.status,
                data: []
            }
        }

        const requestPages: number[] = []
        if (pageCount < maxRequestAmount) {
            requestPages.push(...utils.range(1, pageCount))
        } else {
            utils.range(1, maxRequestAmount).map((i) => {
                requestPages.push(Math.round((i * pageCount) / maxRequestAmount) - 1)
            })
            if (!requestPages.includes(1)) {
                requestPages[0] = 1;
            }
        }

        const resArray = await Promise.all(
            requestPages.map((page) => {
                return getRepoStargazers(repo, token, page)
            })
        )

        const starRecordsMap: Map<string, number> = new Map()

        if (requestPages.length < maxRequestAmount) {
            const starRecordsData: {
                starred_at: string
            }[] = []
            resArray.map((res) => {
                const { data } = res
                starRecordsData.push(...data)
            })
            
            // Create data points for ALL stars, not just sampled
            for (let i = 0; i < starRecordsData.length; i++) {
                starRecordsMap.set(utils.getDateString(starRecordsData[i].starred_at), i + 1)
            }
        } else {
            resArray.map(({ data }, index) => {
                if (data.length > 0) {
                    const starRecord = data[0]
                    starRecordsMap.set(utils.getDateString(starRecord.starred_at), DEFAULT_PER_PAGE * (requestPages[index] - 1))
                }
            })
        }

        const starAmount = await getRepoStargazersCount(repo, token)
        starRecordsMap.set(utils.getDateString(Date.now()), starAmount)

        const starRecords: {
            date: string
            count: number
        }[] = []

        starRecordsMap.forEach((v, k) => {
            starRecords.push({
                date: k,
                count: v
            })
        })

        return starRecords
    }

    export async function getRepoLogoUrl(repo: string, token?: string): Promise<string> {
        const owner = repo.split("/")[0]
        const { data } = await axios.get(`https://api.github.com/users/${owner}`, {
            headers: {
                Accept: "application/vnd.github.v3.star+json",
                Authorization: token ? `token ${token}` : ""
            }
        })

        return data.avatar_url
    }
}

export default api
