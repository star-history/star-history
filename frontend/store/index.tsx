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
    zoomLevel: number;
}

interface AppStateContextProps {
    setToken(token: string): void;
    delRepo(repo: string): void;
    isFetching: boolean;
    repos: string[];
    chartMode: ChartMode;
    token: string;
    dateFrom: string | null;
    zoomLevel: number;
    state: AppState;
    actions: {
        addRepo(repo: string): void;
        delRepo(repo: string): void;
        setRepos(repos: string[]): void;
        setToken(token: string): void;
        setIsFetching(isFetching: boolean): void;
        setChartMode(chartMode: ChartMode): void;
        setDateFrom(dateFrom: string | null): void;
        setZoomLevel(zoomLevel: number): void;
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
        zoomLevel: 1,
    });

    const router = useRouter();
    useEffect(() => {
        const fetchData = () => {
            const { accessTokenCache } = storage.get(["accessTokenCache"]);
            const hash = router.asPath.split("#")[1] || '';
            const params = hash.split("&").filter((i) => Boolean(i));
            const repos: string[] = [];
            let chartMode: ChartMode = "Date";
    
            for (const value of params) {
                if (value === "Date" || value === "Timeline") {
                    chartMode = value as ChartMode;
                } else {
                    repos.push(value);
                }
            }
    
            setState({
                ...state,
                isFetching: false,
                token: accessTokenCache || "",
                repos: repos.length > 0 ? repos : state.repos, // Ensure repos are not overwritten if not provided in the URL hash
                chartMode: chartMode,
                dateFrom: state.dateFrom, // Preserve dateFrom state
                zoomLevel: state.zoomLevel, // Preserve zoomLevel state
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
        setZoomLevel: (zoomLevel: number) => {
            setState((prev) => ({ ...prev, zoomLevel }));
        },
    };

    const store: AppStateContextProps = {
        isFetching: state.isFetching,
        repos: state.repos,
        chartMode: state.chartMode,
        token: state.token,
        dateFrom: state.dateFrom,
        zoomLevel: state.zoomLevel,
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
