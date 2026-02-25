import React, { createContext, useContext, useEffect, useState } from "react";
import storage from "../helpers/storage";
import { ChartMode, LegendPosition } from "../shared/types/chart";
import { useRouter } from "next/router";

interface AppState {
    isFetching: boolean;
    token: string;
    repos: string[];
    chartMode: ChartMode;
    useLogScale: boolean;
    legendPosition: LegendPosition;
}

interface AppStateContextProps {
    setToken(token: string): void;
    delRepo(repo: string): void;
    isFetching: boolean;
    repos: string[];
    chartMode: ChartMode;
    useLogScale: boolean;
    legendPosition: LegendPosition;
    token: string;
    state: AppState;
    actions: {
        addRepo(repo: string): void;
        delRepo(repo: string): void;
        setRepos(repos: string[]): void;
        setToken(token: string): void;
        setIsFetching(isFetching: boolean): void;
        setChartMode(chartMode: ChartMode): void;
        setUseLogScale(useLogScale: boolean): void;
        setLegendPosition(legendPosition: LegendPosition): void;
    };
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{
    children: React.ReactNode;
    initialRepos?: string[];
}> = ({ children, initialRepos }) => {
    const [state, setState] = useState<AppState>({
        isFetching: false,
        token: "",
        repos: initialRepos || [],
        chartMode: "Date",
        useLogScale: false,
        legendPosition: "top-left",
    });

    const router = useRouter();
    useEffect(() => {
        const fetchData = () => {
            const { accessTokenCache } = storage.get(["accessTokenCache"]);
            const hash = router.asPath.split("#")[1] || '';
            const params = hash.split("&").filter((i) => Boolean(i));
            const repos: string[] = [];
            let chartMode: ChartMode = "Date";
            let useLogScale = false;
            let legendPosition: LegendPosition = "top-left";

            const validLegendPositions: LegendPosition[] = ["top-left", "bottom-right"];

            for (const value of params) {
                if (value.startsWith("type=")) {
                    // Preferred format: type=timeline or type=date
                    const typeValue = value.split("=")[1].toLowerCase();
                    if (typeValue === "date") {
                        chartMode = "Date";
                    } else if (typeValue === "timeline") {
                        chartMode = "Timeline";
                    }
                } else if (value === "date" || value === "Date") {
                    // Backward compatibility: naked date parameter
                    chartMode = "Date";
                } else if (value === "timeline" || value === "Timeline") {
                    // Backward compatibility: naked timeline parameter
                    chartMode = "Timeline";
                } else if (value === "logscale" || value === "LogScale") {
                    useLogScale = true;
                } else if (value.startsWith("legend=")) {
                    const position = value.split("=")[1] as LegendPosition;
                    if (validLegendPositions.includes(position)) {
                        legendPosition = position;
                    }
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
                useLogScale: useLogScale,
                legendPosition: legendPosition,
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
        setUseLogScale: (useLogScale: boolean) => {
            setState((prev) => ({ ...prev, useLogScale }));
        },
        setLegendPosition: (legendPosition: LegendPosition) => {
            setState((prev) => ({ ...prev, legendPosition }));
        },
    };

    const store: AppStateContextProps = {
        isFetching: state.isFetching,
        repos: state.repos,
        chartMode: state.chartMode,
        useLogScale: state.useLogScale,
        legendPosition: state.legendPosition,
        token: state.token,
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
