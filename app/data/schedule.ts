export type Accent = 'lime' | 'blue' | 'orange' | 'pink';

export type ScheduleBlock = {
  label: string;
  accent: Accent;
  icon: string;
  /** Half-hour slot index from 10:00. */
  start: number;
  /** Length in half-hour slots. */
  duration: number;
};

export const EVENT_START_MINUTES = 10 * 60;
export const SLOT_MINUTES = 30;
export const SLOT_COUNT = 24;

export const agenda: ScheduleBlock[] = [
  { label: 'Cocktail making', accent: 'orange', icon: 'i-lucide-martini', start: 0, duration: 2 },
  { label: 'YouTube videos', accent: 'blue', icon: 'i-lucide-tv', start: 2, duration: 2 },
  { label: 'Lunch', accent: 'orange', icon: 'i-lucide-utensils', start: 4, duration: 2 },
  { label: 'DIY project 1', accent: 'lime', icon: 'i-lucide-cpu', start: 6, duration: 8 },
  { label: 'Lock picking', accent: 'pink', icon: 'i-lucide-key-round', start: 14, duration: 2 },
  { label: 'Dinner', accent: 'orange', icon: 'i-lucide-utensils', start: 16, duration: 2 },
  { label: 'DIY project 2', accent: 'lime', icon: 'i-lucide-cpu', start: 18, duration: 6 },
];

export function formatSlot(slot: number) {
  const totalMinutes = EVENT_START_MINUTES + slot * SLOT_MINUTES;
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
}

export function agendaAsText(blocks: ScheduleBlock[] = agenda) {
  const sorted = [...blocks].sort((a, b) => a.start - b.start);
  const lines = ['MINI CCC AGENDA', `${formatSlot(0)}—${formatSlot(SLOT_COUNT)}`, ''];
  let cursor = 0;
  for (const block of sorted) {
    if (block.start > cursor) lines.push(`${formatSlot(cursor)}—${formatSlot(block.start)}  Open time`);
    lines.push(`${formatSlot(block.start)}—${formatSlot(block.start + block.duration)}  ${block.label}`);
    cursor = block.start + block.duration;
  }
  if (cursor < SLOT_COUNT) lines.push(`${formatSlot(cursor)}—${formatSlot(SLOT_COUNT)}  Open time`);
  return `${lines.join('\n')}\n`;
}
