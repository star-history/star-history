import React, { createContext, useContext, useEffect, useState } from "react"
import storage from "../helpers/storage"
import { ChartMode } from "../types/chart"

interface AppState {
    isFetching: boolean
    token: string
    repos: string[]
    chartMode: ChartMode
}

interface AppStateContextProps {
    setToken(token: string): unknown
    delRepo(repo: any): void
    isFetching: any
    repos: any
    chartMode: any
    token: string
    state: AppState
    actions: {
        addRepo: (repo: string) => void
        delRepo: (repo: string) => void
        setRepos: (repos: string[]) => void
        setToken: (token: string) => void
        setIsFetching: (isFetching: boolean) => void
        setChartMode: (chartMode: ChartMode) => void
    }
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined)

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>({
        isFetching: false,
        token: "",
        repos: [],
        chartMode: "Date"
    })

    useEffect(() => {
        const fetchData = () => {
            const { accessTokenCache } = storage.get(["accessTokenCache"])
            const hash = window.location.hash.slice(1)
            const params = hash.split("&").filter((i) => Boolean(i))
            const repos: string[] = []
            let chartMode: ChartMode = "Date"

            for (const value of params) {
                if (value === "Date" || value === "Timeline") {
                    chartMode = value
                    continue
                }
                if (!repos.includes(value)) {
                    repos.push(value)
                }
            }

            setState({
                isFetching: false,
                token: accessTokenCache || "",
                repos: repos,
                chartMode: chartMode
            })
        }

        fetchData()
    }, []) // Empty dependency array ensures useEffect runs only once on mount

    const actions: AppStateContextProps["actions"] = {
        addRepo: (repo: string) => {
            if (!state.repos.includes(repo)) {
                setState((prev) => ({ ...prev, repos: [...prev.repos, repo] }))
            }
        },
        delRepo: (repo: string) => {
            setState((prev) => ({ ...prev, repos: prev.repos.filter((r) => r !== repo) }))
        },
        setRepos: (repos: string[]) => {
            setState((prev) => ({ ...prev, repos }))
        },
        setToken: (token: string) => {
            setState((prev) => ({ ...prev, token }))
        },
        setIsFetching: (isFetching: boolean) => {
            setState((prev) => ({ ...prev, isFetching }))
        },
        setChartMode: (chartMode: ChartMode) => {
            setState((prev) => ({ ...prev, chartMode }))
        }
    }

    const store: AppStateContextProps = {
        isFetching: state.isFetching,
        repos: state.repos,
        chartMode: state.chartMode,
        token: state.token,
        state,
        actions,
        setToken: actions.setToken,
        delRepo: function (repo: any): void {
            throw new Error("Function not implemented.")
        }
    }

    return <AppStateContext.Provider value={store}>{children}</AppStateContext.Provider>
}

export const useAppStore = () => {
    const context = useContext(AppStateContext)
    if (!context) {
        throw new Error("useAppStore must be used within an AppStateProvider")
    }
    return context
}
