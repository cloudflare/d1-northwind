import { useEffect } from "react";
import { useNavigate } from "react-router";

import { createSQLLog } from "~/lib/utils";
import { prepareStatements } from "~/lib/utils";
import { useStatsDispatch } from "~/components/StatsContext";
import { AddTableField } from "~/components";

import type { Route } from "./+types/employee.$id";

export async function loader({ context, params }: Route.LoaderArgs) {
  const session = context.cloudflare.env.DB.withSession("first-unconstrained");
  const { id } = params;
  const [stmts, sql] = prepareStatements(
    session,
    false,
    [
      "SELECT Report.Id AS ReportId, Report.FirstName AS ReportFirstName, Report.LastName AS ReportLastName, Employee.Id, Employee.LastName, Employee.FirstName, Employee.Title, Employee.TitleOfCourtesy, Employee.BirthDate, Employee.HireDate, Employee.Address, Employee.City, Employee.Region, Employee.PostalCode, Employee.Country, Employee.HomePhone, Employee.Extension, Employee.Photo, Employee.Notes, Employee.ReportsTo, Employee.PhotoPath FROM Employee LEFT JOIN Employee AS Report ON Report.Id = Employee.ReportsTo WHERE Employee.Id = ?1",
    ],
    [[id]]
  );
  try {
    const startTime = Date.now();
    const employee: any = await (stmts[0] as D1PreparedStatement).all();
    const overallTimeMs = Date.now() - startTime;

    return {
      stats: {
        queries: 1,
        results: 1,
        select_leftjoin: 1,
        overallTimeMs: overallTimeMs,
        log: createSQLLog(sql, [employee], overallTimeMs),
      },
      employee: employee.results[0],
    };
  } catch (e: any) {
    return { error: 404, msg: e.toString() };
  }
}

export default function Employee({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const { employee, stats } = loaderData;
  const dispatch = useStatsDispatch();
  useEffect(() => {
    dispatch && stats && dispatch(stats);
  }, [dispatch, stats]);

  return (
    <>
      {employee ? (
        <div className="card mb-6">
          <header className="card-header">
            <p className="card-header-title">
              <span className="icon material-icons">ballot</span>
              <span className="ml-2">Employee information</span>
            </p>
          </header>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <AddTableField
                  name="Name"
                  value={`${employee.FirstName} ${employee.LastName}`}
                />
                <AddTableField name="Title" value={employee.Title} />
                <AddTableField
                  name="Title Of Courtesy"
                  value={employee.TitleOfCourtesy}
                />
                <AddTableField name="Birth Date" value={employee.BirthDate} />
                <AddTableField name="Hire Date" value={employee.HireDate} />
                <AddTableField name="Address" value={employee.Address} />
                <AddTableField name="City" value={employee.City} />
              </div>
              <div>
                <AddTableField name="Postal Code" value={employee.PostalCode} />
                <AddTableField name="Country" value={employee.Country} />
                <AddTableField name="Home Phone" value={employee.HomePhone} />
                <AddTableField name="Extension" value={employee.Extension} />
                <AddTableField name="Notes" value={employee.Notes} />
                {employee.ReportsTo ? (
                  <AddTableField
                    name="Reports To"
                    link={`/employee/${employee.ReportsTo}`}
                    value={`${employee.ReportFirstName} ${employee.ReportLastName}`}
                  />
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
                    navigate(`/employees`, { replace: false });
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
          <h2>No such employee</h2>
        </div>
      )}
    </>
  );
}
