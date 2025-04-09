const mime_types = [
  {
    ext: ["css"],
    mime: "text/css",
  },
  {
    ext: ["js"],
    mime: "text/javascript",
  },
  {
    ext: ["html"],
    mime: "text/html",
  },
  {
    ext: ["png"],
    mime: "image/png",
  },
];

interface SQLQueryLog {
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

const createSQLLog = (
  statements: string[],
  response: any[],
  overallTimeMs: number
): SQLRequestEvent => {
  const queries = response.map((res, index) => ({
    query: statements[index],
    served_by: res.meta.served_by,
    duration: res.meta.duration,
  }));

  return {
    type: "sql",
    timestamp: new Date().toISOString(),
    queries,
    overallTimeMs,
  };
};

const getMime = (file: string) => {
  const ext: string | undefined = file.split(".").pop();
  const mi = mime_types
    .map((m) => {
      return m.ext.indexOf(ext as string) != -1 ? ext : false;
    })
    .indexOf(ext);
  return mi != -1 ? mime_types[mi].mime : "text/plain";
};

const rand = (min = 1, max = 1000000) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const prepareStatements = (
  session: D1DatabaseSession,
  countTable: string | false,
  query: Array<string>,
  values: Array<any[]>
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

export { getMime, rand, prepareStatements, createSQLLog };
