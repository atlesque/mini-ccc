<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute();

useHead(() => ({
  link: [{ rel: 'canonical', href: new URL(route.path, config.public.siteUrl).href }],
}));

useSeoMeta({
  titleTemplate: (title) => (!title || title.includes('Mini CCC') ? title || 'Mini CCC — tiny builds, big signal' : `${title} — Mini CCC`),
  ogImage: `${config.public.siteUrl}/generated/f29e14d7_000.png`,
  ogImageType: 'image/png',
  ogImageWidth: 832,
  ogImageHeight: 1248,
  ogImageAlt: 'A neon-lit electronics workshop with tiny DIY builds on the workbench.',
  ogUrl: () => new URL(route.path, config.public.siteUrl).href,
  twitterImage: `${config.public.siteUrl}/generated/f29e14d7_000.png`,
  themeColor: '#080b09',
});
</script>

<template>
  <UApp :toaster="{ position: 'bottom-center', duration: 1800 }">
    <div class="backdrop" aria-hidden="true" />
    <div class="grain" aria-hidden="true" />
    <SiteHeader />
    <main class="relative">
      <NuxtPage />
    </main>
    <SiteFooter />
  </UApp>
</template>
