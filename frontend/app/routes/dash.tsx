import { useEffect, useState } from "react";
import { useStats } from "~/components/StatsContext";
import { SQLRequestEvent } from "worker/lib/tools";

interface Status {
  cf:
    | {
        colo: string;
        country: string;
      }
    | undefined;
  tables: string[];
  module_list: string[];
  database_list: string[];
}

export default function Dash() {
  const [status, setStatus] = useState<Status>({
    cf: undefined,
    tables: [],
    module_list: [],
    database_list: [],
  });
  const stats = useStats();

  useEffect(() => {
    //TODO: use a loader
    const path = `${
      process.env.NODE_ENV === "production"
        ? "https://api.northwind.d1sql.com"
        : "http://127.0.0.1:8787"
    }/api/status`;
    fetch(path)
      .then((res) => res.json())
      .then(
        (result: any) => {
          setStatus(result);
        },
        (error) => {}
      );
  }, []); // runs only once

  return (
    <>
      <div className="card-content">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xl">Worker</p>
            <p className="text-gray-800 text-sm">Colo: {status.cf?.colo}</p>
            <p className="text-gray-800 text-sm">
              Country: {status.cf?.country}
            </p>
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
