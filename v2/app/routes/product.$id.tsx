import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateStats } from "~/redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "~/lib/tools";
import { AddTableField } from "~/components";

const Product = (props) => {
  const dispatch = useDispatch();
  const { id } = Object.keys(props).length ? props : useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(false);

  const reloadPage = () => {
    const rand = Math.floor(Math.random() * 1000001);
    const path = `https://v2-worker.rozenmd.workers.dev/api/product?Id=${id}&rand=${rand}`;
    fetch(path)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setProduct(result.product);
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
  };

  useEffect(() => {
    reloadPage();
  }, []);

  return (
    <>
      {product ? (
        <div className="card mb-6">
          <header className="card-header">
            <p className="card-header-title">
              <span className="icon material-icons">ballot</span>
              <span className="ml-2">Product information</span>
            </p>
          </header>

          <div className="card-content">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <AddTableField
                  name="Product Name"
                  value={product.ProductName}
                />
                <AddTableField
                  name="Supplier"
                  link={`/supplier/${product.SupplierId}`}
                  value={product.SupplierName}
                />
                <AddTableField
                  name="Quantity Per Unit"
                  value={product.QuantityPerUnit}
                />
                <AddTableField
                  name="Unit Price"
                  value={`$${product.UnitPrice}`}
                />
              </div>
              <div>
                <AddTableField
                  name="Units In Stock"
                  value={product.UnitsInStock}
                />
                <AddTableField
                  name="Units In Order"
                  value={product.UnitsOnOrder}
                />
                <AddTableField
                  name="Reorder Level"
                  value={product.ReorderLevel}
                />
                <AddTableField
                  name="Discontinued"
                  value={product.Discontinued}
                />
              </div>
            </div>

            <hr />

            <div className="field grouped">
              <div className="control">
                <button
                  type="reset"
                  onClick={() => {
                    navigate(`/products`, { replace: false });
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
          <h2>No such product</h2>
        </div>
      )}
    </>
  );
};

export default Product;
