# D1 Northwind Demo v2

This repo has the code for https://northwind.rozenmd.com/

## What we use

- Cloudflare [Workers](https://workers.cloudflare.com/) for computing
- [D1](https://blog.cloudflare.com/introducing-d1/) for database
- [Wrangler](https://github.com/cloudflare/wrangler2) for building
- [Typescript](https://www.typescriptlang.org/) for better Javascript
- [Tailwind CSS](https://tailwindcss.com/) for the UI
- [React](https://reactjs.org/) for DOM interaction
- [Remix](https://remix.run/docs/en/main/) for the React framework

## Get the demo running

Requirements:

- You need a Cloudflare Account
- You need to get D1 [enabled](https://www.cloudflare.com/en-gb/lp/d1/) for your account
- Please join our [developers Discord](https://discord.com/invite/cloudflaredev)
- Please install [nodejs](https://github.com/nvm-sh/nvm) (we're using v18.8.0), npm and [npx](https://www.npmjs.com/package/npx)

### Clone/fork this repo, jump to this branch

```
git clone https://github.com/cloudflare/d1-northwind
git checkout -b rozenmd/remix-pages origin/rozenmd/remix-pages
```

### Install packages

```
cd v2/ && npm install
cd ../v2-worker && npm install
```

### Creating the database

```
//while in v2-worker
npm run db:new
```

Get the output database id and add it to wrangler.toml

```
//while in v2-worker
[[d1_databases]]
binding = "DB"
database_name = "northwind"
database_id = "..."
```

### Importing the database

```
//while in v2-worker
npm run db:init
npm run db:load OR npm run db:load-big
```

## Remix application

Northwind is a React/Remix/Tailwind CSS application. The source code is in the [v2 folder](./v2) folder.

To run it run:

```
npm run dev
```

Deploying is done via Cloudflare Pages, so you'll want to fork this repo for that. Once in Cloudflare Pages, set the "main" deployment branch to `rozenmd/remix-pages`.

## Worker backend

Worker serves the Database API endpoints. The source code is in the [worker](./v2-worker) folder.

To run it run:

```
npm run dev
```

and publish via:

```
npm run deploy
```

Once deployed, you'll need to search and replace `v2-worker.rozenmd.workers.dev` in v2 with the URL of your v2-worker.

Which will start wrangler in dev mode.


