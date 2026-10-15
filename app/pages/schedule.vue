<script setup lang="ts">
import { SLOT_COUNT, agenda, agendaAsText, formatSlot } from '~/data/schedule';

useSeoMeta({
  title: 'Schedule',
  description: 'The agenda of the 2026 edition of Mini CCC.',
  ogTitle: 'Schedule — Mini CCC',
  ogDescription: 'The agenda of the 2026 edition of Mini CCC.',
});

const toast = useToast();
const hours = Array.from({ length: SLOT_COUNT / 2 + 1 }, (_, index) => index * 2);

function exportAgenda() {
  downloadText('mini-ccc-agenda.txt', agendaAsText());
  toast.add({ title: 'Agenda exported as TXT', icon: 'i-lucide-download' });
}
</script>

<template>
  <div>
    <PageHero eyebrow="Agenda · 2026 edition" title="That was the" title-accent="2026 agenda.">
      This is how the day ran. The 2026 edition has passed, see you next year.
      <template #actions>
        <UButton label="Export .txt" trailing-icon="i-lucide-download" @click="exportAgenda" />
      </template>
    </PageHero>

    <section class="shell" aria-label="Agenda">
      <div class="hud relative grid grid-cols-[4.5rem_minmax(0,1fr)] p-4 md:grid-cols-[6rem_minmax(0,1fr)] md:p-6">
        <!-- Hour labels -->
        <div class="relative" aria-hidden="true" :style="{ height: `${SLOT_COUNT * 2.5}rem` }">
          <span
            v-for="slotIndex in hours"
            :key="slotIndex"
            class="absolute left-0 -translate-y-1/2 font-mono text-[0.6875rem] text-[var(--ink-soft)]"
            :style="{ top: `${(slotIndex / SLOT_COUNT) * 100}%` }"
          >{{ formatSlot(slotIndex) }}</span>
        </div>

        <!-- Timeline -->
        <ol class="relative" :style="{ height: `${SLOT_COUNT * 2.5}rem` }">
          <li
            v-for="slotIndex in hours"
            :key="`line-${slotIndex}`"
            aria-hidden="true"
            class="absolute inset-x-0 border-t border-dashed border-[var(--hairline)]"
            :style="{ top: `${(slotIndex / SLOT_COUNT) * 100}%` }"
          />
          <li
            v-for="block in agenda"
            :key="block.label"
            class="hud hud-interactive absolute inset-x-0 overflow-hidden px-4 py-3 max-sm:px-3 max-sm:py-2"
            :class="`accent-${block.accent}`"
            :style="{ top: `calc(${(block.start / SLOT_COUNT) * 100}% + 3px)`, height: `calc(${(block.duration / SLOT_COUNT) * 100}% - 6px)` }"
          >
            <div class="absolute inset-y-0 left-0 w-1 bg-[var(--accent)] shadow-[0_0_14px_var(--accent)]" aria-hidden="true" />
            <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 pl-2">
              <UIcon :name="block.icon" class="size-4 shrink-0 text-[var(--accent)]" />
              <strong class="font-semibold tracking-tight">{{ block.label }}</strong>
              <span class="ml-auto font-mono text-[0.6875rem] text-[var(--ink-soft)] max-sm:ml-7 max-sm:basis-full">{{ formatSlot(block.start) }}—{{ formatSlot(block.start + block.duration) }}</span>
            </div>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>
