import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { updateStats } from "./redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "./lib/tools";
import { Paginate, AddTableField } from "./tools.jsx";

const Supplier = (props) => {
    const dispatch = useDispatch();
    const { id } = Object.keys(props).length ? props : useParams();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState(false);

    const reloadPage = () => {
        const rand = Math.floor(Math.random() * 1000001);
        const path = `/api/supplier?Id=${id}&rand=${rand}`;
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
                <div class="card mb-6">
                    <header class="card-header">
                        <p class="card-header-title">
                            <span class="icon material-icons">ballot</span>
                            <span class="ml-2">Supplier information</span>
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <AddTableField name="Company Name" value={supplier.CompanyName} />
                                <AddTableField name="Contact Name" value={supplier.ContactName} />
                                <AddTableField name="Contact Title" value={supplier.ContactTitle} />
                                <AddTableField name="Address" value={supplier.Address} />
                                <AddTableField name="City" value={supplier.City} />
                            </div>
                            <div>
                                <AddTableField name="Region" value={supplier.Region} />
                                <AddTableField name="Postal Code" value={supplier.PostalCode} />
                                <AddTableField name="Country" value={supplier.Country} />
                                <AddTableField name="Phone" value={supplier.Phone} />
                                {supplier.Fax ? <AddTableField name="Fax" value={supplier.Fax} /> : false}
                                {supplier.HomePage ? <AddTableField name="Home Page" value={supplier.HomePage} /> : false}
                            </div>
                        </div>

                        <hr />

                        <div class="field grouped">
                            <div class="control">
                                <button
                                    type="reset"
                                    onClick={() => {
                                        navigate(`/suppliers`, { replace: false });
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
                    <h2>No such supplier</h2>
                </div>
            )}
        </>
    );
};

const Suppliers = (props) => {
    const dispatch = useDispatch();
    const { search } = Object.keys(props).length ? props : useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [suppliers, setSuppliers] = useState([]);
    const reloadPage = () => {
        const rand = Math.floor(Math.random() * 1000001);
        const path = `/api/suppliers?page=${page}${count > 0 ? `` : `&count=true`}${search ? `&search=${search}` : ""}&rand=${rand}`;
        fetch(path)
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    if (result.pages) setPages(result.pages);
                    if (result.total) setCount(result.total);
                    setSuppliers(result.suppliers);
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
            {suppliers.length ? (
                <div class="card has-table">
                    <header class="card-header">
                        <p class="card-header-title">Suppliers</p>
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
                                {suppliers.map((supplier, index) => {
                                    return (
                                        <tr>
                                            <td class="image-cell">
                                                <div class="image">
                                                    <img src={`https://avatars.dicebear.com/v2/initials/${supplier.ContactName.split(" ")[0]}-${supplier.ContactName.split(" ").slice(-1)[0]}.svg`} class="rounded-full" />
                                                </div>
                                            </td>
                                            <td data-label="Company">
                                                <Link className="link" to={`/supplier/${supplier.Id}`}>
                                                    {supplier.CompanyName}
                                                </Link>
                                            </td>
                                            <td data-label="Contact">{supplier.ContactName}</td>
                                            <td data-label="Title">{supplier.ContactTitle}</td>
                                            <td data-label="Title">{supplier.City}</td>
                                            <td data-label="Title">{supplier.Country}</td>
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
                    <h2>Loading suppliers...</h2>
                </div>
            )}
        </>
    );
};

export { Suppliers, Supplier };
