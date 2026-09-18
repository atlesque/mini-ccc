import rawCsv from './bom.csv?raw';

export type BomItem = {
  number: number;
  name: string;
  cost: number;
  url: string;
};

export type Project = {
  number: number;
  name: string;
  slug: string;
  tag: string;
  kind: string;
  summary: string;
  description: string;
  accent: string;
  visual: string;
  items: BomItem[];
  total: number;
  votes: number;
};

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];

    if (character === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(field);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const metadata: Record<string, Omit<Project, 'number' | 'name' | 'slug' | 'items' | 'total'>> = {
  'Simon Memory Console': { tag: 'PLAY / INPUT', kind: 'play', summary: 'A pocket memory game with arcade muscle memory.', description: 'A four-button memory game uses RGB lights to show the sequence and a buzzer to mark mistakes.', accent: 'lime', visual: 'simon', votes: 12 },
  'Wi-Fi LED News Ticker': { tag: 'SIGNAL / WEB', kind: 'signal', summary: 'A tiny scrolling window onto the outside world.', description: 'A Wi-Fi-connected LED matrix scrolls live headlines across a small display.', accent: 'blue', visual: 'ticker', votes: 9 },
  'Retro Matrix Terminal': { tag: 'SIGNAL / DISPLAY', kind: 'signal', summary: 'Two red matrices for dashboards, prompts, and vibes.', description: 'Two red LED matrices show dashboards, scrolling prompts, and compact status displays.', accent: 'orange', visual: 'terminal', votes: 8 },
  'Arcade Reaction Timer': { tag: 'PLAY / SPEED', kind: 'play', summary: 'One button, one buzzer, one very competitive room.', description: 'An arcade button starts the timer; press it when the signal changes to measure your reaction time.', accent: 'pink', visual: 'timer', votes: 14 },
  'LED Decision Machine': { tag: 'GLOW / RANDOM', kind: 'glow', summary: 'An illuminated oracle for the indecisive.', description: 'Press the button and let a ring of LEDs make the decision for you.', accent: 'lime', visual: 'decision', votes: 11 },
  "Conway's Game of Life Frame": { tag: 'GLOW / SYSTEMS', kind: 'glow', summary: 'Emergent life in a tiny square of RGB pixels.', description: 'A square RGB panel runs Conway’s Game of Life, turning simple rules into shifting patterns.', accent: 'blue', visual: 'life', votes: 7 },
  'RGB Pixel-Art Frame': { tag: 'GLOW / ART', kind: 'glow', summary: 'A programmable canvas with exactly 64 pixels.', description: 'A 64-pixel RGB frame displays small programmable images and animations.', accent: 'orange', visual: 'pixel', votes: 6 },
  'Mini OLED Game Console': { tag: 'PLAY / POCKET', kind: 'play', summary: 'Small pixels, real stakes, built from a handful of parts.', description: 'A pocket game console combines a joystick, two buttons, and a monochrome OLED screen.', accent: 'pink', visual: 'console', votes: 13 },
  'Touch-Controlled Colour Synth': { tag: 'SOUND / TOUCH', kind: 'sound', summary: 'Touch becomes input, sound, and colour.', description: 'Touch sensors trigger tones and changing colors on a small interactive instrument.', accent: 'blue', visual: 'synth', votes: 10 },
  'Build-Status Light Sculpture': { tag: 'GLOW / DEVOPS', kind: 'glow', summary: 'Turn a build pipeline into ambient sculpture.', description: 'Three light rings turn build, test, and deploy states into a visible status sculpture.', accent: 'lime', visual: 'status', votes: 5 },
  'E-Paper Hacker Badge': { tag: 'BADGE / LOW POWER', kind: 'badge', summary: 'A name, handle, or status that stays visible.', description: 'An e-paper badge shows a name, handle, or status while using almost no power between updates.', accent: 'orange', visual: 'badge', votes: 8 },
  'Music Spectrum Display': { tag: 'SOUND / REACTIVE', kind: 'sound', summary: 'A microphone listens while the matrix draws the beat.', description: 'A microphone drives the LED matrix to visualize the frequency and rhythm of nearby sound.', accent: 'pink', visual: 'spectrum', votes: 9 },
  'Round Spaceship Instrument': { tag: 'INTERFACE / ROUND', kind: 'interface', summary: 'A tiny circular dashboard from an optimistic spacecraft.', description: 'A round display creates a compact spacecraft-style dashboard for a single-board computer.', accent: 'blue', visual: 'spaceship', votes: 4 },
  'Tiny Touchscreen Control Deck': { tag: 'INTERFACE / TOUCH', kind: 'interface', summary: 'A pocket control surface for whatever the group invents.', description: 'A small touchscreen provides controls for toggles, meters, and macros.', accent: 'orange', visual: 'deck', votes: 6 },
  'AMOLED Cyber Badge': { tag: 'BADGE / DISPLAY', kind: 'badge', summary: 'Saturated motion in a badge-sized footprint.', description: 'A bright AMOLED badge displays crisp graphics and animated identity in a compact footprint.', accent: 'pink', visual: 'amoled', votes: 7 },
  'Ultrasonic Radar Display': { tag: 'SENSOR / GLOW', kind: 'sensor', summary: 'Map the room with sound and paint it with light.', description: 'An ultrasonic sensor maps nearby objects while an LED sweep shows their distance and direction.', accent: 'lime', visual: 'radar', votes: 12 },
  '60-Pixel Clock Halo': { tag: 'GLOW / TIME', kind: 'glow', summary: 'An LED ring that turns time into a soft orbit.', description: 'A 60-pixel LED ring displays the time as a soft orbit of light.', accent: 'blue', visual: 'clock', votes: 9 },
  'Electronic Compass Halo': { tag: 'SENSOR / ORIENTATION', kind: 'sensor', summary: 'A compass sensor gives the halo a sense of north.', description: 'A compass sensor controls a glowing halo that points north as the device rotates.', accent: 'orange', visual: 'compass', votes: 5 },
  'LED Light-Painting Wand': { tag: 'GLOW / CAMERA', kind: 'glow', summary: 'Leave traces in the dark with a portable pixel wand.', description: 'A portable strip of LEDs creates long-exposure light trails when moved through the dark.', accent: 'pink', visual: 'wand', votes: 8 },
  'Thermal Hacker Receipt Printer': { tag: 'OUTPUT / PAPER', kind: 'interface', summary: 'Print the things the group does, decides, or remembers.', description: 'A thermal printer turns votes, notes, and small decisions into physical receipts.', accent: 'orange', visual: 'printer', votes: 11 },
};

const rows = parseCsv(rawCsv).slice(1);
const buildNames = [...new Set(rows.map((row) => row[1]))];

export const projects: Project[] = buildNames.map((name, index) => {
  const projectRows = rows.filter((row) => row[1] === name);
  const meta = metadata[name];
  const items = projectRows.map((row) => ({
    number: Number(row[2]),
    name: row[3],
    cost: Number(row[4]),
    url: row[5],
  }));

  return {
    number: Number(projectRows[0][0]),
    name,
    slug: slugify(name),
    ...meta,
    items,
    total: Number(items.reduce((sum, item) => sum + item.cost, 0).toFixed(2)),
    votes: meta.votes + index % 2,
  };
});

export const eventImage = '/generated/f29e14d7_000.png';
export const totalBudget = Number(projects.reduce((sum, project) => sum + project.total, 0).toFixed(2));

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
