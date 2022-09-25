import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { updateStats } from "./redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "./lib/tools";

const Forms = (props) => {
    const dispatch = useDispatch();
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
        const path = `/api/client?cid=${cid}&rand=${rand}`;
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
        const path = `/api/clientChange?rand=${rand}`;
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
            <div class="card mb-6">
                <header class="card-header">
                    <p class="card-header-title">
                        <span class="icon material-icons">ballot</span>
                        Client information
                    </p>
                </header>
                <div class="card-content">
                    <div class="field">
                        <label class="label">From</label>
                        <div class="field-body">
                            <div class="field">
                                <div class="control icons-left">
                                    <input class="input" type="text" placeholder="Name" onChange={(e) => setClient({ ...client, name: e.target.value })} value={client.name} />
                                    <span class="icon left material-icons">touch_app</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Company</label>

                        <div class="control">
                            <input class="input" type="text" onChange={(e) => setClient({ ...client, company: e.target.value })} placeholder="e.g. Cloudflare Inc" value={client.company} />
                        </div>
                        <p class="help">This field is required</p>
                    </div>
                    <div class="field">
                        <label class="label">City</label>

                        <div class="control">
                            <input class="input" onChange={(e) => setClient({ ...client, city: e.target.value })} type="text" placeholder="e.g. Lisbon" value={client.city} />
                        </div>
                        <p class="help">This field is required</p>
                    </div>

                    <hr />

                    <div class="field grouped">
                        <div class="control">
                            <button onClick={submitClient} class="button green">
                                Submit
                            </button>
                        </div>
                        <div class="control">
                            <button
                                type="reset"
                                onClick={() => {
                                    cancel();
                                }}
                                class="button red">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export { Forms };
