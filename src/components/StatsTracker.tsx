import { useEffect } from "react";
import type { StatsEvent } from "../lib/utils";

const STORAGE_KEY = "northwind-stats";
const MAX_EVENTS = 50;

export function StatsTracker({ stats }: { stats: StatsEvent }) {
  useEffect(() => {
    if (!stats) return;
    try {
      let stored: StatsEvent[] = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) ?? "[]",
      );
      stored.push(stats);
      if (stored.length > MAX_EVENTS) stored = stored.slice(-MAX_EVENTS);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // ignore malformed storage
    }
  }, [stats]);

  return null;
}

export default StatsTracker;
