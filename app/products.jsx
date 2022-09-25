import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { updateStats } from "./redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "./lib/tools";
import { Paginate, AddTableField } from "./tools.jsx";

const Product = (props) => {
    const dispatch = useDispatch();
    const { id } = Object.keys(props).length ? props : useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(false);

    const reloadPage = () => {
        const rand = Math.floor(Math.random() * 1000001);
        const path = `/api/product?Id=${id}&rand=${rand}`;
        fetch(path)
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setProduct(result.product);
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
            {product ? (
                <div class="card mb-6">
                    <header class="card-header">
                        <p class="card-header-title">
                            <span class="icon material-icons">ballot</span>
                            <span class="ml-2">Product information</span>
                        </p>
                    </header>

                    <div class="card-content">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <AddTableField name="Product Name" value={product.ProductName} />
                                <AddTableField name="Supplier" link={`/supplier/${product.SupplierId}`} value={product.SupplierName} />
                                <AddTableField name="Quantity Per Unit" value={product.QuantityPerUnit} />
                                <AddTableField name="Unit Price" value={`$${product.UnitPrice}`} />
                            </div>
                            <div>
                                <AddTableField name="Units In Stock" value={product.UnitsInStock} />
                                <AddTableField name="Units In Order" value={product.UnitsOnOrder} />
                                <AddTableField name="Reorder Level" value={product.ReorderLevel} />
                                <AddTableField name="Discontinued" value={product.Discontinued} />
                            </div>
                        </div>

                        <hr />

                        <div class="field grouped">
                            <div class="control">
                                <button
                                    type="reset"
                                    onClick={() => {
                                        navigate(`/products`, { replace: false });
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
                    <h2>No such product</h2>
                </div>
            )}
        </>
    );
};

const Products = (props) => {
    const dispatch = useDispatch();
    const { search } = Object.keys(props).length ? props : useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [products, setProducts] = useState([]);
    const reloadPage = () => {
        const rand = Math.floor(Math.random() * 1000001);
        const path = `/api/products?page=${page}${count > 0 ? `` : `&count=true`}${search ? `&search=${search}` : ""}&rand=${rand}`;
        fetch(path)
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    if (result.pages) setPages(result.pages);
                    if (result.total) setCount(result.total);
                    setProducts(result.products);
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
            {products.length ? (
                <div class="card has-table">
                    <header class="card-header">
                        <p class="card-header-title">Products</p>
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
                                    <th>Name</th>
                                    <th>Qt per unit</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Orders</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => {
                                    return (
                                        <tr>
                                            <td data-label="Product">
                                                <Link className="link" to={`/product/${product.Id}`}>
                                                    {product.ProductName}
                                                </Link>
                                            </td>
                                            <td data-label="Qpu">{product.QuantityPerUnit}</td>
                                            <td data-label="Price">${product.UnitPrice}</td>
                                            <td data-label="Stock">{product.UnitsInStock}</td>
                                            <td data-label="Orders">{product.UnitsOnOrder}</td>
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
                    <h2>Loading products...</h2>
                </div>
            )}
        </>
    );
};

export { Products, Product };
