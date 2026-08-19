import { useEffect, useState } from "react";
import type { StatsEvent, SQLRequestEvent } from "../lib/utils";

const STORAGE_KEY = "northwind-stats";

interface DashboardProps {
  cf?: { colo?: string; country?: string };
}

const emptyTotals = {
  queries: 0,
  results: 0,
  select: 0,
  select_where: 0,
  select_leftjoin: 0,
  select_fts: 0,
  update: 0,
  delete: 0,
  insert: 0,
};

export default function Dashboard({ cf }: DashboardProps) {
  const [events, setEvents] = useState<StatsEvent[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) ?? "[]",
      ) as StatsEvent[];
      setEvents(Array.isArray(stored) ? stored : []);
    } catch {
      setEvents([]);
    }
  }, []);

  const totals = events.reduce((acc, e) => {
    acc.queries += e.queries || 0;
    acc.results += e.results || 0;
    acc.select += e.select || 0;
    acc.select_where += e.select_where || 0;
    acc.select_leftjoin += e.select_leftjoin || 0;
    acc.select_fts += e.select_fts || 0;
    acc.update += e.update || 0;
    acc.delete += e.delete || 0;
    acc.insert += e.insert || 0;
    return acc;
  }, { ...emptyTotals });

  return (
    <div className="card-content">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xl">Worker</p>
          <p className="text-gray-800 text-sm">Colo: {cf?.colo}</p>
          <p className="text-gray-800 text-sm">Country: {cf?.country}</p>
        </div>
        <div>
          <p className="text-xl">SQL Metrics</p>
          <p className="text-gray-800 text-sm">
            Query count: {totals.queries}
          </p>
          <p className="text-gray-800 text-sm">
            Results count: {totals.results}
          </p>
          <p className="text-gray-800 text-sm"># SELECT: {totals.select}</p>
          <p className="text-gray-800 text-sm">
            # SELECT WHERE: {totals.select_where}
          </p>
          <p className="text-gray-800 text-sm">
            # SELECT LEFT JOIN: {totals.select_leftjoin}
          </p>
        </div>
      </div>
      <p className="text-xl pt-6">Activity log</p>
      <p className="text-gray-800 text-xs">
        Explore the app and see metrics here
      </p>
      <div className="mt-4">
        {events.map((event: StatsEvent, index: number) => {
          const log: SQLRequestEvent | undefined = event.log;
          if (!log || log.type !== "sql") return null;
          return (
            <div
              className="pt-2 border-l-2 border-gray-200 pl-4 mb-4"
              key={index}
            >
              <p className="text-gray-500 text-xs font-semibold">
                Request at {log.timestamp}
                <span className="ml-2 text-blue-600">
                  Request duration: {log.overallTimeMs}ms
                </span>
              </p>
              <ul className="mt-2 space-y-2">
                {log.queries.map((query, queryIndex) => (
                  <li key={queryIndex} className="bg-gray-50 rounded-md p-3">
                    <p className="text-gray-500 text-xs mb-1">
                      Served by: {query.served_by}
                      <span className="ml-2 text-blue-600">
                        Query duration: {query.duration}ms
                      </span>
                    </p>
                    <div className="bg-white rounded border border-gray-200 p-2">
                      {query.query
                        .split("\n")
                        .map((line: string, lineIndex: number) => (
                          <p
                            key={lineIndex}
                            className="text-sm font-mono break-all text-gray-700"
                          >
                            {line}
                          </p>
                        ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
