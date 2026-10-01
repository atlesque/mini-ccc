# Cocktail illustrations

The cocktails page uses one generated illustration per drink. Prompts use the cocktail name, summary, ingredient list, and accent color from `src/data/content.ts`, with shared Mini CCC art direction in `scripts/cocktail-image-prompt.mjs`.

## Generate images

1. Set `OPENAI_API_KEY` in `.env.local` or in the shell environment.
2. Run `pnpm run generate:cocktail-images`.

The runner uses `gpt-image-1-mini` at low quality by default and saves opaque 1536×1024 WebP images under `src/assets/cocktails/`. It skips correctly sized existing files. Use `-- --force` to replace them, `-- --slug=mate-mule` to generate one drink, or `-- --prompts-only` to inspect prompts without calling the API. `OPENAI_IMAGE_MODEL` and `OPENAI_IMAGE_QUALITY` can override the defaults.

## Display behavior

`CocktailArt.astro` feeds the source WebP images into Astro's responsive `Picture` pipeline, which emits AVIF and WebP sizes chosen for the cocktails card layout. Cards lazy-load the images and keep the existing CSS artwork as a fallback when an image has not been generated.
