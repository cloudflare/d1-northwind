import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { updateStats } from "~/redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "~/lib/tools";

const Search = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { q } = useParams();
  const [keyword, setKeyword] = useState(q || "");
  const [results, setResults] = useState([]);
  const [table, setTable] = useState("products");
  const [log, setLog] = useState("");

  const doSearch = () => {
    if (keyword) {
      const rand = Math.floor(Math.random() * 1000001);
      const path = `https://v2-worker.rozenmd.workers.dev/api/search?q=${keyword}&rand=${rand}&table=${table}`;
      fetch(path)
        .then((res) => res.json())
        .then(
          (result) => {
            console.log(result);
            if (result.stats.log[0]) {
              setLog(
                `${result.stats.log[0].query} (${result.stats.log[0].duration}ms)`
              );
            }
            setResults(result.results);
            const pe = getPerformanceEvent(rand);
            if (pe) {
              result.stats.log.unshift({
                type: "api",
                path: path,
                duration: pe.responseEnd - pe.requestStart,
                ts: new Date().toISOString(),
              });
            }
            dispatch(updateStats(result.stats));
          },
          (error) => {
            console.log(error);
          }
        );
    }
  };

  useEffect(() => {
    doSearch();
  }, [table]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log(`searching ${keyword}`);
      navigate(`/search/${keyword}`, { replace: false });
      doSearch();
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
              {results.map((r, idx) => {
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

export { Search };
