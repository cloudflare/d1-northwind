import { Link, useNavigate } from "react-router";
import { prepareStatements, createSQLLog } from "~/lib/utils";
import { Paginate } from "~/components";

import type { Route } from "./+types/suppliers";
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
    count ? "Supplier" : false,
    [
      "SELECT Id,CompanyName,ContactName,ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax, HomePage FROM Supplier LIMIT ?1 OFFSET ?2",
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
        overallTimeMs: overallTimeMs,
        log: createSQLLog(sql, response, overallTimeMs),
      },
      suppliers: suppliers,
    };
  } catch (e: any) {
    return { error: 404, msg: e.toString() };
  }
}

export default function Suppliers({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { suppliers, page, pages, stats } = loaderData;
  const dispatch = useStatsDispatch();

  useEffect(() => {
    dispatch && stats && dispatch(stats);
  }, [dispatch, stats]);

  const setPage = (page: number) => {
    navigate(`/suppliers?page=${page}`);
  };

  return (
    <>
      {suppliers.length ? (
        <div className="card has-table">
          <header className="card-header">
            <p className="card-header-title">Suppliers</p>
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
                  <th></th>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Title</th>
                  <th>City</th>
                  <th>Country</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="image-cell">
                        <div className="image">
                          <img
                            alt="supplier"
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${
                              supplier.ContactName.split(" ")[0]
                            }-${supplier.ContactName.split(" ").slice(-1)[0]}`}
                            className="rounded-full"
                          />
                        </div>
                      </td>
                      <td data-label="Company">
                        <Link className="link" to={`/supplier/${supplier.Id}`}>
                          {supplier.CompanyName}
                        </Link>
                      </td>
                      <td data-label="Contact">{supplier.ContactName}</td>
                      <td data-label="Title">{supplier.ContactTitle}</td>
                      <td data-label="Title">{supplier.City}</td>
                      <td data-label="Title">{supplier.Country}</td>
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
          <h2>Loading suppliers...</h2>
        </div>
      )}
    </>
  );
}
