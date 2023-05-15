import { useState } from "react";

export const Nav = () => {
  const clock = new Date().toLocaleTimeString();
  const [subMenu, setSubMenu] = useState(false);

  return (
    <>
      <nav id="navbar-main" className="navbar is-fixed-top">
        <div className="navbar-brand">
          <button
            onClick={() => {
              document.documentElement.classList.toggle(
                "aside-mobile-expanded"
              );
            }}
            className="mobile-aside-button navbar-item"
          >
            <span className="icon mobile-aside-button material-icons">
              menu
            </span>
          </button>
        </div>
        <div className="navbar-brand is-right">
          <button
            className="navbar-item --jb-navbar-menu-toggle"
            data-target="navbar-menu"
          >
            <span className="icon material-icons">more_vert</span>
          </button>
        </div>
        <div className="navbar-menu" id="navbar-menu">
          <div className="navbar-item ml-6 text-gray-800">{clock}</div>
          <div className="navbar-end">
            <div
              className={`navbar-item dropdown has-divider ${
                subMenu ? "active" : ""
              }`}
            >
              <button
                className="navbar-link"
                onClick={() => {
                  setSubMenu(!subMenu);
                }}
              >
                <span className="icon material-icons">menu</span>
                <span>SQLite Links</span>
                <span className="icon material-icons">keyboard_arrow_down</span>
              </button>
              <div className="navbar-dropdown">
                <a
                  href="https://blog.cloudflare.com/d1-turning-it-up-to-11/"
                  className="navbar-item"
                >
                  <span className="icon material-icons">link</span>
                  <span>Reintroducing D1</span>
                </a>
                <a
                  href="https://www.sqlite.org/lang.html"
                  className="navbar-item"
                >
                  <span className="icon material-icons">link</span>
                  <span>SQLite SQL Flavour</span>
                </a>
                <a
                  href="https://developers.cloudflare.com/workers/learning/using-durable-objects/"
                  className="navbar-item"
                >
                  <span className="icon material-icons">link</span>
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
