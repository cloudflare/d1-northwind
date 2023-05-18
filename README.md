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

Note that this repository uses [npm workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces?v=true) to manage dependencies. You can run either Worker's npm commands from the root of the repo by adding either `-w frontend` or `-w worker` to your npm command.

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
npm run build -w frontend
```

To run the dev server, run:

```
npm run dev -w frontend
```

## Worker backend

Worker serves the Database API endpoints. The source code is in the [worker](./worker) folder.

## Local development

Wrangler D1 has support for local development:

```
npm run local:init -w worker
npm run local:load -w worker
npm run dev -w worker
```

This will start the Worker at `http://127.0.0.1:8787` with the database loaded with data. At this point you can start the frontend in a separate terminal window:

```
npm run dev -w frontend
```

Wrangler will persist a local SQLite compatible sql file which you can access to with other clients:

```
sqlite3 worker/.wrangler/state/v3/d1/*/db.sqlite
.tables
```

## Deploying

Deploy to production when you're done.

```
npm run deploy -w worker
npm run deploy -w frontend
```
