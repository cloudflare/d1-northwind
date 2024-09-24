import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Paginate } from "~/components";
import { useStatsDispatch } from "~/components/StatsContext";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

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
  }/api/products?page=${page}${Number(count) > 0 ? `` : `&count=true`}${
    search ? `&search=${search}` : ""
  }&rand=${rand}`;

  const res = await fetch(path);
  const result = (await res.json()) as any;

  return json({ ...result });
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

const Products = () => {
  const data = useLoaderData<LoaderType>();
  const navigate = useNavigate();
  const { products, page, pages } = data;
  const dispatch = useStatsDispatch();

  useEffect(() => {
    dispatch && data.stats && dispatch(data.stats);
  }, [dispatch, data.stats]);

  const setPage = (page: number) => {
    navigate(`/products?page=${page}`);
  };

  return (
    <>
      {products.length ? (
        <div className="card has-table">
          <header className="card-header">
            <p className="card-header-title">Products</p>
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
                  <th>Name</th>
                  <th>Qt per unit</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Orders</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td data-label="Product">
                        <Link className="link" to={`/product/${product.Id}`}>
                          {product.ProductName}
                        </Link>
                      </td>
                      <td data-label="Qpu">{product.QuantityPerUnit}</td>
                      <td data-label="Price">${product.UnitPrice}</td>
                      <td data-label="Stock">{product.UnitsInStock}</td>
                      <td data-label="Orders">{product.UnitsOnOrder}</td>
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
          <h2>Loading products...</h2>
        </div>
      )}
    </>
  );
};

export default Products;
