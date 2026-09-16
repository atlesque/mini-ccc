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
  signal: string;
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
  'Simon Memory Console': { tag: 'PLAY / INPUT', kind: 'play', summary: 'A pocket memory game with arcade muscle memory.', description: 'A four-button memory game with a ring of RGB feedback. It turns the first spare minute after dinner into a tiny score chase, with the buzzer making every miss feel wonderfully official.', signal: 'REPEAT THE PATTERN', accent: 'lime', visual: 'simon', votes: 12 },
  'Wi-Fi LED News Ticker': { tag: 'SIGNAL / WEB', kind: 'signal', summary: 'A tiny scrolling window onto the outside world.', description: 'Pull a live headline feed into a scroll of matrix pixels. Good for a desk corner that wants to feel like a newsroom, without needing another full-size screen.', signal: 'NEW HEADLINES INCOMING', accent: 'blue', visual: 'ticker', votes: 9 },
  'Retro Matrix Terminal': { tag: 'SIGNAL / DISPLAY', kind: 'signal', summary: 'Two red matrices for dashboards, prompts, and vibes.', description: 'A two-matrix display for tiny dashboards, scrolling prompts, and terminal-era vibes. It is the sort of build that makes even a temperature reading feel like a mission briefing.', signal: 'SYSTEM READY // 80 COL', accent: 'orange', visual: 'terminal', votes: 8 },
  'Arcade Reaction Timer': { tag: 'PLAY / SPEED', kind: 'play', summary: 'One button, one buzzer, one very competitive room.', description: 'An arcade button, a timer, and a buzzer. The build is simple; the rematch loop is not. Perfect for settling debates that should never have become debates.', signal: 'PRESS WHEN GREEN', accent: 'pink', visual: 'timer', votes: 14 },
  'LED Decision Machine': { tag: 'GLOW / RANDOM', kind: 'glow', summary: 'An illuminated oracle for the indecisive.', description: 'Press the button and let the halo choose. A one-button oracle that makes indecision look good, with just enough ceremony to turn a coin toss into an event.', signal: 'THE MACHINE HAS SPOKEN', accent: 'lime', visual: 'decision', votes: 11 },
  "Conway's Game of Life Frame": { tag: 'GLOW / SYSTEMS', kind: 'glow', summary: 'Emergent life in a tiny square of RGB pixels.', description: 'Watch cellular automata bloom across a square RGB panel. No network needed, just a few rules, a lot of iteration, and the strange satisfaction of seeing order become chaos.', signal: 'GENERATION 042', accent: 'blue', visual: 'life', votes: 7 },
  'RGB Pixel-Art Frame': { tag: 'GLOW / ART', kind: 'glow', summary: 'A programmable canvas with exactly 64 pixels.', description: 'A tiny programmable canvas for pixel art, color studies, and extremely low-resolution portraits. The constraint is the point: every pixel has a job.', signal: 'DRAW WITH LIGHT', accent: 'orange', visual: 'pixel', votes: 6 },
  'Mini OLED Game Console': { tag: 'PLAY / POCKET', kind: 'play', summary: 'Small pixels, real stakes, built from a handful of parts.', description: 'A pocket console with a joystick, two buttons, and a monochrome screen. Small pixels, real stakes, and a satisfying amount of hardware packed into a tiny footprint.', signal: 'PLAYER 01 // READY', accent: 'pink', visual: 'console', votes: 13 },
  'Touch-Controlled Colour Synth': { tag: 'SOUND / TOUCH', kind: 'sound', summary: 'Touch becomes input, sound, and colour.', description: 'Touch becomes input, sound, and color. A tactile little instrument for making a room respond, whether the output is a note, a flash, or a happy accident.', signal: 'TOUCH THE COPPER', accent: 'blue', visual: 'synth', votes: 10 },
  'Build-Status Light Sculpture': { tag: 'GLOW / DEVOPS', kind: 'glow', summary: 'Turn a build pipeline into ambient sculpture.', description: 'Three light rings turn a build pipeline into ambient sculpture. Green feels different when it is physical, especially when everyone in the room can see it.', signal: 'BUILD // TEST // SHIP', accent: 'lime', visual: 'status', votes: 5 },
  'E-Paper Hacker Badge': { tag: 'BADGE / LOW POWER', kind: 'badge', summary: 'A name, handle, or status that stays visible.', description: 'A badge that keeps its last message visible without staying lit. Perfect for names, handles, status codes, and the kind of tiny personal UI that makes a gathering feel like a conference.', signal: 'HELLO, I AM BUILDING', accent: 'orange', visual: 'badge', votes: 8 },
  'Music Spectrum Display': { tag: 'SOUND / REACTIVE', kind: 'sound', summary: 'A microphone listens while the matrix draws the beat.', description: 'A microphone listens and the matrix draws the beat. The result is a reactive visualizer with almost no footprint and a good excuse to test every speaker in the house.', signal: 'LISTENING FOR SIGNAL', accent: 'pink', visual: 'spectrum', votes: 9 },
  'Round Spaceship Instrument': { tag: 'INTERFACE / ROUND', kind: 'interface', summary: 'A tiny circular dashboard from an optimistic spacecraft.', description: 'A tiny round display turns a one-board computer into a dashboard from an optimistic spacecraft. It is a compact exercise in making an unusual screen feel intentional.', signal: 'ORBITAL INSTRUMENT', accent: 'blue', visual: 'spaceship', votes: 4 },
  'Tiny Touchscreen Control Deck': { tag: 'INTERFACE / TOUCH', kind: 'interface', summary: 'A pocket control surface for whatever the group invents.', description: 'A pocket control surface for toggles, meters, macros, and whatever the group invents next. The touchscreen makes it feel like a tool before there is even a final tool to control.', signal: 'CONTROL SURFACE ONLINE', accent: 'orange', visual: 'deck', votes: 6 },
  'AMOLED Cyber Badge': { tag: 'BADGE / DISPLAY', kind: 'badge', summary: 'Saturated motion in a badge-sized footprint.', description: 'A bright, saturated badge-sized display for crisp graphics and moving identity. Great for a bold call sign, a tiny dashboard, or a screen that simply wants to glow.', signal: 'HIGH CONTRAST MODE', accent: 'pink', visual: 'amoled', votes: 7 },
  'Ultrasonic Radar Display': { tag: 'SENSOR / GLOW', kind: 'sensor', summary: 'Map the room with sound and paint it with light.', description: 'Map the room with sound and paint the distance as a rotating LED sweep. The result is a little radar station that makes invisible space feel legible.', signal: 'SCANNING THE ROOM', accent: 'lime', visual: 'radar', votes: 12 },
  '60-Pixel Clock Halo': { tag: 'GLOW / TIME', kind: 'glow', summary: 'An LED ring that turns time into a soft orbit.', description: 'An LED ring becomes a clock face, with time encoded as a soft orbit of light. It is useful enough to keep on a shelf and strange enough to start a conversation.', signal: 'TIME IS A CIRCLE', accent: 'blue', visual: 'clock', votes: 9 },
  'Electronic Compass Halo': { tag: 'SENSOR / ORIENTATION', kind: 'sensor', summary: 'A compass sensor gives the halo a sense of north.', description: 'A compass sensor gives the halo a sense of north. Rotate the build and the colors follow, turning orientation into a tactile, glowing gesture.', signal: 'NORTH LOCKED', accent: 'orange', visual: 'compass', votes: 5 },
  'LED Light-Painting Wand': { tag: 'GLOW / CAMERA', kind: 'glow', summary: 'Leave traces in the dark with a portable pixel wand.', description: 'A portable strip of pixels for long-exposure light painting and leaving traces in the dark. This is the build to bring outside when the room needs a little more motion.', signal: 'PAINT THE AIR', accent: 'pink', visual: 'wand', votes: 8 },
  'Thermal Hacker Receipt Printer': { tag: 'OUTPUT / PAPER', kind: 'interface', summary: 'Print the things the group does, decides, or remembers.', description: 'Print tiny receipts for the things the group does, decides, or wants to remember. A physical output turns a throwaway joke or a vote into an artifact you can stick to the fridge.', signal: 'PRINTING A MEMORY', accent: 'orange', visual: 'printer', votes: 11 },
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
