import { createSQLLog, prepareStatements } from "../tools";

const apiOrders = () => {
  return {
    path: "orders",
    method: "GET",
    handler: async (request: Request, env: Env) => {
      const session = env.DB.withSession("first-unconstrained");
      const { searchParams } = new URL(request.url);
      const count = searchParams.get("count");
      const page = parseInt(searchParams.get("page") as string) || 1;
      const itemsPerPage = 20;
      const [stmts, sql] = prepareStatements(
        session,
        count ? '"Order"' : false,
        [
          'SELECT SUM(OrderDetail.UnitPrice * OrderDetail.Discount * OrderDetail.Quantity) AS TotalProductsDiscount, SUM(OrderDetail.UnitPrice * OrderDetail.Quantity) AS TotalProductsPrice, SUM(OrderDetail.Quantity) AS TotalProductsItems, COUNT(OrderDetail.OrderId) AS TotalProducts, "Order".Id, CustomerId, EmployeeId, OrderDate, RequiredDate, ShippedDate, ShipVia, Freight, ShipName, ShipAddress, ShipCity, ShipRegion, ShipPostalCode, ShipCountry, ProductId FROM "Order", OrderDetail WHERE OrderDetail.OrderId = "Order".Id GROUP BY "Order".Id LIMIT ?1 OFFSET ?2',
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
        const orders: any = count
          ? response.slice(1)[0].results
          : response[0].results;
        return {
          page: page,
          pages: count ? Math.ceil(total / itemsPerPage) : 0,
          items: itemsPerPage,
          total: count ? total : 0,
          stats: {
            queries: stmts.length,
            results: orders.length + (count ? 1 : 0),
            select: stmts.length,
            overallTimeMs: overallTimeMs,
            log: createSQLLog(sql, response, overallTimeMs),
          },
          orders: orders,
        };
      } catch (e: any) {
        return { error: 404, msg: e.toString() };
      }
    },
  };
};

const apiOrder = () => {
  return {
    path: "order",
    method: "GET",
    handler: async (request: Request, env: Env) => {
      const session = env.DB.withSession("first-unconstrained");
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("Id");
      const [stmts, sql] = prepareStatements(
        session,
        false,
        [
          'SELECT Shipper.CompanyName AS ShipViaCompanyName, SUM(OrderDetail.UnitPrice * OrderDetail.Discount * OrderDetail.Quantity) AS TotalProductsDiscount, SUM(OrderDetail.UnitPrice * OrderDetail.Quantity) AS TotalProductsPrice, SUM(OrderDetail.Quantity) AS TotalProductsItems, COUNT(OrderDetail.OrderId) AS TotalProducts, "Order".Id, CustomerId, EmployeeId, OrderDate, RequiredDate, ShippedDate, ShipVia, Freight, ShipName, ShipAddress, ShipCity, ShipRegion, ShipPostalCode, ShipCountry, ProductId FROM "Order", OrderDetail, Shipper WHERE OrderDetail.OrderId = "Order".Id AND "Order".Id = ?1 AND "Order".ShipVia = Shipper.Id GROUP BY "Order".Id',
          "SELECT OrderDetail.OrderId, OrderDetail.Quantity, OrderDetail.UnitPrice AS OrderUnitPrice, OrderDetail.Discount, Product.Id, ProductName, SupplierId, CategoryId, QuantityPerUnit, Product.UnitPrice AS ProductUnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued FROM Product, OrderDetail WHERE OrderDetail.OrderId = ?1 AND OrderDetail.ProductId = Product.Id",
        ],
        [[id], [id]]
      );

      try {
        const startTime = Date.now();
        const response: D1Result<any>[] = await session.batch(
          stmts as D1PreparedStatement[]
        );
        const overallTimeMs = Date.now() - startTime;

        const orders: any = response[0].results;
        const products: any = response[1].results;
        return {
          stats: {
            queries: stmts.length,
            results: products.length + 1,
            select: stmts.length,
            select_where: stmts.length,
            overallTimeMs: overallTimeMs,
            log: createSQLLog(sql, response, overallTimeMs),
          },
          order: orders ? orders[0] : {},
          products: products,
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

export { apiOrders, apiOrder };
