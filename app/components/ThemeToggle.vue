<script setup lang="ts">
const colorMode = useColorMode();

const order = ['system', 'light', 'dark'] as const;
type Preference = (typeof order)[number];

const labels: Record<Preference, string> = { system: 'automatic', light: 'light', dark: 'dark' };
const icons: Record<Preference, string> = { system: 'i-lucide-sun-moon', light: 'i-lucide-sun', dark: 'i-lucide-moon' };

const current = computed<Preference>(() => (order.includes(colorMode.preference as Preference) ? colorMode.preference as Preference : 'system'));
const next = computed<Preference>(() => order[(order.indexOf(current.value) + 1) % order.length]!);
const label = computed(() => `Theme: ${labels[current.value]}. Switch to ${labels[next.value]} mode`);

function cycle() {
  colorMode.preference = next.value;
}
</script>

<template>
  <ClientOnly>
    <UButton
      :icon="icons[current]"
      color="neutral"
      variant="outline"
      square
      :aria-label="label"
      :title="label"
      class="size-10 justify-center rounded-full"
      @click="cycle"
    />
    <template #fallback>
      <span class="block size-10 rounded-full border border-[var(--hairline)]" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>
