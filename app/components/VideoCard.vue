<script setup lang="ts">
import type { CuratedVideo } from '~/data/content';

defineProps<{ video: CuratedVideo }>();

const failed = ref(false);
const thumbnail = useTemplateRef<HTMLImageElement>('thumbnail');

// An image can fail before hydration attaches the error listener.
onMounted(() => {
  if (thumbnail.value?.complete && thumbnail.value.naturalWidth === 0) failed.value = true;
});
</script>

<template>
  <article class="hud hud-interactive group flex flex-col" :class="`accent-${video.accent}`">
    <a :href="video.url" target="_blank" rel="noreferrer" class="flex flex-1 flex-col">
      <div class="relative m-2 aspect-video overflow-hidden bg-[#0b0f0c]">
        <ProjectViz :visual="video.visual" :accent="video.accent" />
        <img
          v-if="video.thumbnail && !failed"
          ref="thumbnail"
          :src="video.thumbnail"
          alt=""
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
          class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          @error="failed = true"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span class="absolute top-3 left-3 font-mono text-xs text-white/85">{{ String(video.number).padStart(2, '0') }}</span>
        <span class="absolute top-3 right-3 bg-black/55 px-2 py-1 font-mono text-[0.5625rem] tracking-[0.16em] text-white/85 uppercase backdrop-blur">{{ video.duration }}</span>
        <span class="absolute bottom-3 left-3 grid size-10 place-items-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
          <UIcon name="i-lucide-play" class="size-4 translate-x-px" />
        </span>
      </div>
      <div class="flex flex-1 flex-col gap-2 px-4 pt-2 pb-5">
        <p class="eyebrow">{{ video.channel }}</p>
        <h2 class="text-lg leading-tight font-semibold tracking-tight">{{ video.title }}</h2>
        <p class="text-sm leading-relaxed text-[var(--ink-soft)]">{{ video.summary }}</p>
        <span class="mt-auto inline-flex items-center gap-1.5 pt-3 font-mono text-[0.6875rem] tracking-[0.14em] uppercase group-hover:text-[var(--accent)]">
          Open on YouTube <UIcon name="i-lucide-external-link" class="size-3.5" />
        </span>
      </div>
    </a>
  </article>
</template>
