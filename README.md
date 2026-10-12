# Mini CCC

A tiny home hacker conference site: agenda, build catalogue, Club-Mate cocktails and a watch list.

Built with [Nuxt 4](https://nuxt.com) and [Nuxt UI](https://ui.nuxt.com), and shipped as a fully static site.

## Develop

```sh
pnpm install
pnpm dev
```

## Build and deploy

```sh
pnpm build   # runs `nuxt generate`, output in dist/
pnpm preview
```

Cloudflare Pages settings: build command `pnpm build`, output directory `dist`, Node 22 (`.node-version`).

Every route, including all `/projects/*` build pages, is prerendered to HTML at build time, and build/cocktail art is resized into `/_ipx/` as static files. Nothing runs on Workers or Pages Functions when someone visits, so page views don't count against the Workers quota. `public/_headers` gives hashed assets a one-year cache.

Favorites and the cocktail shopping list are stored in the visitor's browser only.

## Content

- `app/data/bom.csv` and `app/data/project-metadata.json` — builds and parts lists
- `app/data/content.ts` — videos and cocktails
- `app/data/schedule.ts` — the agenda
- `public/art/` — generated illustrations (see `docs/`)
