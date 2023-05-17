import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Paginate } from "~/components";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useStatsDispatch } from "~/components/StatsContext";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page")) || 1;
  const count = url.searchParams.get("count");
  const search = url.searchParams.get("search");

  const rand = Math.floor(Math.random() * 1000001);
  const path = `${
    process.env.NODE_ENV === "production"
      ? "https://api.northwind.d1sql.com"
      : "http://127.0.0.1:8787"
  }/api/orders?page=${page}${Number(count) > 0 ? `` : `&count=true`}${
    search ? `&search=${search}` : ""
  }&rand=${rand}`;

  const res = await fetch(path);
  const result = (await res.json()) as any;

  return json({ ...result });
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

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

const Orders = () => {
  const data = useLoaderData<LoaderType>();
  const navigate = useNavigate();
  const { orders, page, pages } = data;
  const dispatch = useStatsDispatch();

  useEffect(() => {
    dispatch && data.stats && dispatch(data.stats);
  }, [dispatch, data.stats]);

  const setPage = (page: number) => {
    navigate(`/orders?page=${page}`);
  };
  return (
    <>
      {orders.length ? (
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
