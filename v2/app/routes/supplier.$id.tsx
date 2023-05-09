import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateStats } from "../redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "~/lib/tools";
import { AddTableField } from "~/components";

const Supplier = (props) => {
  const dispatch = useDispatch();
  const { id } = Object.keys(props).length ? props : useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(false);

  const reloadPage = () => {
    const rand = Math.floor(Math.random() * 1000001);
    const path = `https://v2-worker.rozenmd.workers.dev/api/supplier?Id=${id}&rand=${rand}`;
    fetch(path)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setSupplier(result.supplier);
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
};

export default Supplier;
