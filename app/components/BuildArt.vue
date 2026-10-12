<script setup lang="ts">
import type { Project } from '~/data/projects';

const props = withDefaults(defineProps<{
  project: Pick<Project, 'slug' | 'name' | 'visual' | 'accent'>;
  variant?: 'card' | 'detail';
}>(), { variant: 'card' });

const config = useRuntimeConfig();
const hasImage = computed(() => config.public.art.builds.includes(props.project.slug));
const sizes = computed(() => (props.variant === 'card' ? 'sm:100vw md:50vw lg:33vw xl:25vw 2xl:360px' : 'sm:100vw md:100vw lg:50vw 2xl:720px'));
</script>

<template>
  <div class="image-frame aspect-[3/2]">
    <NuxtImg
      v-if="hasImage"
      :src="`/art/builds/${project.slug}.webp`"
      :alt="`${project.name} electronics build illustration`"
      width="1536"
      height="1024"
      :sizes="sizes"
      :loading="variant === 'card' ? 'lazy' : 'eager'"
      :fetchpriority="variant === 'detail' ? 'high' : 'auto'"
      decoding="async"
    />
    <ProjectViz v-else :visual="project.visual" :accent="project.accent" />
  </div>
</template>
