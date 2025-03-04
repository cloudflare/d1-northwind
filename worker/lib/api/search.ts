import { createSQLLog, prepareStatements } from "../tools";

const apiSearch = () => {
  return {
    path: "search",
    method: "GET",
    handler: async (request: Request, env: Env) => {
      const session = env.DB.withSession("first-unconstrained");
      const { searchParams } = new URL(request.url);
      const q = searchParams.get("q");
      const table = searchParams.get("table");
      const itemsPerPage = 50;
      const [stmts, sql] = prepareStatements(
        session,
        false,
        [
          table == "products"
            ? "SELECT Id, ProductName, SupplierId, CategoryId, QuantityPerUnit, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued FROM Product WHERE ProductName LIKE ?2 LIMIT ?1"
            : "SELECT Id, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax FROM Customer WHERE CompanyName LIKE ?2 OR ContactName LIKE ?2 OR ContactTitle LIKE ?2 OR Address LIKE ?2 LIMIT ?1",
        ],
        [[itemsPerPage, `%${q}%`]]
      );

      try {
        const startTime = Date.now();
        const search = await (stmts[0] as D1PreparedStatement).all();
        const overallTimeMs = Date.now() - startTime;

        return {
          items: itemsPerPage,
          stats: {
            queries: 1,
            results: search.results ? search.results.length : 0,
            select_fts: 0,
            select_where: 1,
            overallTimeMs: overallTimeMs,
            log: createSQLLog(sql, [search], overallTimeMs),
          },
          results: search.results,
        };
      } catch (e: any) {
        return { error: 404, msg: e.toString() };
      }
    },
  };
};

interface Env {
  DB: D1Database;
}

export { apiSearch };
