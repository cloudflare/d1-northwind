import { Link, useNavigate, useSearchParams } from "react-router";
import { prepareStatements, createSQLLog } from "~/lib/utils";
import { Paginate } from "~/components";

import type { Route } from "./+types/search";
import { useStatsDispatch } from "~/components/StatsContext";
import { useEffect, useState } from "react";

interface Order {
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
  const q = searchParams.get("q");
  const table = searchParams.get("table");
  const itemsPerPage = 20;
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
}

export default function Search({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const [keyword, setKeyword] = useState(q || "");
  const [table, setTable] = useState("products");
  const navigate = useNavigate();

  const { results, stats } = loaderData;
  const dispatch = useStatsDispatch();

  useEffect(() => {
    dispatch && stats && dispatch(stats);
  }, [dispatch, stats]);

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      navigate(`/search?q=${keyword}&table=${table}`);
    }
  };

  const setPage = (page: number) => {
    navigate(`/orders?page=${page}`);
  };

  return (
    <>
      <div className="card">
        <div className="card-content">
          <div className="field">
            <label className="label">Search Database</label>
            <div className="field-body">
              <div className="field">
                <div className="control icons-left">
                  <input
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Enter keyword..."
                    value={keyword}
                    className="input w-1/2"
                  />
                  <span className="icon left material-icons ml-2 mt-2">
                    search
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Tables</label>
            <div className="field-body">
              <div className="field grouped multiline">
                <div className="control">
                  <label className="radio">
                    <input
                      type="radio"
                      onClick={() => setTable("products")}
                      name="table-radio"
                      value="one"
                      checked={table == "products" ? true : false}
                    />
                    <span className="check"></span>
                    <span className="control-label">Products</span>
                  </label>
                </div>
                <div className="control">
                  <label className="radio">
                    <input
                      type="radio"
                      onClick={() => setTable("customers")}
                      name="fts-radio"
                      value="two"
                      checked={table == "customers" ? true : false}
                    />
                    <span className="check"></span>
                    <span className="control-label">Customers</span>
                  </label>
                </div>
              </div>
            </div>
            {/*
                        <p className="text-gray-400 text-base">
                            {!fts ? (
                                "Full table search using SELECT table WHERE field1 LIKE '%keyword%' or field2 LIKE '%keyword%'"
                            ) : (
                                <span>
                                    Native SQLite full-text search using{" "}
                                    <a className="link" href="https://www.sqlite.org/fts5.html" target="_new">
                                        FTS5
                                    </a>
                                </span>
                            )}
                        </p>
                            */}
          </div>
          <p className="text-black font-bold text-lg">Search results</p>
          {results && results.length ? (
            <>
              {/* <pre className="text-gray-400 text-sm">{log}</pre> */}
              {results.map((r: any, idx: number) => {
                return (
                  <>
                    {table == "products" ? (
                      <>
                        <p className="text-base mt-2 link">
                          <Link to={`/product/${r.Id}`}>{r.ProductName}</Link>
                        </p>
                        <p className="text-gray-400 text-sm">
                          #{idx + 1}, Quantity Per Unit: {r.QuantityPerUnit},
                          Price: {r.UnitPrice}, Stock: {r.UnitsInStock}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-base mt-2 link">
                          <Link to={`/customer/${r.Id}`}>{r.CompanyName}</Link>
                        </p>
                        <p className="text-gray-400 text-sm">
                          #{idx + 1}, Contact: {r.ContactName}, Title:{" "}
                          {r.ContactTitle}, Phone: {r.Phone}
                        </p>
                      </>
                    )}
                  </>
                );
              })}
            </>
          ) : (
            <p className="mt-6">No results</p>
          )}
        </div>
      </div>
    </>
  );
}
