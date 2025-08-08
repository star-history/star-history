import axios from "axios"
import utils from "./utils.js"

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
        // If dateFrom is provided, we need to build star history from that date onwards
        if (dateFrom) {
            console.log(`[DEBUG] Fetching data for ${repo} from date: ${dateFrom}`)
            const filterDate = new Date(dateFrom)
            console.log(`[DEBUG] Filter date: ${filterDate.toISOString()}`)
            
            // Get the current total star count
            const totalStarCount = await getRepoStargazersCount(repo, token)
            console.log(`[DEBUG] Total star count: ${totalStarCount}`)
            
            // Fetch all available star data to build proper history
            const allStarData: { starred_at: string }[] = []
            let page = 1
            let hasMorePages = true
            
            // Fetch pages until we have enough data or reach the end
            while (hasMorePages && allStarData.length < maxRequestAmount * 10) {
                try {
                    const response = await getRepoStargazers(repo, token, page)
                    const { data } = response
                    
                    if (data.length === 0) {
                        hasMorePages = false
                    } else {
                        allStarData.push(...data)
                        page++
                    }
                } catch (error) {
                    console.log(`[DEBUG] Error fetching page ${page}:`, error)
                    hasMorePages = false
                }
            }
            
            console.log(`[DEBUG] Total star records fetched: ${allStarData.length}`)
            
            // Sort by date (oldest first)
            allStarData.sort((a, b) => new Date(a.starred_at).getTime() - new Date(b.starred_at).getTime())
            
            // Calculate the baseline star count at the filter date
            const starsBeforeFilter = allStarData.filter(star => {
                const starDate = new Date(star.starred_at)
                return starDate < filterDate
            }).length
            
            console.log(`[DEBUG] Stars before filter date: ${starsBeforeFilter}`)
            
            // Get stars after the filter date
            const starsAfterFilter = allStarData.filter(star => {
                const starDate = new Date(star.starred_at)
                return starDate >= filterDate
            })
            
            console.log(`[DEBUG] Stars after filter date: ${starsAfterFilter.length}`)
            
            // Build star records with proper baseline
            const starRecordsMap: Map<string, number> = new Map()
            
            // Add baseline point at the filter date
            starRecordsMap.set(utils.getDateString(filterDate), starsBeforeFilter)
            
            // Build incremental history from the filter date onwards
            let incrementalCount = 0
            starsAfterFilter.forEach((star) => {
                const date = utils.getDateString(star.starred_at)
                incrementalCount++
                const totalCount = starsBeforeFilter + incrementalCount
                starRecordsMap.set(date, totalCount)
            })
            
            // Add current total at the end
            starRecordsMap.set(utils.getDateString(Date.now()), totalStarCount)
            
            const starRecords: { date: string; count: number }[] = []
            starRecordsMap.forEach((v, k) => {
                starRecords.push({ date: k, count: v })
            })
            
            // Sort by date
            starRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            console.log(`[DEBUG] Final star records: ${starRecords.length}`)
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
            for (let i = 0; i < starRecordsData.length; ) {
                starRecordsMap.set(utils.getDateString(starRecordsData[i].starred_at), i + 1)
                i += Math.floor(starRecordsData.length / maxRequestAmount) || 1
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
