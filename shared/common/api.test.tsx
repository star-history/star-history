import assert from "node:assert/strict"
import { afterEach, test } from "node:test"
import axios from "axios"
import api from "./api"
import utils from "./utils"

const originalAdapter = axios.defaults.adapter
const week = 1736035200 // January 5, 2025
const weekSeconds = 7 * 86400
const date = (seconds: number) => utils.getDateString(seconds * 1000)

afterEach(() => { axios.defaults.adapter = originalAdapter })

function mockHistory(pages: { week: number; total: number; days: number[] }[][], currentCount: number, nextOnly = false) {
    const requests: { url: URL; headers: any }[] = []
    axios.defaults.adapter = async (config) => {
        const url = new URL(config.url!)
        requests.push({ url, headers: config.headers })
        let data: unknown = { stargazers_count: currentCount }
        const headers: Record<string, string> = {}
        if (url.pathname.endsWith("/stargazers/history")) {
            const page = Number(url.searchParams.get("page"))
            assert.equal(url.searchParams.get("per_page"), "30")
            assert.ok(page >= 1 && page <= pages.length)
            data = pages[page - 1]
            if (page < pages.length) {
                // Deliberately put page before per_page and last before next.
                const link = (n: number, rel: string) => `<https://api.github.com/repositories/1/stargazers/history?page=${n}&per_page=30>; rel="${rel}"`
                headers.link = (nextOnly ? "" : link(pages.length, "last") + ", ") + link(page + 1, "next")
            }
        } else {
            assert.equal(url.pathname, "/repos/owner/repo")
        }
        return { data, headers, status: 200, statusText: "OK", config }
    }
    return requests
}

test("accumulates daily buckets oldest first and preserves the current count", async () => {
    const requests = mockHistory([
        [{ week: week + weekSeconds, total: 3, days: [0, 3, 0, 0, 0, 0, 0] }],
        [{ week, total: 5, days: [0, 2, 0, 3, 0, 0, 0] }],
    ], 7)
    const records = await api.getRepoStarRecords("owner/repo", "test-token", 15)
    assert.deepEqual(records[0], { date: date(week + 86400), count: 2 })
    assert.deepEqual(records[1], { date: date(week + 2 * 86400), count: 2 })
    assert.deepEqual(records[2], { date: date(week + 3 * 86400), count: 5 })
    assert.deepEqual(records[8], { date: date(week + weekSeconds + 2 * 86400), count: 8 })
    assert.equal(records[records.length - 1].count, 7)
    assert.equal(requests.length, 3)
    assert.equal(requests[0].headers.Accept, "application/vnd.github+json")
    assert.equal(requests[0].headers["X-GitHub-Api-Version"], "2026-03-10")
    assert.equal(requests[0].headers.Authorization, "token test-token")
})

test("fetches every page even when the concurrency limit is smaller than the page count", async () => {
    const pages = Array.from({ length: 5 }, (_, i) => [{ week: week + (4 - i) * weekSeconds, total: 1, days: [1, 0, 0, 0, 0, 0, 0] }])
    const requests = mockHistory(pages, 5)
    const records = await api.getRepoStarRecords("owner/repo", "", 2)
    assert.deepEqual(requests.slice(0, -1).map(({ url }) => url.searchParams.get("page")), ["1", "2", "3", "4", "5"])
    assert.equal(records[0].count, 1)
    assert.equal(records[records.length - 2].count, 5)
    assert.equal(requests[0].headers.Authorization, "")
})

test("follows next links when no last link is provided", async () => {
    const requests = mockHistory([
        [{ week: week + weekSeconds, total: 1, days: [1, 0, 0, 0, 0, 0, 0] }],
        [{ week, total: 1, days: [1, 0, 0, 0, 0, 0, 0] }],
    ], 2, true)
    const records = await api.getRepoStarRecords("owner/repo", "", 0)
    assert.equal(requests.length, 3)
    assert.equal(records[records.length - 2].count, 2)
})

test("omits future days from the current week", async () => {
    const today = Math.floor(Date.now() / 86400000) * 86400
    mockHistory([[{ week: today, total: 1, days: [1, 0, 0, 0, 0, 0, 0] }]], 1)
    const records = await api.getRepoStarRecords("owner/repo", "", 1)
    assert.equal(records.length, 2)
    assert.equal(records[0].date, date(today))
})

for (const pages of [[[]], [[{ week, total: 0, days: [0, 0, 0, 0, 0, 0, 0] }]]]) {
    test(`preserves the no-history error for ${pages[0].length ? "zero-filled" : "empty"} history`, async () => {
        const requests = mockHistory(pages, 0)
        await assert.rejects(api.getRepoStarRecords("owner/repo", "", 15), { status: 200, data: [] })
        assert.equal(requests.length, 1)
    })
}

test("propagates GitHub failures without falling back to private stargazer identities", async () => {
    const failure = { response: { status: 403 } }
    axios.defaults.adapter = async () => { throw failure }
    await assert.rejects(api.getRepoStarRecords("owner/repo", "", 15), (error) => error === failure)
})
