import React from "react"
import { useAppStore } from "../store"

const DateFilter: React.FC = () => {
    const store = useAppStore()

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = event.target.value
        store.actions.setDateFrom(date || null)
    }

    const handleClearDate = () => {
        store.actions.setDateFrom(null)
    }

    return (
        <div className="flex flex-row items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
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