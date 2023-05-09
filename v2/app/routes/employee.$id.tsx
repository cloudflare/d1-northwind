import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateStats } from "../redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "../lib/tools";
import { AddTableField } from "~/components/AddTableField";

const Employee = (props) => {
  const dispatch = useDispatch();
  const { id } = Object.keys(props).length ? props : useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(false);

  const reloadPage = () => {
    const rand = Math.floor(Math.random() * 1000001);
    const path = `https://northwind.d1sql.com/api/employee?Id=${id}&rand=${rand}`;
    fetch(path)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setEmployee(result.employee);
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
  }, [id]);

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
