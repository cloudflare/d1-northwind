import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./css/admin.scss";
import { Nav } from "./nav.jsx";
import { Aside } from "./aside.jsx";
import { Suppliers, Supplier } from "./suppliers.jsx";
import { Products, Product } from "./products.jsx";
import { Orders, Order } from "./orders.jsx";
import { Employees, Employee } from "./employees.jsx";
import { Customers, Customer } from "./customers.jsx";
import { Search } from "./search.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { updateClock, clockReducer } from "./redux/clock";
import { statsReducer, updateStats, selectStats } from "./redux/stats";

performance.clearResourceTimings();

const App = () => {
    const [path, setPath] = useState(["Main"]);
    let location = useLocation();
    const stats = useSelector(selectStats);
    // let navigate = useNavigate();
    const dispatch = useDispatch();
    // const account = useSelector(selectAccount);

    useEffect(() => {
        // dispatch(login());
        setInterval(() => {
            dispatch(updateClock());
        }, 1000);
    }, []); // runs only once

    useEffect(() => {
        let i = routes.map((e) => e.path).indexOf(location.pathname);
        if (i != -1) setPath([routes[i].name]);
        // https://fkhadra.github.io/react-toastify/introduction/
        /*
        toast(`Navigating to ${path}`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        */
    }, [location]);

    return (
        <>
            <ToastContainer />
            <Nav />
            <Aside />
            {/* <Path path={path} />*/}
            <section class="section main-section">
                <Routes>
                    {routes.map((r) => {
                        return <Route path={r.path} element={r.element} />;
                    })}
                </Routes>
            </section>
        </>
    );
};

const Dashboard = () => {
    const [status, setStatus] = useState({
        cf: {},
        tables: [],
        module_list: [],
        database_list: [],
    });
    const stats = useSelector(selectStats);
    useEffect(() => {
        const path = `/api/status`;
        fetch(path)
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setStatus(result);
                },
                (error) => {}
            );
    }, []); // runs only once

    return (
        <>
            <div class="card-content">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-xl">Worker</p>
                        <p class="text-gray-800 text-sm">Colo: {status.cf.colo}</p>
                        <p class="text-gray-800 text-sm">Country: {status.cf.country}</p>
                    </div>
                    <div>
                        <p class="text-xl">SQL Metrics</p>
                        <p class="text-gray-800 text-sm">Query count: {stats.queries}</p>
                        <p class="text-gray-800 text-sm">Results count: {stats.results}</p>
                        <p class="text-gray-800 text-sm"># SELECT: {stats.select}</p>
                        <p class="text-gray-800 text-sm"># SELECT WHERE: {stats.select_where}</p>
                        <p class="text-gray-800 text-sm"># SELECT LEFT JOIN: {stats.select_leftjoin}</p>
                    </div>
                </div>
                <p class="text-xl pt-6">Activity log</p>
                <p class="text-gray-800 text-xs">Explore the app and see metrics here</p>
                {stats.log.map((log) => {
                    console.log(log);
                    if (log.type == "sql")
                        return (
                            <div class="pt-2">
                                <p class="text-gray-400 text-xs">
                                    {log.ts}, {log.served_by}, {log.duration}ms
                                </p>
                                {log.query.split("\n").map((l) => {
                                    return <p class="text-sm font-mono break-all">{l}</p>;
                                })}
                            </div>
                        );
                    /*
                    if (log.type == "api")
                        return (
                            <div class="pt-2">
                                <p class="text-gray-400 text-xs">
                                    {log.ts}, API, {log.duration}ms
                                </p>
                                <pre class="text-sm">{log.path}</pre>
                            </div>
                        );
                    */
                })}
            </div>
        </>
    );
};

const Iframe = (props) => {
    return <div class="mt-6 video" dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }} />;
};

const Home = () => {
    return (
        <>
            <div class="card-content">
                <p class="text-2xl">Welcome to Northwind Traders</p>
                <div class="pt-2">
                    <p class="text-gray-400 text-lg">Running on Cloudflare's D1</p>
                </div>
                <img class="float-right object-scale-down w-96" src="https://imagedelivery.net/4wj01aQOZZ0hemsvbxWAvA/763bcbcd-da6d-46ec-f5e1-70c1c1a33d00/public" />
                <p class="text-base pt-4">
                    This is a demo of the Northwind dataset, running on{" "}
                    <a class="link" href="https://workers.cloudflare.com/" target="_new">
                        Cloudflare Workers
                    </a>
                    , and D1 - Cloudflare's newest SQL database, running on SQLite.
                </p>
                <p class="text-base pt-4">
                    Read our{" "}
                    <a class="link" href="https://blog.cloudflare.com/introducing-d1" target="_new">
                        D1 announcement
                    </a>{" "}
                    to learn more about D1.
                </p>
                <p class="text-base pt-4">
                    This dataset was sourced from{" "}
                    <a class="link" href="https://github.com/jpwhite3/northwind-SQLite3" target="_new">
                        northwind-SQLite3
                    </a>
                    .
                </p>
                <p class="text-base pt-4">You can use the UI to explore Supplies, Orders, Customers, Employees and Products, or you can use search if you know what you're looking for.</p>

                {/*
                <Iframe iframe={`<iframe src="https://iframe.videodelivery.net/6edaeeba976aca2e7dae8a21aa2e60ef" style="border: none; position: absolute; top: 0; height: 100%; width: 100%" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowfullscreen="true" />`} />
                */}
            </div>
        </>
    );
};

const routes = [
    {
        path: "/",
        element: <Home />,
        name: "Home",
    },
    {
        path: "/dash",
        element: <Dashboard />,
        name: "Dashboard",
    },
    /*
    {
        path: "/sim",
        element: <Sim />,
        name: "Simulations",
    },
*/
    {
        path: "/search/:q",
        element: <Search />,
        name: "Search with keyword",
    },
    {
        path: "/search",
        element: <Search />,
        name: "Search",
    },
    /*
    {
        path: "/forms/:cid/:back",
        element: <Forms />,
        name: "Forms",
    },
    {
        path: "/forms/:cid",
        element: <Forms />,
        name: "Forms",
    },
    {
        path: "/profile",
        element: <Profile />,
        name: "Profile",
    },
    {
        path: "/login",
        element: (
            <Modal title="Login Modal" footer={false}>
                <Login />
            </Modal>
        ),
        name: "Login",
    },
*/
    {
        path: "/suppliers",
        element: <Suppliers />,
        name: "Suppliers",
    },
    {
        path: "/supplier/:id",
        element: <Supplier />,
        name: "Supplier",
    },
    {
        path: "/products",
        element: <Products />,
        name: "Products",
    },
    {
        path: "/product/:id",
        element: <Product />,
        name: "Product",
    },
    {
        path: "/orders",
        element: <Orders />,
        name: "Orders",
    },
    {
        path: "/order/:id",
        element: <Order />,
        name: "Order",
    },
    {
        path: "/employees",
        element: <Employees />,
        name: "Employees",
    },
    {
        path: "/employee/:id",
        element: <Employee />,
        name: "Employee",
    },
    {
        path: "/customers",
        element: <Customers />,
        name: "Customers",
    },
    {
        path: "/customer/:id",
        element: <Customer />,
        name: "Customer",
    },
];

// the intended pattern is to have only a single store
// https://redux.js.org/faq/store-setup

const store = configureStore({
    reducer: {
        // account: accountReducer,
        clock: clockReducer,
        stats: statsReducer,
    },
});

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
    document.querySelector("#app")
);
