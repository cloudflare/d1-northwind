import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateStats } from "~/redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "~/lib/tools";
import { AddTableField } from "~/components/AddTableField";

const Customer = (props) => {
  const dispatch = useDispatch();
  const { id } = Object.keys(props).length ? props : useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(false);

  const reloadPage = () => {
    const rand = Math.floor(Math.random() * 1000001);
    const path = `https://northwind.d1sql.com/api/customer?Id=${id}&rand=${rand}`;
    fetch(path)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setCustomer(result.customer);
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

            <hr />

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
};

export default Customer;
