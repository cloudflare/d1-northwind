#!/usr/bin/env make

default:
	@echo "Available Targets:"
	@echo
	@echo "  build - build the bundled script"
	@echo "  local - local development using wranglers miniflare"
	@echo "  dev - remote dev"
	@echo "  publish - publish to production"
	@echo "  secret - create production HASH_SECRET"
	@echo "  schema - create remote D1 schema"
	@echo "  local-schema - create local D1 schema"
	@echo

.PHONY:

build:
	npx rollup -c rollup.app.config.js
	npm run build

local:
	npx wrangler dev --local --persist --env local --assets dist --ip 0.0.0.0 & npx rollup -c rollup.app.config.js --watch

dev:
	npx wrangler dev --env dev

publish:
	npx wrangler publish --env production

tail:
	npx wrangler tail --env production

secret:
	npx wrangler secret put HASH_SECRET --env production

schema:
	npx wrangler d1 execute d1-northwind --file db/schema.sql
	npx wrangler d1 execute d1-northwind --file db/data.sql

local-schema:
	npx wrangler d1 execute d1-northwind --file db/schema.sql --local
	npx wrangler d1 execute d1-northwind --file db/data.sql --local
