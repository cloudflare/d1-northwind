import { useEffect, useState } from "react";
import { useStats } from "~/components/StatsContext";

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
        {stats?.log?.map((log, index: number) => {
          console.log(log);
          if (log.type == "sql") {
            return (
              <div className="pt-2" key={index}>
                <p className="text-gray-400 text-xs">
                  {log.ts}, {log.served_by}, {log.duration}ms
                </p>
                {log.query.split("\n").map((l: string, index: number) => {
                  return (
                    <p key={index} className="text-sm font-mono break-all">
                      {l}
                    </p>
                  );
                })}
              </div>
            );
          } else return null;
        })}
      </div>
    </>
  );
}
