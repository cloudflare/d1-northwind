import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/supplier.$id";
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
      "SELECT Id,CompanyName,ContactName,ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax, HomePage FROM Supplier WHERE Id = ?1",
    ],
    [[id]]
  );
  try {
    const startTime = Date.now();
    const supplier: any = await (stmts[0] as D1PreparedStatement).all();
    const overallTimeMs = Date.now() - startTime;

    return {
      stats: {
        queries: 1,
        results: 1,
        select: 1,
        overallTimeMs: overallTimeMs,
        log: createSQLLog(sql, [supplier], overallTimeMs),
      },
      supplier: supplier.results[0],
    };
  } catch (e: any) {
    return { error: 404, msg: e.toString() };
  }
}

export default function Supplier({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const { supplier, stats } = loaderData;

  const dispatch = useStatsDispatch();
  useEffect(() => {
    dispatch && stats && dispatch(stats);
  }, [dispatch, stats]);

  return (
    <>
      {supplier ? (
        <div className="card mb-6">
          <header className="card-header">
            <p className="card-header-title">
              <span className="icon material-icons">ballot</span>
              <span className="ml-2">Supplier information</span>
            </p>
          </header>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <AddTableField
                  name="Company Name"
                  value={supplier.CompanyName}
                />
                <AddTableField
                  name="Contact Name"
                  value={supplier.ContactName}
                />
                <AddTableField
                  name="Contact Title"
                  value={supplier.ContactTitle}
                />
                <AddTableField name="Address" value={supplier.Address} />
                <AddTableField name="City" value={supplier.City} />
              </div>
              <div>
                <AddTableField name="Region" value={supplier.Region} />
                <AddTableField name="Postal Code" value={supplier.PostalCode} />
                <AddTableField name="Country" value={supplier.Country} />
                <AddTableField name="Phone" value={supplier.Phone} />
                {supplier.Fax ? (
                  <AddTableField name="Fax" value={supplier.Fax} />
                ) : (
                  false
                )}
                {supplier.HomePage ? (
                  <AddTableField name="Home Page" value={supplier.HomePage} />
                ) : (
                  false
                )}
              </div>
            </div>

            <hr />

            <div className="field grouped">
              <div className="control">
                <button
                  type="reset"
                  onClick={() => {
                    navigate(`/suppliers`, { replace: false });
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
          <h2>No such supplier</h2>
        </div>
      )}
    </>
  );
}
