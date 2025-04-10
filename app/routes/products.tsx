import { Link, useNavigate } from "react-router";
import { prepareStatements, createSQLLog } from "~/lib/utils";
import { Paginate } from "~/components";

import type { Route } from "./+types/products";
import { useStatsDispatch } from "~/components/StatsContext";
import { useEffect } from "react";

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = context.cloudflare.env.DB.withSession("first-unconstrained");
  const { searchParams } = new URL(request.url);
  const count = true;
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
    const total = count && first.results ? (first.results[0] as any).total : 0;

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
}

export default function Products({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { products, page, pages, stats } = loaderData;
  const dispatch = useStatsDispatch();

  useEffect(() => {
    dispatch && stats && dispatch(stats);
  }, [dispatch, stats]);

  const setPage = (page: number) => {
    navigate(`/products?page=${page}`);
  };

  return (
    <>
      {products.length ? (
        <div className="card has-table">
          <header className="card-header">
            <p className="card-header-title">Products</p>
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
                  <th>Name</th>
                  <th>Qt per unit</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Orders</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td data-label="Product">
                        <Link className="link" to={`/product/${product.Id}`}>
                          {product.ProductName}
                        </Link>
                      </td>
                      <td data-label="Qpu">{product.QuantityPerUnit}</td>
                      <td data-label="Price">${product.UnitPrice}</td>
                      <td data-label="Stock">{product.UnitsInStock}</td>
                      <td data-label="Orders">{product.UnitsOnOrder}</td>
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
          <h2>Loading products...</h2>
        </div>
      )}
    </>
  );
}
