import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/customer.$id";
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
      "SELECT Id, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax FROM Customer WHERE Id = ?1",
    ],
    [[id]]
  );
  try {
    const startTime = Date.now();
    const customer: any = await (stmts[0] as D1PreparedStatement).all();
    const overallTimeMs = Date.now() - startTime;

    return {
      stats: {
        queries: 1,
        results: 1,
        select: 1,
        overallTimeMs: overallTimeMs,
        log: createSQLLog(sql, [customer], overallTimeMs),
      },
      customer: customer.results[0],
    };
  } catch (e: any) {
    return { error: 404, msg: e.toString() };
  }
}

export default function Customer({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const { customer, stats } = loaderData;

  const dispatch = useStatsDispatch();
  useEffect(() => {
    dispatch && stats && dispatch(stats);
  }, [dispatch, stats]);

  return (
    <>
      {customer ? (
        <div className="card mb-6">
          <header className="card-header">
            <p className="card-header-title">
              <span className="icon material-icons">ballot</span>
              <span className="ml-2">Customer information</span>
            </p>
          </header>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <AddTableField
                  name="Company Name"
                  value={customer.CompanyName}
                />
                <AddTableField
                  name="Contact Name"
                  value={customer.ContactName}
                />
                <AddTableField
                  name="Contact Title"
                  value={customer.ContactTitle}
                />
                <AddTableField name="Address" value={customer.Address} />
                <AddTableField name="City" value={customer.City} />
              </div>
              <div>
                <AddTableField name="Postal Code" value={customer.PostalCode} />
                <AddTableField name="Region" value={customer.Region} />
                <AddTableField name="Country" value={customer.Country} />
                <AddTableField name="Phone" value={customer.Phone} />
                <AddTableField name="Fax" value={customer.Fax} />
                {customer.HomePage ? (
                  <AddTableField name="HomePage" value={customer.HomePage} />
                ) : (
                  false
                )}
              </div>
            </div>

            <hr className="text-gray-200" />

            <div className="field grouped">
              <div className="control">
                <button
                  type="reset"
                  onClick={() => {
                    navigate(`/customers`, { replace: false });
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
          <h2>No such customer</h2>
        </div>
      )}
    </>
  );
}
