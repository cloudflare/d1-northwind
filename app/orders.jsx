import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { updateStats } from "./redux/stats";
import { useDispatch } from "react-redux";
import { getPerformanceEvent } from "./lib/tools";
import { Paginate, AddTableField } from "./tools.jsx";

const Order = (props) => {
    const dispatch = useDispatch();
    const { id } = Object.keys(props).length ? props : useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(false);
    const [products, setProducts] = useState([]);

    const reloadPage = () => {
        const rand = Math.floor(Math.random() * 1000001);
        const path = `/api/order?Id=${id}&rand=${rand}`;
        fetch(path)
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setOrder(result.order);
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
                    console.log(error);
                }
            );
    };

    useEffect(() => {
        reloadPage();
    }, []);

    return (
        <>
            {order ? (
                <div class="card mb-6">
                    <header class="card-header">
                        <p class="card-header-title">
                            <span class="icon material-icons">ballot</span>
                            <span class="ml-2">Order information</span>
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <AddTableField name="Customer Id" link={`/customer/${order.CustomerId}`} value={order.CustomerId} />
                                <AddTableField name="Ship Name" value={order.ShipName} />
                                <AddTableField name="Total Products" value={order.TotalProducts} />
                                <AddTableField name="Total Quantity" value={order.TotalProductsItems} />
                                <AddTableField name="Total Price" value={`$${parseFloat(order.TotalProductsPrice).toFixed(2)}`} />
                                <AddTableField name="Total Discount" value={`$${parseFloat(order.TotalProductsDiscount).toFixed(2)}`} />
                                <AddTableField name="Ship Via" value={order.ShipViaCompanyName} />
                                <AddTableField name="Freight" value={`$${parseFloat(order.Freight).toFixed(2)}`} />
                            </div>
                            <div>
                                <AddTableField name="Order Date" value={order.OrderDate} />
                                <AddTableField name="Required Date" value={order.RequiredDate} />
                                <AddTableField name="Shipped Date" value={order.ShippedDate} />
                                <AddTableField name="Ship City" value={order.ShipCity} />
                                <AddTableField name="Ship Region" value={order.ShipRegion} />
                                <AddTableField name="Ship Postal Code" value={order.ShipPostalCode} />
                                <AddTableField name="Ship Country" value={order.ShipCountry} />
                            </div>
                        </div>
                    </div>
                    <div class="card has-table">
                        <header class="card-header">
                            <p class="card-header-title">Products in Order</p>
                        </header>
                        <div class="card-content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Order Price</th>
                                        <th>Total Price</th>
                                        <th>Discount</th>
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
                                                <td data-label="Quantity">{product.Quantity}</td>
                                                <td data-label="OrderPrice">{`$${parseFloat(product.OrderUnitPrice).toFixed(2)}`}</td>
                                                <td data-label="TotalPrice">{`$${parseFloat(product.OrderUnitPrice * product.Quantity).toFixed(2)}`}</td>
                                                <td data-label="Discount">{`${product.Discount * 100}%`}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="field grouped">
                            <div class="control">
                                <button
                                    type="reset"
                                    onClick={() => {
                                        navigate(`/orders`, { replace: false });
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
                    <h2>No such order</h2>
                </div>
            )}
        </>
    );
};

const Orders = (props) => {
    const dispatch = useDispatch();
    const { search } = Object.keys(props).length ? props : useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [orders, setOrders] = useState([]);
    const reloadPage = () => {
        const rand = Math.floor(Math.random() * 1000001);
        const path = `/api/orders?page=${page}${count > 0 ? `` : `&count=true`}${search ? `&search=${search}` : ""}&rand=${rand}`;
        fetch(path)
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    if (result.pages) setPages(result.pages);
                    if (result.total) setCount(result.total);
                    setOrders(result.orders);
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
            {orders.length ? (
                <div class="card has-table">
                    <header class="card-header">
                        <p class="card-header-title">Orders</p>
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
                                    <th>Id</th>
                                    <th>Total Price</th>
                                    <th>Products</th>
                                    <th>Quantity</th>
                                    <th>Shipped</th>
                                    <th>Ship Name</th>
                                    <th>City</th>
                                    <th>Country</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => {
                                    return (
                                        <tr>
                                            <td data-label="Id">
                                                <Link className="link" to={`/order/${order.Id}`}>
                                                    {order.Id}
                                                </Link>
                                            </td>
                                            <td data-label="Price">{`$${parseFloat(order.TotalProductsPrice).toFixed(2)}`}</td>
                                            <td data-label="Products">{order.TotalProducts}</td>
                                            <td data-label="Quantity">{order.TotalProductsItems}</td>
                                            <td data-label="Date">{order.OrderDate}</td>
                                            <td data-label="Name">{order.ShipName}</td>
                                            <td data-label="City">{order.ShipCity}</td>
                                            <td data-label="Country">{order.ShipCountry}</td>
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
                    <h2>Loading orders...</h2>
                </div>
            )}
        </>
    );
};

export { Orders, Order };
