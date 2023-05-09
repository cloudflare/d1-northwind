import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { updateStats } from "../redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "../lib/tools";
import { Paginate } from "~/components";

const Suppliers = (props) => {
  const dispatch = useDispatch();
  const { search } = Object.keys(props).length ? props : useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const reloadPage = () => {
    const rand = Math.floor(Math.random() * 1000001);
    const path = `https://v2-worker.rozenmd.workers.dev/api/suppliers?page=${page}${
      count > 0 ? `` : `&count=true`
    }${search ? `&search=${search}` : ""}&rand=${rand}`;
    fetch(path)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (result.pages) setPages(result.pages);
          if (result.total) setCount(result.total);
          setSuppliers(result.suppliers);
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
          setIsLoaded(true);
          console.log(error);
        }
      );
  };

  useEffect(() => {
    if (isLoaded) {
      if (search) {
        if (page != 1) {
          setPage(1);
        } else {
          reloadPage();
        }
      } else {
        reloadPage();
      }
    }
  }, [search]);

  useEffect(() => {
    reloadPage();
  }, [page]);

  return (
    <>
      {suppliers.length ? (
        <div className="card has-table">
          <header className="card-header">
            <p className="card-header-title">Suppliers</p>
            <a className="card-header-icon">
              <span
                className="material-icons"
                onClick={() => {
                  reloadPage();
                }}
              >
                redo
              </span>
            </a>
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
                {suppliers.map((supplier, index) => {
                  return (
                    <tr>
                      <td className="image-cell">
                        <div className="image">
                          <img
                            src={`https://avatars.dicebear.com/v2/initials/${
                              supplier.ContactName.split(" ")[0]
                            }-${
                              supplier.ContactName.split(" ").slice(-1)[0]
                            }.svg`}
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
            <Paginate pages={pages} page={page} setPage={setPage} />
          </div>
        </div>
      ) : (
        <div className="card-content">
          <h2>Loading suppliers...</h2>
        </div>
      )}
    </>
  );
};

export default Suppliers;
