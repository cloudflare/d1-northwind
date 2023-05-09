import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { updateStats } from "../redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "../lib/tools";
import { Paginate } from "~/components";

const Orders = (props) => {
  const dispatch = useDispatch();
  const { search } = Object.keys(props).length ? props : useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const reloadPage = () => {
    const rand = Math.floor(Math.random() * 1000001);
    const path = `https://v2-worker.rozenmd.workers.dev/api/orders?page=${page}${
      count > 0 ? `` : `&count=true`
    }${search ? `&search=${search}` : ""}&rand=${rand}`;
    fetch(path)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (result.pages) setPages(result.pages);
          if (result.total) setCount(result.total);
          setOrders(result.orders);
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
      {orders.length ? (
        <div className="card has-table">
          <header className="card-header">
            <p className="card-header-title">Orders</p>
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
                {orders.map((order, index) => {
                  return (
                    <tr>
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
            <Paginate pages={pages} page={page} setPage={setPage} />
          </div>
        </div>
      ) : (
        <div className="card-content">
          <h2>Loading orders...</h2>
        </div>
      )}
    </>
  );
};

export default Orders;
