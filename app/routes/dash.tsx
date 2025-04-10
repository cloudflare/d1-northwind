import type { SQLRequestEvent } from "~/lib/utils";
import type { Route } from "./+types/dash";
import { useStats } from "~/components/StatsContext";

export function loader({ context }: Route.LoaderArgs) {
  return {
    cf: context.cloudflare.cf,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { cf } = loaderData;
  const stats = useStats();

  return (
    <>
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
              Query count: {stats?.queries}
            </p>
            <p className="text-gray-800 text-sm">
              Results count: {stats?.results}
            </p>
            <p className="text-gray-800 text-sm"># SELECT: {stats?.select}</p>
            <p className="text-gray-800 text-sm">
              # SELECT WHERE: {stats?.select_where}
            </p>
            <p className="text-gray-800 text-sm">
              # SELECT LEFT JOIN: {stats?.select_leftjoin}
            </p>
          </div>
        </div>
        <p className="text-xl pt-6">Activity log</p>
        <p className="text-gray-800 text-xs">
          Explore the app and see metrics here
        </p>
        <div className="mt-4">
          {stats?.log?.map((log: SQLRequestEvent, index: number) => {
            if (log.type === "sql") {
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
                      <li
                        key={queryIndex}
                        className="bg-gray-50 rounded-md p-3"
                      >
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
            }
            return null;
          })}
        </div>
      </div>
    </>
  );
}
