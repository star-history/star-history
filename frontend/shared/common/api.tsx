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
        // If dateFrom is provided, we need to build star history from that date onwards
        if (dateFrom) {
            console.log(`[DEBUG] Fetching data for ${repo} from date: ${dateFrom}`)
            const filterDate = new Date(dateFrom)
            console.log(`[DEBUG] Filter date: ${filterDate.toISOString()}`)
            
            // Get the current total star count
            const totalStarCount = await getRepoStargazersCount(repo, token)
            console.log(`[DEBUG] Total star count: ${totalStarCount}`)
            
            // Get the first page to understand pagination
            const firstPageRes = await getRepoStargazers(repo, token, 1)
            const headerLink = firstPageRes.headers["link"] || ""
            let totalPages = 1
            const regResult = /next.*&page=(\d*).*last/.exec(headerLink)
            
            if (regResult) {
                if (regResult[1] && Number.isInteger(Number(regResult[1]))) {
                    totalPages = Number(regResult[1])
                }
            }
            console.log(`[DEBUG] Total pages: ${totalPages}`)
            
            // For date filtering, we need to fetch more pages to get enough data points
            // We'll fetch pages from the end (most recent) backwards to build the history
            const pagesToFetch = Math.min(maxRequestAmount * 2, totalPages) // Fetch more pages for better data
            const startPage = Math.max(1, totalPages - pagesToFetch + 1)
            const requestPages = utils.range(startPage, totalPages)
            console.log(`[DEBUG] Fetching pages: ${startPage} to ${totalPages}`)
            
            const resArray = await Promise.all(
                requestPages.map((page) => {
                    return getRepoStargazers(repo, token, page)
                })
            )
            
            // Collect all star data and sort by date
            const allStarData: { starred_at: string }[] = []
            resArray.forEach((res) => {
                const { data } = res
                allStarData.push(...data)
            })
            console.log(`[DEBUG] Total star records fetched: ${allStarData.length}`)
            
            // Sort by date (oldest first)
            allStarData.sort((a, b) => new Date(a.starred_at).getTime() - new Date(b.starred_at).getTime())
            
            // Filter by date and build star history
            const filteredStarData = allStarData.filter(star => {
                const starDate = new Date(star.starred_at)
                return starDate >= filterDate
            })
            console.log(`[DEBUG] Filtered star records: ${filteredStarData.length}`)
            
            // If we don't have enough data, we need to fetch earlier pages
            if (filteredStarData.length < 5 && startPage > 1) {
                console.log(`[DEBUG] Not enough data, fetching earlier pages`)
                const earlierPages = utils.range(Math.max(1, startPage - 10), startPage - 1)
                const earlierResArray = await Promise.all(
                    earlierPages.map((page) => {
                        return getRepoStargazers(repo, token, page)
                    })
                )
                
                earlierResArray.forEach((res) => {
                    const { data } = res
                    allStarData.push(...data)
                })
                
                // Re-sort and filter
                allStarData.sort((a, b) => new Date(a.starred_at).getTime() - new Date(b.starred_at).getTime())
                const allFilteredData = allStarData.filter(star => {
                    const starDate = new Date(star.starred_at)
                    return starDate >= filterDate
                })
                console.log(`[DEBUG] After fetching earlier pages, filtered records: ${allFilteredData.length}`)
                
                // Build star records from filtered data
                const starRecordsMap: Map<string, number> = new Map()
                let starCount = 0
                
                // First, add the current total count
                starRecordsMap.set(utils.getDateString(Date.now()), totalStarCount)
                
                // Then build the history from the filtered data
                allFilteredData.forEach((star) => {
                    const date = utils.getDateString(star.starred_at)
                    starCount++
                    starRecordsMap.set(date, starCount)
                })
                
                const starRecords: { date: string; count: number }[] = []
                starRecordsMap.forEach((v, k) => {
                    starRecords.push({ date: k, count: v })
                })
                
                // Sort by date
                starRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                console.log(`[DEBUG] Final star records: ${starRecords.length}`)
                return starRecords
            }
            
            // Build star records from filtered data
            const starRecordsMap: Map<string, number> = new Map()
            let starCount = 0
            
            // First, add the current total count
            starRecordsMap.set(utils.getDateString(Date.now()), totalStarCount)
            
            // Then build the history from the filtered data
            filteredStarData.forEach((star) => {
                const date = utils.getDateString(star.starred_at)
                starCount++
                starRecordsMap.set(date, starCount)
            })
            
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
