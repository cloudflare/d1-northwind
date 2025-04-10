import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/product.$id";
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
      "SELECT Product.Id, ProductName, SupplierId, CategoryId, QuantityPerUnit, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued, Supplier.CompanyName AS SupplierName FROM Product, Supplier WHERE Product.Id = ?1 AND Supplier.Id=Product.SupplierId",
    ],
    [[id]]
  );
  try {
    const startTime = Date.now();
    const product: any = await (stmts[0] as D1PreparedStatement).all();
    const overallTimeMs = Date.now() - startTime;

    return {
      stats: {
        queries: 1,
        results: 1,
        select: 1,
        overallTimeMs: overallTimeMs,
        log: createSQLLog(sql, [product], overallTimeMs),
      },
      product: product.results[0],
    };
  } catch (e: any) {
    return { error: 404, msg: e.toString() };
  }
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const { product, stats } = loaderData;

  const dispatch = useStatsDispatch();
  useEffect(() => {
    dispatch && stats && dispatch(stats);
  }, [dispatch, stats]);

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
}
