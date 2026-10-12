<script setup lang="ts">
const props = withDefaults(defineProps<{ projectId: string; projectName: string; compact?: boolean }>(), { compact: false });

const { isFavorite, toggle } = useFavorites();
const toast = useToast();
const saved = computed(() => isFavorite(props.projectId));
const popping = ref(false);

function onClick() {
  const nowSaved = toggle(props.projectId);
  popping.value = false;
  requestAnimationFrame(() => { popping.value = true; });
  toast.add({ title: nowSaved ? 'Added to favorites' : 'Removed from favorites', icon: nowSaved ? 'i-lucide-heart' : 'i-lucide-heart-off', color: nowSaved ? 'primary' : 'neutral' });
}
</script>

<template>
  <UButton
    :color="saved ? 'primary' : 'neutral'"
    :variant="saved ? 'soft' : 'ghost'"
    :aria-pressed="saved"
    :aria-label="saved ? `Remove ${projectName} from favorites` : `Favorite ${projectName}`"
    size="md"
    @click.prevent="onClick"
  >
    <UIcon
      name="i-lucide-heart"
      class="size-4 transition-transform"
      :class="[saved && 'fill-current', popping && 'animate-[pop_.35s_ease]']"
      @animationend="popping = false"
    />
    <span :class="compact && 'max-sm:sr-only'">Favorite</span>
  </UButton>
</template>

<style>
@keyframes pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.45); }
  100% { transform: scale(1); }
}
</style>
