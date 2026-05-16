import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import storage from "../helpers/storage";
import { ChartMode, LegendPosition } from "@shared/types/chart";
import { isValidIsoDateString } from "@shared/common/chart";
import { useRouter } from "next/router";

interface AppState {
    isFetching: boolean;
    token: string;
    repos: string[];
    chartMode: ChartMode;
    useLogScale: boolean;
    legendPosition: LegendPosition;
    startDate: string | null;
}

interface AppStateContextProps {
    isFetching: boolean;
    repos: string[];
    chartMode: ChartMode;
    useLogScale: boolean;
    legendPosition: LegendPosition;
    startDate: string | null;
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
        setStartDate(date: string | null): void;
    };
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [state, setState] = useState<AppState>({
        isFetching: false,
        token: "",
        repos: [],
        chartMode: "Date",
        useLogScale: false,
        legendPosition: "auto",
        startDate: null,
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
            let legendPosition: LegendPosition = "auto";
            let startDate: string | null = null;

            const validLegendPositions: LegendPosition[] = ["auto", "top-left", "top-right", "bottom-left", "bottom-right"];

            for (const value of params) {
                if (value.startsWith("type=")) {
                    const typeValue = value.split("=")[1].toLowerCase();
                    if (typeValue === "date") {
                        chartMode = "Date";
                    } else if (typeValue === "timeline") {
                        chartMode = "Timeline";
                    }
                } else if (value === "date" || value === "Date") {
                    chartMode = "Date";
                } else if (value === "timeline" || value === "Timeline") {
                    chartMode = "Timeline";
                } else if (value === "logscale" || value === "LogScale") {
                    useLogScale = true;
                } else if (value.startsWith("legend=")) {
                    const position = value.split("=")[1] as LegendPosition;
                    if (validLegendPositions.includes(position)) {
                        legendPosition = position;
                    }
                } else if (value.startsWith("from=")) {
                    const candidate = value.split("=")[1];
                    if (isValidIsoDateString(candidate)) {
                        startDate = candidate;
                    }
                } else {
                    repos.push(value);
                }
            }

            setState((prev) => ({
                ...prev,
                isFetching: false,
                token: accessTokenCache || "",
                repos: repos.length > 0 ? repos : prev.repos,
                chartMode,
                useLogScale,
                legendPosition,
                startDate,
            }));
        };

        fetchData();

        const handleHashChange = (url: string) => {
            if (url.includes("#")) {
                fetchData();
            }
        };
        router.events.on("hashChangeComplete", handleHashChange);

        return () => {
            router.events.off("hashChangeComplete", handleHashChange);
        };
    }, [router]);

    const actions = useMemo<AppStateContextProps["actions"]>(() => ({
        addRepo: (repo: string) => {
            setState((prev) => {
                if (prev.repos.includes(repo)) return prev;
                return { ...prev, repos: [...prev.repos, repo] };
            });
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
        setStartDate: (date: string | null) => {
            setState((prev) => ({ ...prev, startDate: date }));
        },
    }), []);

    const store = useMemo<AppStateContextProps>(() => ({
        isFetching: state.isFetching,
        repos: state.repos,
        chartMode: state.chartMode,
        useLogScale: state.useLogScale,
        legendPosition: state.legendPosition,
        startDate: state.startDate,
        token: state.token,
        state,
        actions,
    }), [state, actions]);

    return <AppStateContext.Provider value={store}>{children}</AppStateContext.Provider>;
};

export const useAppStore = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error("useAppStore must be used within an AppStateProvider");
    }
    return context;
};
