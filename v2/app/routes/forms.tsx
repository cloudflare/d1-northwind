import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getPerformanceEvent } from "~/lib/tools";

const Forms = (props) => {
  const navigate = useNavigate();
  const { cid } = Object.keys(props).length ? props : useParams();
  const { back } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [client, setClient] = useState({
    cid: cid,
    name: false,
    company: false,
    city: false,
    progress: 0,
    created: 0,
  });

  const cancel = () => {
    if (props.cancel) props.cancel();
    else if (back) {
      navigate(window.atob(back), { replace: false });
    } else {
      navigate(`/tables`, { replace: false });
    }
  };

  useEffect(() => {
    const rand = Math.floor(Math.random() * 1000001);
    const path = `https://v2-worker.rozenmd.workers.dev/api/client?cid=${cid}&rand=${rand}`;
    fetch(path)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (result.error) {
            setError(error);
          } else {
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
            setClient(result.client);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [cid]);

  const submitClient = useCallback(async () => {
    const rand = Math.floor(Math.random() * 1000001);
    const path = `https://v2-worker.rozenmd.workers.dev/api/clientChange?rand=${rand}`;
    fetch(path, {
      method: "POST",
      body: JSON.stringify(client),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setClient(result.client);
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
          if (props.postSubmit) props.postSubmit();
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [client]);

  return (
    <>
      <div className="card mb-6">
        <header className="card-header">
          <p className="card-header-title">
            <span className="icon material-icons">ballot</span>
            Client information
          </p>
        </header>
        <div className="card-content">
          <div className="field">
            <label className="label">From</label>
            <div className="field-body">
              <div className="field">
                <div className="control icons-left">
                  <input
                    className="input"
                    type="text"
                    placeholder="Name"
                    onChange={(e) =>
                      setClient({ ...client, name: e.target.value })
                    }
                    value={client.name}
                  />
                  <span className="icon left material-icons">touch_app</span>
                </div>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Company</label>

            <div className="control">
              <input
                className="input"
                type="text"
                onChange={(e) =>
                  setClient({ ...client, company: e.target.value })
                }
                placeholder="e.g. Cloudflare Inc"
                value={client.company}
              />
            </div>
            <p className="help">This field is required</p>
          </div>
          <div className="field">
            <label className="label">City</label>

            <div className="control">
              <input
                className="input"
                onChange={(e) => setClient({ ...client, city: e.target.value })}
                type="text"
                placeholder="e.g. Lisbon"
                value={client.city}
              />
            </div>
            <p className="help">This field is required</p>
          </div>

          <hr />

          <div className="field grouped">
            <div className="control">
              <button onClick={submitClient} className="button green">
                Submit
              </button>
            </div>
            <div className="control">
              <button
                type="reset"
                onClick={() => {
                  cancel();
                }}
                className="button red"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forms;
