interface AsideProps {
  pathname: string;
}

const links = [
  { to: "/", label: "Home", icon: "home", end: true },
  { to: "/dash", label: "Dashboard", icon: "display_settings" },
  { to: "/suppliers", label: "Suppliers", icon: "inventory" },
  { to: "/products", label: "Products", icon: "production_quantity_limits" },
  { to: "/orders", label: "Orders", icon: "shopping_cart" },
  { to: "/employees", label: "Employees", icon: "badge" },
  { to: "/customers", label: "Customers", icon: "group" },
  { to: "/search", label: "Search", icon: "search" },
];

const isActive = (to: string, pathname: string, end?: boolean) => {
  if (end) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
};

const Aside = ({ pathname }: AsideProps) => {
  const general = links.slice(0, 2);
  const backoffice = links.slice(2);

  const renderLink = (link: (typeof links)[number]) => (
    <a
      href={link.to}
      className={isActive(link.to, pathname, link.end) ? "active" : ""}
    >
      <span className="icon material-icons">{link.icon}</span>
      <span className="menu-item-label">{link.label}</span>
    </a>
  );

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
            <li>{general.map((link) => <div key={link.to}>{renderLink(link)}</div>)}</li>
          </ul>
          <p className="menu-label">Backoffice</p>
          <ul className="menu-list">
            {backoffice.map((link) => (
              <li key={link.to}>{renderLink(link)}</li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export { Aside };
export default Aside;
