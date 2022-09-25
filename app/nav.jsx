import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectClock } from "./redux/clock";

const Nav = (props) => {
    const clock = useSelector(selectClock);
    const [subMenu, setSubMenu] = useState(false);

    return (
        <>
            <nav id="navbar-main" class="navbar is-fixed-top">
                <div class="navbar-brand">
                    <a
                        onClick={() => {
                            document.documentElement.classList.toggle("aside-mobile-expanded");
                        }}
                        class="mobile-aside-button navbar-item">
                        <span class="icon mobile-aside-button material-icons">menu</span>
                    </a>
                </div>
                <div class="navbar-brand is-right">
                    <a class="navbar-item --jb-navbar-menu-toggle" data-target="navbar-menu">
                        <span class="icon material-icons">more_vert</span>
                    </a>
                </div>
                <div class="navbar-menu" id="navbar-menu">
                    <div class="navbar-item ml-6 text-gray-800">{clock}</div>
                    <div class="navbar-end">
                        <div class={`navbar-item dropdown has-divider ${subMenu ? "active" : ""}`}>
                            <a
                                class="navbar-link"
                                onClick={() => {
                                    setSubMenu(!subMenu);
                                }}>
                                <span class="icon material-icons">menu</span>
                                <span>SQLite Links</span>
                                <span class="icon material-icons">keyboard_arrow_down</span>
                            </a>
                            <div class="navbar-dropdown">
                                <a href="https://blog.cloudflare.com/introducing-d1" class="navbar-item">
                                    <span class="icon material-icons">link</span>
                                    <span>Introducing D1</span>
                                </a>
                                <a href="https://www.sqlite.org/lang.html" class="navbar-item">
                                    <span class="icon material-icons">link</span>
                                    <span>SQLite SQL Flavour</span>
                                </a>
                                <a href="https://developers.cloudflare.com/workers/learning/using-durable-objects/" class="navbar-item">
                                    <span class="icon material-icons">link</span>
                                    <span>Durable Objects</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export { Nav };
