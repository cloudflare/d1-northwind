import type { ReactNode } from "react";
import { Sidebar } from "@cloudflare/kumo";
import {
  GaugeIcon,
  HouseIcon,
  IdentificationBadgeIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  ShoppingCartIcon,
  TruckIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { Nav } from "./Nav";

interface AppShellProps {
  pathname: string;
  children: ReactNode;
}

export function AppShell({ pathname, children }: AppShellProps) {
  const isActive = (p: string) =>
    pathname === p || (p !== "/" && pathname.startsWith(`${p}/`));

  return (
    <Sidebar.Provider defaultOpen>
      <Sidebar>
        <Sidebar.Header>
          <span className="flex items-center gap-2 px-1 font-semibold">
            <span className="font-black">Northwind</span>
            <span className="text-kumo-subtle">Traders</span>
          </span>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>General</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuButton
                icon={HouseIcon}
                href="/"
                active={isActive("/")}
              >
                Home
              </Sidebar.MenuButton>
              <Sidebar.MenuButton
                icon={GaugeIcon}
                href="/dash"
                active={isActive("/dash")}
              >
                Dashboard
              </Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Backoffice</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuButton
                icon={TruckIcon}
                href="/suppliers"
                active={isActive("/suppliers")}
              >
                Suppliers
              </Sidebar.MenuButton>
              <Sidebar.MenuButton
                icon={PackageIcon}
                href="/products"
                active={isActive("/products")}
              >
                Products
              </Sidebar.MenuButton>
              <Sidebar.MenuButton
                icon={ShoppingCartIcon}
                href="/orders"
                active={isActive("/orders")}
              >
                Orders
              </Sidebar.MenuButton>
              <Sidebar.MenuButton
                icon={IdentificationBadgeIcon}
                href="/employees"
                active={isActive("/employees")}
              >
                Employees
              </Sidebar.MenuButton>
              <Sidebar.MenuButton
                icon={UsersThreeIcon}
                href="/customers"
                active={isActive("/customers")}
              >
                Customers
              </Sidebar.MenuButton>
              <Sidebar.MenuButton
                icon={MagnifyingGlassIcon}
                href="/search"
                active={isActive("/search")}
              >
                Search
              </Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Trigger />
        </Sidebar.Footer>
      </Sidebar>
      <div className="flex min-w-0 flex-1 flex-col">
        <Nav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </Sidebar.Provider>
  );
}

export default AppShell;
