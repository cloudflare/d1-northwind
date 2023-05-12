import type { LinksFunction } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useReducer } from "react";
import styles from "~/tailwind.css";
import { Nav } from "~/components/Nav";
import { Aside } from "~/components/Aside";
import {
  StatsContext,
  StatsDispatchContext,
  initialStats,
} from "~/components/StatsContext";

export const links: LinksFunction = () => {
  const appLinks = [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/icon?family=Material+Icons",
    },
    { rel: "stylesheet", href: styles },
    {
      rel: "icon",
      type: "image/png",
      href: "https://imagedelivery.net/4wj01aQOZZ0hemsvbxWAvA/51d8577b-60b4-4619-fb47-11740b6f1700/public",
    },
  ];
  cssBundleHref && appLinks.push({ rel: "stylesheet", href: cssBundleHref });
  return appLinks;
};

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
  if (action.log) state.log.push(...action.log);
  return state;
};

export default function App() {
  // const dispatch = useDispatch();
  const [stats, dispatch] = useReducer(statsReducer, initialStats);

  // useEffect(() => {
  //   // dispatch(login());
  //   setInterval(() => {
  //     dispatch(updateClock());
  //   }, 1000);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // runs only once
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Northwind Traders D1 Demo</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:site_name" content="The Cloudflare Blog" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Announcing D1: Our first SQL database"
        />
        <meta
          property="og:description"
          content="Today, we're excited to announce D1, Cloudflare's first SQL database, designed for Cloudflare Workers"
        />
        <meta
          property="og:url"
          content="https://blog.cloudflare.com/introducing-d1/"
        />
        <meta
          property="og:image"
          content="http://blog.cloudflare.com/content/images/2022/05/image1-22.png"
        />
        <meta property="article:tag" content="Platform Week" />
        <meta property="article:tag" content="Product News" />
        <meta property="article:tag" content="Developers" />

        <meta
          property="article:publisher"
          content="https://www.facebook.com/cloudflare"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Announcing D1: Our first SQL database"
        />
        <meta
          name="twitter:description"
          content="Today, we're excited to announce D1, Cloudflare's first SQL database, designed for Cloudflare Workers"
        />
        <meta
          name="twitter:url"
          content="https://blog.cloudflare.com/introducing-d1/"
        />
        <meta
          name="twitter:image"
          content="http://blog.cloudflare.com/content/images/2022/05/image1-22.png"
        />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content="Rita Kozlov" />
        <meta name="twitter:label2" content="Filed under" />
        <meta
          name="twitter:data2"
          content="Platform Week, Product News, Developers"
        />
        <meta name="twitter:site" content="@cloudflare" />
        <meta name="twitter:creator" content="@ritakozlov_" />
        <meta property="og:image:width" content="1801" />
        <meta property="og:image:height" content="1013" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="app">
          <StatsContext.Provider value={stats}>
            <StatsDispatchContext.Provider value={dispatch}>
              <Nav />
              <Aside />
              <section className="section main-section">
                <Outlet />
              </section>
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
            </StatsDispatchContext.Provider>
          </StatsContext.Provider>
        </div>
      </body>
    </html>
  );
}
