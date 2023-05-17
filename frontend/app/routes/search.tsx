import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useStatsDispatch } from "~/components/StatsContext";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("q");
  const table = url.searchParams.get("table");
  const rand = Math.floor(Math.random() * 1000001);
  const path = `${
    process.env.NODE_ENV === "production"
      ? "https://api.northwind.d1sql.com"
      : "http://127.0.0.1:8787"
  }/api/search?q=${keyword}&rand=${rand}&table=${table ?? "products"}`;
  const res = await fetch(path);
  const result = (await res.json()) as any;
  return json({ ...result });
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const data = useLoaderData<LoaderType>();
  const { results } = data;
  const [keyword, setKeyword] = useState(q || "");
  const [table, setTable] = useState("products");
  const dispatch = useStatsDispatch();
  useEffect(() => {
    dispatch && data.stats && dispatch(data.stats);
  }, [dispatch, data.stats]);

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      navigate(`/search?q=${keyword}&table=${table}`);
    }
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
                  <span className="icon left material-icons">search</span>
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
          {results.length ? (
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
};

export default Search;
