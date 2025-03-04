import { createSQLLog, prepareStatements } from "../tools";

const apiProducts = () => {
  return {
    path: "products",
    method: "GET",
    handler: async (request: Request, env: Env) => {
      const session = env.DB.withSession("first-unconstrained");
      const { searchParams } = new URL(request.url);
      const count = searchParams.get("count");
      const page = parseInt(searchParams.get("page") as string) || 1;
      const itemsPerPage = 20;
      const [stmts, sql] = prepareStatements(
        session,
        count ? "Product" : false,
        [
          "SELECT Id, ProductName, SupplierId, CategoryId, QuantityPerUnit, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued FROM Product LIMIT ?1 OFFSET ?2",
        ],
        [[itemsPerPage, (page - 1) * itemsPerPage]]
      );
      try {
        const startTime = Date.now();
        const response: D1Result<any>[] = await session.batch(
          stmts as D1PreparedStatement[]
        );
        const overallTimeMs = Date.now() - startTime;

        const first = response[0];
        const total =
          count && first.results ? (first.results[0] as any).total : 0;
        const products: any = count
          ? response.slice(1)[0].results
          : response[0].results;
        return {
          page: page,
          pages: count ? Math.ceil(total / itemsPerPage) : 0,
          items: itemsPerPage,
          total: count ? total : 0,
          stats: {
            queries: stmts.length,
            results: products.length + (count ? 1 : 0),
            select: stmts.length,
            overallTimeMs: overallTimeMs,
            log: createSQLLog(sql, response, overallTimeMs),
          },
          products: products,
        };
      } catch (e: any) {
        return { error: 404, msg: e.toString() };
      }
    },
  };
};

const apiProduct = () => {
  return {
    path: "product",
    method: "GET",
    handler: async (request: Request, env: Env) => {
      const session = env.DB.withSession("first-unconstrained");
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("Id");
      try {
        const [stmts, sql] = prepareStatements(
          session,
          false,
          [
            "SELECT Product.Id, ProductName, SupplierId, CategoryId, QuantityPerUnit, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued, Supplier.CompanyName AS SupplierName FROM Product, Supplier WHERE Product.Id = ?1 AND Supplier.Id=Product.SupplierId",
          ],
          [[id]]
        );
        const startTime = Date.now();
        const product: D1Result<any> = await (
          stmts[0] as D1PreparedStatement
        ).all();
        const overallTimeMs = Date.now() - startTime;

        return {
          stats: {
            queries: 1,
            results: 1,
            select: 1,
            overallTimeMs: overallTimeMs,
            log: createSQLLog(sql, [product], overallTimeMs),
          },
          product: product.results ? product.results[0] : {},
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

export { apiProducts, apiProduct };
