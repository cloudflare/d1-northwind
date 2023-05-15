# D1 Northwind Demo

This repo has the code for https://northwind.d1sql.com/

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

### Clone this repo

```
git clone https://github.com/cloudflare/d1-northwind
```

### Install packages

```
npm install
```

### Creating the database

```
npm run db:new

```

Get the output database id and add it to worker/wrangler.toml

```
[[d1_databases]]
binding = "DB"
database_name = "northwind"
database_id = "..."
```

### Importing the database

```
npm run db:init
npm run db:load
```

## React application

Northwind is a React/Remix/Tailwind CSS application. The source code is in the [app folder](./frontend) folder.

To build a new version run:

```
npx rollup -c rollup.app.config.js
```

## Worker backend

Worker serves both the React app bundles from KV, and the Database API endpoints. The source code is in the [worker](./worker) folder.

To build it run:

```
npx rollup -c rollup.worker.config.js
```

Or run:

```
make build
```

Which will build both the React app, and the Worker. Running wrangler also watches and rebuilds the worker.

## Local development

Wrangler D1 has support for local development:

```
npx wrangler d1 execute d1-northwind --file db/schema.sql --local
npx wrangler d1 execute d1-northwind --file db/data.sql --local
npx wrangler dev --local --persist --env local --assets local-assets --ip 0.0.0.0
```

Wrangler will persist a local SQLite compatible sql file which you can access to with other clients:

```
sqlite3 .wrangler/state/d1/DB.sqlite3
.tables
```

## Dev environment

You can test things in the developer environment, remotely.

```
npx wrangler kv:key put app.js --path ./dist/app.js --binding assets --env dev --preview
npx wrangler kv:key put app.css --path ./dist/app.css --binding assets --env dev --preview
npx wrangler dev --env dev
```

Or just run

```
make dev
```

## Deploying

Deploy to production when you're done.

```
npx wrangler kv:key put app.js --path ./dist/app.js --binding assets --env production
npx wrangler kv:key put app.css --path ./dist/app.css --binding assets --env production
npx wrangler publish --env production
```

Or simply

```
make publish
```

Adding something like this will bind the worker to a specific route/domain.

```
[env.production]
route = "northwind.d1sql.com/*"
```
