import { readdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';

const siteUrl = 'https://mini-ccc.pages.dev';

// Generated illustrations that exist on disk; anything missing falls back to
// the CSS artwork so a fresh build never points at a missing image.
function listArt(folder: string) {
  try {
    return readdirSync(new URL(`./public/art/${folder}`, import.meta.url))
      .filter((file) => file.endsWith('.webp'))
      .map((file) => file.replace(/\.webp$/, ''));
  } catch {
    return [];
  }
}

// Mini CCC ships as a fully static site: `nuxt generate` prerenders every
// route to HTML, so Cloudflare Pages serves plain files and no Worker or
// Pages Function ever runs when someone visits.
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',

  modules: ['@nuxt/ui', '@nuxt/image'],

  css: ['~/assets/css/main.css'],

  devtools: { enabled: false },

  ssr: true,

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      // Shared opt-in consent banner; loads analytics only after "Allow".
      script: [{ src: 'https://tools.atlesque.dev/consent.js', defer: true }],
      meta: [
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Mini CCC' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl,
      art: { builds: listArt('builds'), cocktails: listArt('cocktails') },
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    storageKey: 'mini-ccc-color-mode',
  },

  icon: {
    // Bundle every icon the app uses into the client build so nothing is
    // fetched from an icon API at runtime (there is no server to answer it).
    provider: 'none',
    clientBundle: {
      scan: { globInclude: ['app/**/*.{vue,ts}'] },
      sizeLimitKb: 64,
    },
  },

  ui: {
    // Fonts are self-hosted from @fontsource packages (see main.css), so the
    // build never depends on a font API being reachable.
    fonts: false,
  },

  image: {
    // Images in /public are resized and converted at generate time; the
    // output is written next to the HTML as static files.
    format: ['webp'],
    quality: 72,
  },

  nitro: {
    preset: 'static',
    output: { publicDir: 'dist' },
    prerender: {
      crawlLinks: true,
      failOnError: true,
      // Every build page is linked from /builds, so the crawler finds them all.
      routes: ['/', '/404.html'],
    },
  },

  routeRules: {
    '/**': { prerender: true },
  },

  experimental: {
    // Store page data in a per-route _payload.json so client-side navigation
    // never needs a server round trip.
    payloadExtraction: true,
  },

  hooks: {
    // Only the resized copies in /_ipx are referenced by pages; drop the
    // full-size originals from the deploy once prerendering has used them.
    'nitro:init'(nitro) {
      nitro.hooks.hook('close', async () => {
        await rm(join(nitro.options.output.publicDir, 'art'), { recursive: true, force: true });
      });
    },
  },

  typescript: {
    strict: true,
  },
});
