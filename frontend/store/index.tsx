import React, { createContext, useContext, useEffect, useState } from "react";
import storage from "../helpers/storage";
import { ChartMode } from "../shared/types/chart";
import { useRouter } from "next/router";

interface AppState {
    isFetching: boolean;
    token: string;
    repos: string[];
    chartMode: ChartMode;
    dateFrom: string | null;
}

interface AppStateContextProps {
    setToken(token: string): void;
    delRepo(repo: string): void;
    isFetching: boolean;
    repos: string[];
    chartMode: ChartMode;
    token: string;
    dateFrom: string | null;
    state: AppState;
    actions: {
        addRepo(repo: string): void;
        delRepo(repo: string): void;
        setRepos(repos: string[]): void;
        setToken(token: string): void;
        setIsFetching(isFetching: boolean): void;
        setChartMode(chartMode: ChartMode): void;
        setDateFrom(dateFrom: string | null): void;
    };
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>({
        isFetching: false,
        token: "",
        repos: [],
        chartMode: "Date",
        dateFrom: null,
    });

    const router = useRouter();
    useEffect(() => {
        const fetchData = () => {
            const { accessTokenCache } = storage.get(["accessTokenCache"]);
            const hash = router.asPath.split("#")[1] || '';
            console.log(`[DEBUG] Parsing hash: ${hash}`)
            const params = hash.split("&").filter((i) => Boolean(i));
            console.log(`[DEBUG] Hash params: ${params.join(", ")}`)
            const repos: string[] = [];
            let chartMode: ChartMode = "Date";
            let dateFrom: string | null = null;
    
            for (const value of params) {
                if (value === "Date" || value === "Timeline") {
                    chartMode = value as ChartMode;
                    console.log(`[DEBUG] Chart mode: ${chartMode}`)
                } else if (value.startsWith("from=")) {
                    // Handle dateFrom parameter: from=timestamp_in_seconds
                    const timestamp = value.split("=")[1];
                    console.log(`[DEBUG] Found from parameter: ${timestamp}`)
                    if (timestamp && !isNaN(Number(timestamp))) {
                        const date = new Date(Number(timestamp) * 1000);
                        dateFrom = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
                        console.log(`[DEBUG] Converted timestamp to date: ${dateFrom}`)
                    }
                } else {
                    repos.push(value);
                    console.log(`[DEBUG] Added repo: ${value}`)
                }
            }
    
            console.log(`[DEBUG] Final repos: ${repos.join(", ")}`)
            console.log(`[DEBUG] Final dateFrom: ${dateFrom}`)
    
            setState({
                ...state,
                isFetching: false,
                token: accessTokenCache || "",
                repos: repos.length > 0 ? repos : state.repos, // Ensure repos are not overwritten if not provided in the URL hash
                chartMode: chartMode,
                dateFrom: dateFrom || state.dateFrom, // Use URL dateFrom if provided, otherwise preserve existing
            });
        };
    
        // Fetch data and set initial state
        fetchData();

        // Listen for hash changes using Next.js router
        const handleHashChange = (url: string) => {
            if (url.includes("#")) {
                fetchData();
            }
        };
        router.events.on("hashChangeComplete", handleHashChange);

        // Cleanup the event listener
        return () => {
            router.events.off("hashChangeComplete", handleHashChange);
        };
    }, [router]);
    
   const actions: AppStateContextProps["actions"] = {
        addRepo: (repo: string) => {
            if (!state.repos.includes(repo)) {
                setState((prev) => ({ ...prev, repos: [...prev.repos, repo] }));
            }
        },
        delRepo: (repo: string) => {
            setState((prev) => ({ ...prev, repos: prev.repos.filter((r) => r !== repo) }));
        },
        setRepos: (repos: string[]) => {
            setState((prev) => ({ ...prev, repos }));
        },
        setToken: (token: string) => {
            setState((prev) => ({ ...prev, token }));
        },
        setIsFetching: (isFetching: boolean) => {
            setState((prev) => ({ ...prev, isFetching }));
        },
        setChartMode: (chartMode: ChartMode) => {
            setState((prev) => ({ ...prev, chartMode }));
        },
        setDateFrom: (dateFrom: string | null) => {
            setState((prev) => ({ ...prev, dateFrom }));
        },
    };

    const store: AppStateContextProps = {
        isFetching: state.isFetching,
        repos: state.repos,
        chartMode: state.chartMode,
        token: state.token,
        dateFrom: state.dateFrom,
        state,
        actions,
        setToken: actions.setToken,
        delRepo: actions.delRepo,
    };

    return <AppStateContext.Provider value={store}>{children}</AppStateContext.Provider>;
};

export const useAppStore = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error("useAppStore must be used within an AppStateProvider");
    }
    return context;
};
