<script setup lang="ts">
import { videos } from '~/data/content';

useSeoMeta({
  title: 'Videos',
  description: 'A shared YouTube watch list for Mini CCC.',
  ogTitle: 'Videos — Mini CCC',
  ogDescription: 'A shared YouTube watch list for Mini CCC.',
});
</script>

<template>
  <div>
    <PageHero eyebrow="Watch list · 04" title="Queue up" title-accent="the good stuff." accent="pink" />
    <section class="shell grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <VideoCard v-for="video in videos" :key="video.number" :video="video" />
    </section>
  </div>
</template>
