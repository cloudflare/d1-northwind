import { useReducer } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import {
  StatsContext,
  StatsDispatchContext,
  initialStats,
} from "~/components/StatsContext";

import type { Route } from "./+types/root";
import "./app.css";
import { Aside, Nav } from "~/components";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/icon?family=Material+Icons",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "icon",
    type: "image/png",
    href: "https://imagedelivery.net/4wj01aQOZZ0hemsvbxWAvA/51d8577b-60b4-4619-fb47-11740b6f1700/public",
  },
];

const statsReducer = (state: any, action: any) => {
  if (action.queries) state.queries += action.queries;
  if (action.results) state.results += action.results;
  if (action.select) state.select += action.select;
  if (action.select_where) state.select_where += action.select_where;
  if (action.select_leftjoin) state.select_leftjoin += action.select_leftjoin;
  if (action.select_fts) state.select_fts += action.select_fts;
  if (action.update) state.update += action.update;
  if (action.delete) state.delete += action.delete;
  if (action.insert) state.insert += action.insert;
  // we want new logs to be at the top of the list
  if (action.log) state.log.unshift({ ...action.log });

  return state;
};

export function Layout({ children }: { children: React.ReactNode }) {
  const [stats, dispatch] = useReducer(statsReducer, initialStats);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Northwind Traders D1 Demo</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          property="og:title"
          content="Northind Traders, running on Cloudflare's D1"
        />
        <meta
          property="og:description"
          content="This is a demo of the Northwind dataset, running on Cloudflare Workers, and D1 - Cloudflare's newest SQL database, running on SQLite."
        />
        <meta property="og:url" content="https://northwind.d1sql.com/" />
        <meta
          property="og:image"
          content="https://imagedelivery.net/4wj01aQOZZ0hemsvbxWAvA/763bcbcd-da6d-46ec-f5e1-70c1c1a33d00/public"
        />
        <meta property="article:tag" content="Developer Week" />
        <meta property="article:tag" content="Product News" />
        <meta property="article:tag" content="Developers" />

        <meta
          property="article:publisher"
          content="https://www.facebook.com/cloudflare"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Northind Traders, running on Cloudflare's D1"
        />
        <meta
          name="twitter:description"
          content="This is a demo of the Northwind dataset, running on Cloudflare Workers, and D1 - Cloudflare's newest SQL database, running on SQLite."
        />
        <meta name="twitter:url" content="https://northwind.d1sql.com" />
        <meta
          name="twitter:image"
          content="https://imagedelivery.net/4wj01aQOZZ0hemsvbxWAvA/763bcbcd-da6d-46ec-f5e1-70c1c1a33d00/public"
        />
        <meta name="twitter:site" content="@cloudflare" />
        <meta property="og:image:width" content="1801" />
        <meta property="og:image:height" content="1013" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <StatsContext.Provider value={stats}>
          <StatsDispatchContext.Provider value={dispatch}>
            <Nav />
            <Aside />
            <section className="section main-section">{children}</section>
            <ScrollRestoration />
            <Scripts />
          </StatsDispatchContext.Provider>
        </StatsContext.Provider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
