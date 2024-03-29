import { createContext, useContext } from "react";

export const StatsContext = createContext<typeof initialStats | null>(null);

export const StatsDispatchContext = createContext<React.Dispatch<any> | null>(
  null
);

export const initialStats = {
  queries: 0,
  results: 0,
  select: 0,
  select_where: 0,
  select_leftjoin: 0,
  select_fts: 0,
  update: 0,
  delete: 0,
  insert: 0,
  log: [] as {
    type: string;
    query: string;
    ts: string;
    served_by: string;
    duration: string;
  }[],
};

export function useStats() {
  return useContext(StatsContext);
}

export function useStatsDispatch() {
  return useContext(StatsDispatchContext);
}
