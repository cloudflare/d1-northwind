import type { Route } from "./+types/home";

export default function Home({}: Route.ComponentProps) {
  return (
    <>
      <div className="card-content">
        <p className="text-2xl">Welcome to Northwind Traders</p>
        <div className="pt-2">
          <p className="text-gray-400 text-lg">Running on Cloudflare's D1</p>
        </div>
        <img
          alt="Northwind Traders Database"
          className="float-right object-scale-down w-96"
          src="https://imagedelivery.net/4wj01aQOZZ0hemsvbxWAvA/763bcbcd-da6d-46ec-f5e1-70c1c1a33d00/public"
        />
        <p className="text-base pt-4">
          This is a demo of the Northwind dataset, running on{" "}
          <a
            className="link"
            href="https://workers.cloudflare.com/"
            target="_new"
          >
            Cloudflare Workers
          </a>
          , and D1 - Cloudflare's newest SQL database, running on SQLite.
        </p>
        <p className="text-base pt-4">
          Read our{" "}
          <a
            className="link"
            href="https://blog.cloudflare.com/d1-turning-it-up-to-11/"
            target="_new"
          >
            most recent D1 announcement
          </a>{" "}
          to learn more about D1.
        </p>
        <p className="text-base pt-4">
          This dataset was sourced from{" "}
          <a
            className="link"
            href="https://github.com/jpwhite3/northwind-SQLite3"
            target="_new"
          >
            northwind-SQLite3
          </a>
          .
        </p>
        <p className="text-base pt-4">
          You can use the UI to explore Supplies, Orders, Customers, Employees
          and Products, or you can use search if you know what you're looking
          for.
        </p>
      </div>
    </>
  );
}
