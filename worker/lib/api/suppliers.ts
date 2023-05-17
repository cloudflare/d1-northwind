import { createSQLLog, prepareStatements } from "../tools";

const apiSuppliers = () => {
  return {
    path: "suppliers",
    method: "GET",
    handler: async (request: Request, env: Env) => {
      const { searchParams } = new URL(request.url);
      const count = searchParams.get("count");
      const page = parseInt(searchParams.get("page") as string) || 1;
      const itemsPerPage = 20;
      const [stmts, sql] = prepareStatements(
        env.DB,
        count ? "Supplier" : false,
        [
          "SELECT Id,CompanyName,ContactName,ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax, HomePage FROM Supplier LIMIT ?1 OFFSET ?2",
        ],
        [[itemsPerPage, (page - 1) * itemsPerPage]]
      );
      try {
        const response: D1Result<any>[] = await env.DB.batch(
          stmts as D1PreparedStatement[]
        );
        const first = response[0];
        const total =
          count && first.results ? (first.results[0] as any).total : 0;
        const suppliers: any = count
          ? response.slice(1)[0].results
          : response[0].results;
        return {
          page: page,
          pages: count ? Math.ceil(total / itemsPerPage) : 0,
          items: itemsPerPage,
          total: count ? total : 0,
          stats: {
            queries: stmts.length,
            results: suppliers.length + (count ? 1 : 0),
            select: stmts.length,
            log: createSQLLog(sql, response),
          },
          suppliers: suppliers,
        };
      } catch (e: any) {
        return { error: 404, msg: e.cause.toString() };
      }
    },
  };
};

const apiSupplier = () => {
  return {
    path: "supplier",
    method: "GET",
    handler: async (request: Request, env: Env) => {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("Id");
      try {
        const [stmts, sql] = prepareStatements(
          env.DB,
          false,
          [
            "SELECT Id,CompanyName,ContactName,ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax, HomePage FROM Supplier WHERE Id = ?1",
          ],
          [[id]]
        );
        const supplier: D1Result<any> = await (
          stmts[0] as D1PreparedStatement
        ).all();
        return {
          stats: {
            queries: 1,
            results: 1,
            select: 1,
            log: createSQLLog(sql, [supplier]),
          },
          supplier: supplier.results ? supplier.results[0] : {},
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

export { apiSuppliers, apiSupplier };
