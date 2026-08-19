import { Link, useNavigate } from "react-router";
import { prepareStatements, createSQLLog } from "~/lib/utils";
import { Paginate } from "~/components";

import type { Route } from "./+types/orders";
import { useStatsDispatch } from "~/components/StatsContext";
import { useEffect } from "react";

export interface Order {
  Id: string;
  TotalProducts: string;
  TotalProductsPrice: string;
  TotalProductsItems: string;
  OrderDate: string;
  ShipName: string;
  ShipCity: string;
  ShipCountry: string;
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = context.cloudflare.env.DB.withSession("first-unconstrained");
  const { searchParams } = new URL(request.url);
  const count = true;
  const page = parseInt(searchParams.get("page") as string) || 1;
  const itemsPerPage = 20;
  const [stmts, sql] = prepareStatements(
    session,
    count ? '"Order"' : false,
    [
      'SELECT SUM(od.UnitPrice * od.Discount * od.Quantity) AS TotalProductsDiscount, SUM(od.UnitPrice * od.Quantity) AS TotalProductsPrice, SUM(od.Quantity) AS TotalProductsItems, COUNT(od.OrderId) AS TotalProducts, o.Id, o.CustomerId, o.EmployeeId, o.OrderDate, o.RequiredDate, o.ShippedDate, o.ShipVia, o.Freight, o.ShipName, o.ShipAddress, o.ShipCity, o.ShipRegion, o.ShipPostalCode, o.ShipCountry FROM (SELECT * FROM "Order" ORDER BY Id LIMIT ?1 OFFSET ?2) o LEFT JOIN OrderDetail od ON od.OrderId = o.Id GROUP BY o.Id ORDER BY o.Id',
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
    const total = count && first.results ? (first.results[0] as any).total : 0;

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
    return {
      error: 404,
      msg: e.toString(),
      orders: [],
      page,
      pages: 0,
      items: itemsPerPage,
      total: 0,
    };
  }
}

export default function Orders({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  console.log({ loaderData });
  const { orders, page, pages, stats, error, msg } = loaderData as any;
  const dispatch = useStatsDispatch();

  useEffect(() => {
    dispatch && stats && dispatch(stats);
  }, [dispatch, stats]);

  const setPage = (page: number) => {
    navigate(`/orders?page=${page}`);
  };

  return (
    <>
      {orders?.length ? (
        <div className="card has-table">
          <header className="card-header">
            <p className="card-header-title">Orders</p>
            <button className="card-header-icon">
              <span
                className="material-icons"
                onClick={() => {
                  //eslint-disable-next-line
                  window.location.href = window.location.href;
                }}
              >
                redo
              </span>
            </button>
          </header>
          <div className="card-content">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Total Price</th>
                  <th>Products</th>
                  <th>Quantity</th>
                  <th>Shipped</th>
                  <th>Ship Name</th>
                  <th>City</th>
                  <th>Country</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: Order, index: number) => {
                  return (
                    <tr key={index}>
                      <td data-label="Id">
                        <Link className="link" to={`/order/${order.Id}`}>
                          {order.Id}
                        </Link>
                      </td>
                      <td data-label="Price">{`$${parseFloat(
                        order.TotalProductsPrice
                      ).toFixed(2)}`}</td>
                      <td data-label="Products">{order.TotalProducts}</td>
                      <td data-label="Quantity">{order.TotalProductsItems}</td>
                      <td data-label="Date">{order.OrderDate}</td>
                      <td data-label="Name">{order.ShipName}</td>
                      <td data-label="City">{order.ShipCity}</td>
                      <td data-label="Country">{order.ShipCountry}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Paginate pages={pages!} page={page!} setPage={setPage} />
          </div>
        </div>
      ) : (
        <div className="card-content">
          {error ? (
            <h2>{msg}</h2>
          ) : (
            <h2>Loading orders...</h2>
          )}
        </div>
      )}
    </>
  );
}
