# Build illustrations

The build list and each build detail page use the same generated illustration. The image prompt is built from the build title, description, and accent color, with shared Mini CCC style rules in `scripts/build-image-prompt.mjs`.

## Generate images

1. Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY` there. The local env file is ignored by Git.
2. Run `pnpm run generate:build-images`.

The runner submits one independent OpenAI image request per build, with up to three requests in flight. It skips valid existing images. Add `-- --force` to replace them, or `-- --slug=lora-network` to generate one build. Use `-- --prompts-only` to print the prompt text without calling the API; add a slug to inspect just one prompt.

The runner saves WebP assets under `src/assets/builds/`. It requests a 1536×1024 opaque image, then checks the returned file type and exact dimensions before saving it. A failed or incorrectly sized response is reported and does not replace the site's existing illustration. The API key stays in the local script process and is never included in the generated site. Increase or reduce parallel requests with `-- --concurrency=1` through `-- --concurrency=6`.

## Display behavior

Cards and detail pages use the same 3:2 image and center-crop it into their respective frames. Prompts keep the main object centered with safe margins so those crops retain the subject. Missing generated files fall back to the existing CSS illustrations. The dark charcoal-green background and one restrained project accent keep the artwork compatible with the site's dark visual system.
