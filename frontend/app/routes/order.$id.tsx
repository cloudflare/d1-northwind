import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddTableField } from "~/components";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import { useStatsDispatch } from "~/components/StatsContext";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Missing id");

  const rand = Math.floor(Math.random() * 1000001);
  const path = `${
    process.env.NODE_ENV === "production"
      ? "https://api.northwind.d1sql.com"
      : "http://127.0.0.1:8787"
  }/api/order?Id=${params.id}&rand=${rand}`;

  const res = await fetch(path);
  const result = (await res.json()) as any;

  return json({ ...result });
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

const Order = () => {
  const navigate = useNavigate();
  const data = useLoaderData<LoaderType>();
  const { order, products } = data;

  const dispatch = useStatsDispatch();
  useEffect(() => {
    dispatch && data.stats && dispatch(data.stats);
  }, [dispatch, data.stats]);

  return (
    <>
      {order ? (
        <div className="card mb-6">
          <header className="card-header">
            <p className="card-header-title">
              <span className="icon material-icons">ballot</span>
              <span className="ml-2">Order information</span>
            </p>
          </header>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <AddTableField
                  name="Customer Id"
                  link={`/customer/${order.CustomerId}`}
                  value={order.CustomerId}
                />
                <AddTableField name="Ship Name" value={order.ShipName} />
                <AddTableField
                  name="Total Products"
                  value={order.TotalProducts}
                />
                <AddTableField
                  name="Total Quantity"
                  value={order.TotalProductsItems}
                />
                <AddTableField
                  name="Total Price"
                  value={`$${parseFloat(order.TotalProductsPrice).toFixed(2)}`}
                />
                <AddTableField
                  name="Total Discount"
                  value={`$${parseFloat(order.TotalProductsDiscount).toFixed(
                    2
                  )}`}
                />
                <AddTableField
                  name="Ship Via"
                  value={order.ShipViaCompanyName}
                />
                <AddTableField
                  name="Freight"
                  value={`$${parseFloat(order.Freight).toFixed(2)}`}
                />
              </div>
              <div>
                <AddTableField name="Order Date" value={order.OrderDate} />
                <AddTableField
                  name="Required Date"
                  value={order.RequiredDate}
                />
                <AddTableField name="Shipped Date" value={order.ShippedDate} />
                <AddTableField name="Ship City" value={order.ShipCity} />
                <AddTableField name="Ship Region" value={order.ShipRegion} />
                <AddTableField
                  name="Ship Postal Code"
                  value={order.ShipPostalCode}
                />
                <AddTableField name="Ship Country" value={order.ShipCountry} />
              </div>
            </div>
          </div>
          <div className="card has-table">
            <header className="card-header">
              <p className="card-header-title">Products in Order</p>
            </header>
            <div className="card-content">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Order Price</th>
                    <th>Total Price</th>
                    <th>Discount</th>
                  </tr>
                </thead>
                <tbody>
                  {/* TODO: add Types */}
                  {products.map((product: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td data-label="Product">
                          <Link className="link" to={`/product/${product.Id}`}>
                            {product.ProductName}
                          </Link>
                        </td>
                        <td data-label="Quantity">{product.Quantity}</td>
                        <td data-label="OrderPrice">{`$${parseFloat(
                          product.OrderUnitPrice
                        ).toFixed(2)}`}</td>
                        <td data-label="TotalPrice">{`$${(
                          Number(product.OrderUnitPrice) *
                          Number(product.Quantity)
                        ).toFixed(2)}`}</td>
                        <td data-label="Discount">{`${
                          product.Discount * 100
                        }%`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-content">
            <div className="field grouped">
              <div className="control">
                <button
                  type="reset"
                  onClick={() => {
                    navigate(`/orders`, { replace: false });
                  }}
                  className="button red"
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-content">
          <h2>No such order</h2>
        </div>
      )}
    </>
  );
};

export default Order;
