<script setup lang="ts">
import { cocktails } from '~/data/content';

useSeoMeta({
  title: 'Cocktails',
  description: 'A bright, caffeinated Club-Mate cocktail list for Mini CCC.',
  ogTitle: 'Cocktails — Mini CCC',
  ogDescription: 'A bright, caffeinated Club-Mate cocktail list for Mini CCC.',
});

const filters = [
  { value: 'all', label: 'All' },
  { value: 'with-alcohol', label: 'With alcohol' },
  { value: 'without-alcohol', label: 'Without alcohol' },
] as const;

const filter = ref<(typeof filters)[number]['value']>('all');
const selected = ref<number[]>([]);

const visible = computed(() => cocktails.filter((cocktail) => {
  if (filter.value === 'with-alcohol') return !cocktail.alcoholFree;
  if (filter.value === 'without-alcohol') return cocktail.alcoholFree;
  return true;
}));

function toggle(number: number) {
  selected.value = selected.value.includes(number) ? selected.value.filter((item) => item !== number) : [...selected.value, number];
}

const shoppingList = computed(() => {
  const counts = new Map<string, number>();
  for (const cocktail of cocktails) {
    if (!selected.value.includes(cocktail.number)) continue;
    for (const ingredient of cocktail.ingredients) counts.set(ingredient, (counts.get(ingredient) ?? 0) + 1);
  }
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
});

const countLabel = computed(() => (selected.value.length === 0
  ? 'No cocktails selected yet.'
  : `${selected.value.length} ${selected.value.length === 1 ? 'cocktail' : 'cocktails'} selected.`));
</script>

<template>
  <div>
    <PageHero eyebrow="Bar · 03" title="Things to" title-accent="make and sip." accent="orange">
      Club-Mate drinks, with and without alcohol. Add a few to get a shopping list.
    </PageHero>

    <section class="shell">
      <div class="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter cocktails by alcohol content">
        <span class="mr-2 font-mono text-[0.6875rem] tracking-[0.16em] text-[var(--ink-soft)] uppercase">Show</span>
        <UButton
          v-for="option in filters"
          :key="option.value"
          :label="option.label"
          size="md"
          :color="filter === option.value ? 'primary' : 'neutral'"
          :variant="filter === option.value ? 'solid' : 'outline'"
          :aria-pressed="filter === option.value"
          @click="filter = option.value"
        />
      </div>

      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="cocktail in visible"
          :key="cocktail.number"
          class="hud hud-interactive group flex flex-col"
          :class="[`accent-${cocktail.accent}`, selected.includes(cocktail.number) && 'border-[var(--accent)]']"
        >
          <div class="relative p-2">
            <CocktailArt :cocktail="cocktail" />
            <span class="absolute top-4 left-4 font-mono text-xs text-white/85">{{ String(cocktail.number).padStart(2, '0') }}</span>
          </div>
          <div class="flex flex-1 flex-col gap-4 px-5 pt-3 pb-5">
            <p class="eyebrow">{{ cocktail.alcoholFree ? 'No alcohol' : 'With alcohol' }} / {{ cocktail.style }}</p>
            <h2 class="text-2xl font-semibold tracking-tight">{{ cocktail.name }}</h2>
            <p class="text-[var(--ink-soft)]">{{ cocktail.summary }}</p>
            <div class="grid gap-3 border-t border-[var(--hairline)] pt-4 text-sm">
              <div>
                <span class="font-mono text-[0.625rem] tracking-[0.16em] text-[var(--ink-soft)] uppercase">Ingredients</span>
                <p class="mt-1">{{ cocktail.ingredients.join(' · ') }}</p>
              </div>
              <div>
                <span class="font-mono text-[0.625rem] tracking-[0.16em] text-[var(--ink-soft)] uppercase">Method</span>
                <p class="mt-1">{{ cocktail.method }}</p>
              </div>
            </div>
            <UButton
              class="mt-auto self-start"
              :icon="selected.includes(cocktail.number) ? 'i-lucide-check' : 'i-lucide-plus'"
              :label="selected.includes(cocktail.number) ? 'Added to ingredient list' : 'Add to ingredient list'"
              :color="selected.includes(cocktail.number) ? 'primary' : 'neutral'"
              :variant="selected.includes(cocktail.number) ? 'soft' : 'outline'"
              :aria-pressed="selected.includes(cocktail.number)"
              @click="toggle(cocktail.number)"
            />
          </div>
        </article>
      </div>

      <section class="hud accent-orange mt-12 p-6 md:p-10" aria-labelledby="ingredient-summary-title">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p class="eyebrow mb-3">The shopping list</p>
            <h2 id="ingredient-summary-title" class="display-title text-4xl">What you’ll need.</h2>
            <p class="mt-3 text-[var(--ink-soft)]" aria-live="polite">{{ countLabel }}</p>
          </div>
          <div class="flex gap-2">
            <UButton label="Select all" variant="outline" color="neutral" size="md" :disabled="selected.length === cocktails.length" @click="selected = cocktails.map((c) => c.number)" />
            <UButton label="Deselect all" variant="outline" color="neutral" size="md" :disabled="selected.length === 0" @click="selected = []" />
          </div>
        </div>
        <p v-if="shoppingList.length === 0" class="mt-8 text-[var(--ink-soft)]">Choose cocktails above to build your ingredient list.</p>
        <ul v-else class="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="[ingredient, count] in shoppingList" :key="ingredient" class="flex items-baseline justify-between gap-4 border-b border-dashed border-[var(--hairline)] py-2.5">
            <span class="first-letter:uppercase">{{ ingredient }}</span>
            <span class="font-mono text-[0.6875rem] text-[var(--ink-soft)]">in {{ count }} {{ count === 1 ? 'recipe' : 'recipes' }}</span>
          </li>
        </ul>
      </section>
    </section>
  </div>
</template>
