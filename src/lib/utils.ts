export interface SQLQueryLog {
  query: string;
  served_by: string;
  duration: number;
}

export interface SQLRequestEvent {
  type: "sql";
  timestamp: string;
  queries: SQLQueryLog[];
  overallTimeMs: number;
}

export interface StatsEvent {
  queries?: number;
  results?: number;
  select?: number;
  select_where?: number;
  select_leftjoin?: number;
  select_fts?: number;
  update?: number;
  delete?: number;
  insert?: number;
  log: SQLRequestEvent;
}

const createSQLLog = (
  statements: string[],
  response: D1Result<unknown>[],
  overallTimeMs: number
): SQLRequestEvent => {
  const queries: SQLQueryLog[] = response.map((res, index) => ({
    query: statements[index],
    served_by: res.meta.served_by_colo ?? "unknown",
    duration: res.meta.duration,
  }));

  return {
    type: "sql",
    timestamp: new Date().toISOString(),
    queries,
    overallTimeMs,
  };
};

const prepareStatements = (
  session: D1DatabaseSession,
  countTable: string | false,
  query: Array<string>,
  values: Array<unknown[]>
): [D1PreparedStatement[], string[]] => {
  const stmts: D1PreparedStatement[] = [];
  const sql: string[] = [];
  if (countTable) {
    const q = `SELECT COUNT(1) as total FROM ${countTable}`;
    stmts.push(session.prepare(q));
    sql.push(q);
  }
  for (let i in query) {
    stmts.push(session.prepare(query[i]).bind(...values[i]));
    sql.push(query[i]);
  }
  return [stmts, sql];
};

export { prepareStatements, createSQLLog };
