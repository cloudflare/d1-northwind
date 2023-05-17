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

const createSQLLog = (statements: any, response: any) => {
  let logs = [];
  for (let l in response) {
    logs.push({
      type: "sql",
      served_by: response[l].meta.served_by,
      query: statements[l],
      duration: response[l].meta.duration,
      ts: new Date().toISOString(),
    });
  }

  return logs;
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
  db: D1Database,
  countTable: string | false,
  query: Array<string>,
  values: Array<any[]>
) => {
  var stmts: D1PreparedStatement[] = [];
  var sql = [];
  if (countTable) {
    const q = `SELECT COUNT(1) as total FROM ${countTable}`;
    stmts.push(db.prepare(q));
    sql.push(q);
  }
  for (let i in query) {
    stmts.push(db.prepare(query[i]).bind(...values[i]));
    sql.push(query[i]);
  }
  return [stmts, sql];
};

export { getMime, rand, prepareStatements, createSQLLog };
