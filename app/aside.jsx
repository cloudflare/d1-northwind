import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Aside = (props) => {

    return (
        <>
            <aside class="aside is-placed-left is-expanded">
                <div class="aside-tools">
                    <div>
                        <b class="font-black">Northwind</b> Traders
                    </div>
                </div>
                <div class="menu is-menu-main">
                    <p class="menu-label">General</p>
                    <ul class="menu-list">
                        <li>
                            <NavLink to="/" activeClassName={"active"} end>
                                <span class="icon material-icons">home</span>
                                <span class="menu-item-label">Home</span>
                            </NavLink>
                            <NavLink to="/dash" activeClassName={"active"}>
                                <span class="icon material-icons">display_settings</span>
                                <span class="menu-item-label">Dashboard</span>
                            </NavLink>
                            {/*
                            <NavLink to="/sim" activeClassName={"active"} end>
                                <span class="icon material-icons">dynamic_form</span>
                                <span class="menu-item-label">Simulations</span>
                            </NavLink>
                            */}
                        </li>
                    </ul>
                    <p class="menu-label">Backoffice</p>
                    <ul class="menu-list">
                        <li>
                            <NavLink to="/suppliers" activeClassName={"active"}>
                                <span class="icon material-icons">inventory</span>
                                <span class="menu-item-label">Suppliers</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/products" activeClassName={"active"}>
                                <span class="icon material-icons">production_quantity_limits</span>
                                <span class="menu-item-label">Products</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/orders" activeClassName={"active"}>
                                <span class="icon material-icons">shopping_cart</span>
                                <span class="menu-item-label">Orders</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/employees" activeClassName={"active"}>
                                <span class="icon material-icons">badge</span>
                                <span class="menu-item-label">Employees</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/customers" activeClassName={"active"}>
                                <span class="icon material-icons">group</span>
                                <span class="menu-item-label">Customers</span>
                            </NavLink>
                        </li>
                        {/*
                        <li>
                            <NavLink to="/categories" activeClassName={"active"}>
                                <span class="icon material-icons">category</span>
                                <span class="menu-item-label">Categories</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/territories" activeClassName={"active"}>
                                <span class="icon material-icons">location_city</span>
                                <span class="menu-item-label">Territories</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/shippers" activeClassName={"active"}>
                                <span class="icon material-icons">local_shipping</span>
                                <span class="menu-item-label">Shippers</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/Regions" activeClassName={"active"}>
                                <span class="icon material-icons">south_america</span>
                                <span class="menu-item-label">Regions</span>
                            </NavLink>
                        </li>
                        */}
                        <li>
                            <NavLink to="/search" activeClassName={"active"}>
                                <span class="icon material-icons">search</span>
                                <span class="menu-item-label">Search</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
};

export { Aside };
