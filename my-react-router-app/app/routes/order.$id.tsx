import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import type { Route } from "./+types/order.$id";
import { createSQLLog } from "~/lib/utils";
import { prepareStatements } from "~/lib/utils";
import { useStatsDispatch } from "~/components/StatsContext";
import { AddTableField } from "~/components";

export async function loader({ context, params }: Route.LoaderArgs) {
  const session = context.cloudflare.env.DB.withSession("first-unconstrained");
  const { id } = params;

  const [stmts, sql] = prepareStatements(
    session,
    false,
    [
      'SELECT Shipper.CompanyName AS ShipViaCompanyName, SUM(OrderDetail.UnitPrice * OrderDetail.Discount * OrderDetail.Quantity) AS TotalProductsDiscount, SUM(OrderDetail.UnitPrice * OrderDetail.Quantity) AS TotalProductsPrice, SUM(OrderDetail.Quantity) AS TotalProductsItems, COUNT(OrderDetail.OrderId) AS TotalProducts, "Order".Id, CustomerId, EmployeeId, OrderDate, RequiredDate, ShippedDate, ShipVia, Freight, ShipName, ShipAddress, ShipCity, ShipRegion, ShipPostalCode, ShipCountry, ProductId FROM "Order", OrderDetail, Shipper WHERE OrderDetail.OrderId = "Order".Id AND "Order".Id = ?1 AND "Order".ShipVia = Shipper.Id GROUP BY "Order".Id',
      "SELECT OrderDetail.OrderId, OrderDetail.Quantity, OrderDetail.UnitPrice AS OrderUnitPrice, OrderDetail.Discount, Product.Id, ProductName, SupplierId, CategoryId, QuantityPerUnit, Product.UnitPrice AS ProductUnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued FROM Product, OrderDetail WHERE OrderDetail.OrderId = ?1 AND OrderDetail.ProductId = Product.Id",
    ],
    [[id], [id]]
  );
  try {
    const startTime = Date.now();
    const response: D1Result<any>[] = await session.batch(
      stmts as D1PreparedStatement[]
    );
    const overallTimeMs = Date.now() - startTime;

    const orders: any = response[0].results;
    const products: any = response[1].results;
    return {
      stats: {
        queries: 1,
        results: 1,
        select: 1,
        overallTimeMs: overallTimeMs,
        log: createSQLLog(sql, response, overallTimeMs),
      },
      order: orders ? orders[0] : {},
      products: products,
    };
  } catch (e: any) {
    return { error: 404, msg: e.toString() };
  }
}

export default function Order({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const { order, products, stats } = loaderData;

  const dispatch = useStatsDispatch();
  useEffect(() => {
    dispatch && stats && dispatch(stats);
  }, [dispatch, stats]);

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
}
