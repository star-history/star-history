import React from "react"
import { useAppStore } from "../store"
import { useRouter } from "next/router"

const DateFilter: React.FC = () => {
    const store = useAppStore()
    const router = useRouter()

    const updateURLWithDate = (date: string | null) => {
        const currentHash = window.location.hash
        console.log(`[DEBUG] Current hash: ${currentHash}`)
        const hashParts = currentHash.split("&").filter(part => !part.startsWith("from="))
        
        let newHash = hashParts.join("&")
        console.log(`[DEBUG] Hash parts after filtering: ${hashParts.join(", ")}`)
        
        if (date) {
            const timestamp = Math.floor(new Date(date).getTime() / 1000)
            console.log(`[DEBUG] Converting date ${date} to timestamp: ${timestamp}`)
            newHash += newHash ? `&from=${timestamp}` : `from=${timestamp}`
        }
        
        console.log(`[DEBUG] New hash: ${newHash}`)
        
        // Update the URL without triggering a page reload
        const newURL = `${window.location.pathname}${newHash ? '#' + newHash : ''}`
        console.log(`[DEBUG] New URL: ${newURL}`)
        router.push(newURL, undefined, { shallow: true })
    }

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = event.target.value
        console.log(`[DEBUG] Date changed to: ${date}`)
        store.actions.setDateFrom(date || null)
        updateURLWithDate(date || null)
    }

    const handleClearDate = () => {
        console.log(`[DEBUG] Clearing date`)
        store.actions.setDateFrom(null)
        updateURLWithDate(null)
    }

    return (
        <div className="flex flex-row items-center gap-2 mb-4">
            <label htmlFor="dateFrom" className="text-sm font-medium text-gray-700">
                Date from:
            </label>
            <input
                id="dateFrom"
                type="date"
                value={store.dateFrom || ""}
                onChange={handleDateChange}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {store.dateFrom && (
                <button
                    onClick={handleClearDate}
                    className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                >
                    Clear
                </button>
            )}
        </div>
    )
}

export default DateFilter 