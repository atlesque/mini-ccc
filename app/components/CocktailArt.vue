<script setup lang="ts">
import type { Cocktail } from '~/data/content';

const props = defineProps<{ cocktail: Pick<Cocktail, 'name' | 'visual' | 'accent'> }>();

const config = useRuntimeConfig();
const slug = computed(() => slugify(props.cocktail.name));
const hasImage = computed(() => config.public.art.cocktails.includes(slug.value));
</script>

<template>
  <div class="image-frame aspect-[3/2]">
    <NuxtImg
      v-if="hasImage"
      :src="`/art/cocktails/${slug}.webp`"
      :alt="`${cocktail.name} cocktail illustration`"
      width="1536"
      height="1024"
      sizes="sm:100vw md:50vw xl:33vw 2xl:460px"
      loading="lazy"
      decoding="async"
    />
    <ProjectViz v-else :visual="cocktail.visual" :accent="cocktail.accent" />
  </div>
</template>
