import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { updateStats } from "./redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "./lib/tools";
import { Paginate, AddTableField } from "./tools.jsx";

const Customer = (props) => {
    const dispatch = useDispatch();
    const { id } = Object.keys(props).length ? props : useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(false);

    const reloadPage = () => {
        const rand = Math.floor(Math.random() * 1000001);
        const path = `/api/customer?Id=${id}&rand=${rand}`;
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
                <div class="card mb-6">
                    <header class="card-header">
                        <p class="card-header-title">
                            <span class="icon material-icons">ballot</span>
                            <span class="ml-2">Customer information</span>
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <AddTableField name="Company Name" value={customer.CompanyName} />
                                <AddTableField name="Contact Name" value={customer.ContactName} />
                                <AddTableField name="Contact Title" value={customer.ContactTitle} />
                                <AddTableField name="Address" value={customer.Address} />
                                <AddTableField name="City" value={customer.City} />
                            </div>
                            <div>
                                <AddTableField name="Postal Code" value={customer.PostalCode} />
                                <AddTableField name="Region" value={customer.Region} />
                                <AddTableField name="Country" value={customer.Country} />
                                <AddTableField name="Phone" value={customer.Phone} />
                                <AddTableField name="Fax" value={customer.Fax} />
                                {customer.HomePage ? <AddTableField name="HomePage" value={customer.HomePage} /> : false}
                            </div>
                        </div>

                        <hr />

                        <div class="field grouped">
                            <div class="control">
                                <button
                                    type="reset"
                                    onClick={() => {
                                        navigate(`/customers`, { replace: false });
                                    }}
                                    class="button red">
                                    Go back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div class="card-content">
                    <h2>No such customer</h2>
                </div>
            )}
        </>
    );
};

const Customers = (props) => {
    const dispatch = useDispatch();
    const { search } = Object.keys(props).length ? props : useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [customers, setCustomers] = useState([]);
    const reloadPage = () => {
        const rand = Math.floor(Math.random() * 1000001);
        const path = `/api/customers?page=${page}${count > 0 ? `` : `&count=true`}${search ? `&search=${search}` : ""}&rand=${rand}`;
        fetch(path)
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    if (result.pages) setPages(result.pages);
                    if (result.total) setCount(result.total);
                    setCustomers(result.customers);
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
                    setIsLoaded(true);
                    console.log(error);
                }
            );
    };

    useEffect(() => {
        if (isLoaded) {
            if (search) {
                if (page != 1) {
                    setPage(1);
                } else {
                    reloadPage();
                }
            } else {
                reloadPage();
            }
        }
    }, [search]);

    useEffect(() => {
        reloadPage();
    }, [page]);

    return (
        <>
            {customers.length ? (
                <div class="card has-table">
                    <header class="card-header">
                        <p class="card-header-title">Customers</p>
                        <a class="card-header-icon">
                            <span
                                class="material-icons"
                                onClick={() => {
                                    reloadPage();
                                }}>
                                redo
                            </span>
                        </a>
                    </header>
                    <div class="card-content">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Company</th>
                                    <th>Contact</th>
                                    <th>Title</th>
                                    <th>City</th>
                                    <th>Country</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer, index) => {
                                    return (
                                        <tr>
                                            <td class="image-cell">
                                                <div class="image">
                                                    <img src={`https://avatars.dicebear.com/v2/initials/${customer.ContactName.split(" ")[0]}-${customer.ContactName.split(" ").slice(-1)[0]}.svg`} class="rounded-full" />
                                                </div>
                                            </td>
                                            <td data-label="Company">
                                                <Link className="link" to={`/customer/${customer.Id}`}>
                                                    {customer.CompanyName}
                                                </Link>
                                            </td>
                                            <td data-label="Contact">{customer.ContactName}</td>
                                            <td data-label="Title">{customer.ContactTitle}</td>
                                            <td data-label="City">{customer.City}</td>
                                            <td data-label="Country">{customer.Country}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <Paginate pages={pages} page={page} setPage={setPage} />
                    </div>
                </div>
            ) : (
                <div class="card-content">
                    <h2>No results</h2>
                </div>
            )}
        </>
    );
};

export { Customers, Customer };
