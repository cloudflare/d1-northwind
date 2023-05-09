import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { updateStats } from "../redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "../lib/tools";
import { Paginate } from "~/components";

const Products = (props) => {
  const dispatch = useDispatch();
  const { search } = Object.keys(props).length ? props : useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [products, setProducts] = useState([]);
  const reloadPage = () => {
    const rand = Math.floor(Math.random() * 1000001);
    const path = `https://northwind.d1sql.com/api/products?page=${page}${
      count > 0 ? `` : `&count=true`
    }${search ? `&search=${search}` : ""}&rand=${rand}`;
    fetch(path)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (result.pages) setPages(result.pages);
          if (result.total) setCount(result.total);
          setProducts(result.products);
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
      {products.length ? (
        <div className="card has-table">
          <header className="card-header">
            <p className="card-header-title">Products</p>
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
                  <th>Name</th>
                  <th>Qt per unit</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Orders</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  return (
                    <tr>
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

export { Products, Product };
export default Products;
