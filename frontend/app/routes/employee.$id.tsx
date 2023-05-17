import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddTableField } from "~/components/AddTableField";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import invariant from "tiny-invariant";
import { useStatsDispatch } from "~/components/StatsContext";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Missing id");

  const rand = Math.floor(Math.random() * 1000001);
  const path = `${
    process.env.NODE_ENV === "production"
      ? "https://api.northwind.d1sql.com"
      : "http://127.0.0.1:8787"
  }/api/employee?Id=${params.id}&rand=${rand}`;

  const res = await fetch(path);
  const result = (await res.json()) as any;

  return json({ ...result });
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

const Employee = () => {
  const navigate = useNavigate();
  const data = useLoaderData<LoaderType>();
  const { employee } = data;
  const dispatch = useStatsDispatch();
  useEffect(() => {
    dispatch && data.stats && dispatch(data.stats);
  }, [dispatch, data.stats]);

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
};

export default Employee;
