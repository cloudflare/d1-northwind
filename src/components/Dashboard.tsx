import { useEffect, useState } from "react";
import { Text } from "@cloudflare/kumo";
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Text variant="heading3" as="h2">
            Worker
          </Text>
          <Text variant="secondary" size="sm">
            Colo: {cf?.colo}
          </Text>
          <Text variant="secondary" size="sm">
            Country: {cf?.country}
          </Text>
        </div>
        <div className="space-y-1">
          <Text variant="heading3" as="h2">
            SQL Metrics
          </Text>
          <Text variant="secondary" size="sm">
            Query count: {totals.queries}
          </Text>
          <Text variant="secondary" size="sm">
            Results count: {totals.results}
          </Text>
          <Text variant="secondary" size="sm">
            # SELECT: {totals.select}
          </Text>
          <Text variant="secondary" size="sm">
            # SELECT WHERE: {totals.select_where}
          </Text>
          <Text variant="secondary" size="sm">
            # SELECT LEFT JOIN: {totals.select_leftjoin}
          </Text>
        </div>
      </div>
      <div>
        <Text variant="heading3" as="h2">
          Activity log
        </Text>
        <Text variant="secondary" size="xs">
          Explore the app and see metrics here
        </Text>
        <div className="mt-4 space-y-4">
          {events.map((event: StatsEvent, index: number) => {
            const log: SQLRequestEvent | undefined = event.log;
            if (!log || log.type !== "sql") return null;
            return (
              <div
                className="border-l-2 border-kumo-fill pl-4"
                key={index}
              >
                <Text variant="secondary" size="xs" as="p">
                  Request at {log.timestamp}
                  <span className="ml-2 text-kumo-link">
                    Request duration: {log.overallTimeMs}ms
                  </span>
                </Text>
                <ul className="mt-2 space-y-2">
                  {log.queries.map((query, queryIndex) => (
                    <li
                      key={queryIndex}
                      className="rounded-md bg-kumo-tint p-3"
                    >
                      <Text variant="secondary" size="xs" as="p">
                        Served by: {query.served_by}
                        <span className="ml-2 text-kumo-link">
                          Query duration: {query.duration}ms
                        </span>
                      </Text>
                      <div className="mt-2 rounded border border-kumo-hairline bg-kumo-base p-2">
                        {query.query
                          .split("\n")
                          .map((line: string, lineIndex: number) => (
                            <p
                              key={lineIndex}
                              className="break-all font-mono text-sm text-kumo-default"
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
    </div>
  );
}
