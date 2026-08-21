import { useEffect, useState } from "react";
import { Button, DropdownMenu, Sidebar, Text } from "@cloudflare/kumo";
import {
  ArrowSquareOutIcon,
  CaretDownIcon,
  MoonIcon,
  SunIcon,
} from "@phosphor-icons/react";

export const Nav = () => {
  const [clock, setClock] = useState("");

  useEffect(() => {
    setClock(new Date().toLocaleTimeString());
    const id = setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const toggleColorMode = () => {
    const root = document.documentElement;
    const mode = root.dataset.mode === "dark" ? "light" : "dark";

    root.dataset.mode = mode;
    localStorage.setItem("northwind-color-mode", mode);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-kumo-hairline bg-kumo-base px-4">
      <Sidebar.Trigger />
      <Text variant="secondary" size="sm">
        <span className="tabular-nums">{clock}</span>
      </Text>
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          shape="square"
          aria-label="Toggle color theme"
          title="Toggle color theme"
          onClick={toggleColorMode}
        >
          <span className="theme-icon-light" aria-hidden="true">
            <MoonIcon size={16} />
          </span>
          <span className="theme-icon-dark" aria-hidden="true">
            <SunIcon size={16} />
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenu.Trigger
            render={
              <Button variant="ghost" size="sm">
                SQLite Links <CaretDownIcon size={14} />
              </Button>
            }
          />
          <DropdownMenu.Content>
            <DropdownMenu.LinkItem
              href="https://blog.cloudflare.com/d1-turning-it-up-to-11/"
              icon={ArrowSquareOutIcon}
            >
              Reintroducing D1
            </DropdownMenu.LinkItem>
            <DropdownMenu.LinkItem
              href="https://www.sqlite.org/lang.html"
              icon={ArrowSquareOutIcon}
            >
              SQLite SQL Flavour
            </DropdownMenu.LinkItem>
            <DropdownMenu.LinkItem
              href="https://developers.cloudflare.com/workers/learning/using-durable-objects/"
              icon={ArrowSquareOutIcon}
            >
              Durable Objects
            </DropdownMenu.LinkItem>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Nav;
