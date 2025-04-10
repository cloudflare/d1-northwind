import { NavLink } from "react-router-dom";

const Aside = () => {
  return (
    <>
      <aside className="aside is-placed-left is-expanded">
        <div className="aside-tools">
          <div>
            <b className="font-black">Northwind</b> Traders
          </div>
        </div>
        <div className="menu is-menu-main">
          <p className="menu-label">General</p>
          <ul className="menu-list">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
                end
              >
                <span className="icon material-icons">home</span>
                <span className="menu-item-label">Home</span>
              </NavLink>
              <NavLink
                to="/dash"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icon material-icons">display_settings</span>
                <span className="menu-item-label">Dashboard</span>
              </NavLink>
            </li>
          </ul>
          <p className="menu-label">Backoffice</p>
          <ul className="menu-list">
            <li>
              <NavLink
                to="/suppliers"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icon material-icons">inventory</span>
                <span className="menu-item-label">Suppliers</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icon material-icons">
                  production_quantity_limits
                </span>
                <span className="menu-item-label">Products</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icon material-icons">shopping_cart</span>
                <span className="menu-item-label">Orders</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/employees"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icon material-icons">badge</span>
                <span className="menu-item-label">Employees</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/customers"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icon material-icons">group</span>
                <span className="menu-item-label">Customers</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icon material-icons">search</span>
                <span className="menu-item-label">Search</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export { Aside };
