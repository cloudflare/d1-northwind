# D1 Northwind Demo

This repo has the code for https://northwind.d1sql.com/

## What we use

- Cloudflare [Workers](https://workers.cloudflare.com/) for computing
- [D1](https://blog.cloudflare.com/introducing-d1/) for database
- [Wrangler](https://github.com/cloudflare/wrangler2) for building
- [Typescript](https://www.typescriptlang.org/) for better Javascript
- [Tailwind CSS](https://tailwindcss.com/) for the UI
- [Astro](https://astro.build/) for the framework
- [React](https://reactjs.org/) for interactive components

## Get the demo running

Requirements:

- You need a Cloudflare Account
- You need to get D1 [enabled](https://www.cloudflare.com/en-gb/lp/d1/) for your account
- Please join our [developers Discord](https://discord.com/invite/cloudflaredev)
- Please install [nodejs](https://github.com/nvm-sh/nvm), npm and [npx](https://www.npmjs.com/package/npx)

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
npm run remote:new
```

Get the output database id and add it to `wrangler.jsonc`

```
"d1_databases": [
    {
      "binding": "DB",
      "database_name": "northwind",
      "database_id": "..."
    }
  ]
```

### Importing the database

```
npm run remote:init
npm run remote:load
```

## Astro application

Northwind is an Astro application with React components. The source code is in
the [`src`](./src) folder.

To build a new version run:

```
npm run build
```

To run the dev server, run:

```
npm run dev
```

## Local development

This project supports local development:

```
npm run local:init
npm run local:load
npm run dev
```

This will start the application at `http://localhost:4321` with the database loaded with data.

## Deploying

Deploy to production when you're done.

```
npm run deploy
```
