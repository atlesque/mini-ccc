import { EVENT_START_MINUTES, SLOT_COUNT, SLOT_MINUTES, agenda } from '~/data/schedule';

/**
 * The visitor's local clock, mapped onto the agenda. It is null during
 * prerender and on the first client render so hydration matches, then
 * ticks every 30 seconds.
 */
export function useNow() {
  const minutes = ref<number | null>(null);
  let timer: ReturnType<typeof setInterval> | undefined;

  const read = () => {
    const now = new Date();
    minutes.value = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  };

  onMounted(() => {
    read();
    timer = setInterval(read, 30_000);
  });
  onBeforeUnmount(() => clearInterval(timer));

  /** Position inside the event window in slots (0–24), or null outside it. */
  const slot = computed(() => {
    if (minutes.value === null) return null;
    const value = (minutes.value - EVENT_START_MINUTES) / SLOT_MINUTES;
    return value >= 0 && value < SLOT_COUNT ? value : null;
  });

  const current = computed(() => (slot.value === null ? null : agenda.find((block) => slot.value! >= block.start && slot.value! < block.start + block.duration) ?? null));
  const next = computed(() => {
    if (slot.value === null) return minutes.value !== null && minutes.value < EVENT_START_MINUTES ? agenda[0] ?? null : null;
    return [...agenda].sort((a, b) => a.start - b.start).find((block) => block.start > slot.value!) ?? null;
  });

  const clock = computed(() => {
    if (minutes.value === null) return '--:--';
    const whole = Math.floor(minutes.value);
    return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
  });

  return { minutes, slot, current, next, clock };
}
