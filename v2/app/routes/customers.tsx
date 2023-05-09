import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { updateStats } from "~/redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "~/lib/tools";
import { Paginate } from "~/components/Paginate";

const Customers = (props) => {
  const dispatch = useDispatch();
  const { search } = Object.keys(props).length ? props : useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [customers, setCustomers] = useState([]);
  const reloadPage = () => {
    const rand = Math.floor(Math.random() * 1000001);
    const path = `https://northwind.d1sql.com/api/customers?page=${page}${
      count > 0 ? `` : `&count=true`
    }${search ? `&search=${search}` : ""}&rand=${rand}`;
    fetch(path)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (result.pages) setPages(result.pages);
          if (result.total) setCount(result.total);
          setCustomers(result.customers);
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
      {customers.length ? (
        <div className="card has-table">
          <header className="card-header">
            <p className="card-header-title">Customers</p>
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
                {customers.map((customer, index) => {
                  return (
                    <tr>
                      <td className="image-cell">
                        <div className="image">
                          <img
                            src={`https://avatars.dicebear.com/v2/initials/${
                              customer.ContactName.split(" ")[0]
                            }-${
                              customer.ContactName.split(" ").slice(-1)[0]
                            }.svg`}
                            className="rounded-full"
                          />
                        </div>
                      </td>
                      <td data-label="Company">
                        <Link className="link" to={`/customer/${customer.Id}`}>
                          {customer.CompanyName}
                        </Link>
                      </td>
                      <td data-label="Contact">{customer.ContactName}</td>
                      <td data-label="Title">{customer.ContactTitle}</td>
                      <td data-label="City">{customer.City}</td>
                      <td data-label="Country">{customer.Country}</td>
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
          <h2>No results</h2>
        </div>
      )}
    </>
  );
};

export default Customers;
