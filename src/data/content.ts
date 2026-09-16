export type CuratedVideo = {
  number: number;
  title: string;
  channel: string;
  duration: string;
  summary: string;
  visual: string;
  accent: string;
  url: string;
};

export type Cocktail = {
  number: number;
  name: string;
  style: string;
  summary: string;
  ingredients: string[];
  method: string;
  visual: string;
  accent: string;
  alcoholFree: boolean;
};

export const videos: CuratedVideo[] = [
  { number: 1, title: 'Build an 8-bit computer from scratch', channel: 'Ben Eater', duration: 'SERIES', summary: 'A gloriously patient tour through logic gates, memory, and the joy of seeing a machine boot because you made every part of it.', visual: 'terminal', accent: 'blue', url: 'https://www.youtube.com/@BenEater/search?query=8-bit%20computer' },
  { number: 2, title: 'A lock picking lesson in tiny movements', channel: 'LockPickingLawyer', duration: 'SHORT FORM', summary: 'A focused look at tension, feedback, and the surprising amount of information hidden inside one little click.', visual: 'radar', accent: 'orange', url: 'https://www.youtube.com/@lockpickinglawyer/search?query=beginner%20lock%20picking' },
  { number: 3, title: 'The most over-engineered desk lamp', channel: 'Simone Giertz', duration: 'BUILD', summary: 'A playful build with enough mechanism, personality, and questionable decisions to make the whole room want to try something.', visual: 'wand', accent: 'pink', url: 'https://www.youtube.com/@simonegiertz/search?query=desk%20lamp' },
  { number: 4, title: 'How to make a tiny synthesizer', channel: 'Look Mum No Computer', duration: 'DEEP DIVE', summary: 'Circuits, sound, and a beautiful amount of experimentation. Queue this one when the room starts making its own noises.', visual: 'synth', accent: 'lime', url: 'https://www.youtube.com/@LookMumNoComputer/search?query=synthesizer' },
  { number: 5, title: 'Make a game with an LED matrix', channel: 'Maker search', duration: 'PROJECT', summary: 'A bright, approachable project that turns a grid of pixels into something immediately playable.', visual: 'pixel', accent: 'blue', url: 'https://www.youtube.com/results?search_query=DIY+LED+matrix+game+maker' },
  { number: 6, title: 'The satisfying science of cocktail ice', channel: 'The Educated Barfly', duration: 'BAR LAB', summary: 'A small detour into clarity, dilution, and why the humble ice cube deserves its own close-up.', visual: 'clock', accent: 'orange', url: 'https://www.youtube.com/@TheEducatedBarfly/search?query=ice' },
];

export const cocktails: Cocktail[] = [
  { number: 1, name: 'Mate Mule', style: 'ALCOHOLIC / BRIGHT', summary: 'A limey, gingery highball with the herbal snap of Club-Mate.', ingredients: ['Club-Mate', 'ginger beer', 'lime juice', 'vodka', 'ice'], method: 'Build over ice, add vodka and lime, then top with ginger beer and Club-Mate.', visual: 'ring', accent: 'orange', alcoholFree: false },
  { number: 2, name: 'Grapefruit Mate Spritz', style: 'ALCOHOLIC / CITRUS', summary: 'Bitter grapefruit, a little sparkle, and a long afternoon in one glass.', ingredients: ['Club-Mate', 'grapefruit juice', 'aperitif', 'soda water', 'ice'], method: 'Stir the aperitif and grapefruit over ice, then top with soda and Club-Mate.', visual: 'spectrum', accent: 'pink', alcoholFree: false },
  { number: 3, name: 'Mate Paloma Highball', style: 'ALCOHOLIC / SALTY', summary: 'Tequila and grapefruit get a caffeinated, gently bitter lift.', ingredients: ['Club-Mate', 'tequila', 'grapefruit soda', 'lime', 'salt'], method: 'Salt the rim, add tequila and lime over ice, then finish with grapefruit soda and Club-Mate.', visual: 'compass', accent: 'blue', alcoholFree: false },
  { number: 4, name: 'Cucumber Lime Mate', style: 'ZERO-PROOF / FRESH', summary: 'Cool cucumber and sharp lime make Club-Mate feel garden-fresh.', ingredients: ['Club-Mate', 'cucumber', 'lime juice', 'mint', 'ice'], method: 'Muddle cucumber and mint lightly, add lime and ice, then top with Club-Mate.', visual: 'radar', accent: 'lime', alcoholFree: true },
  { number: 5, name: 'Cherry Mate Fizz', style: 'ZERO-PROOF / FRUITY', summary: 'Tart cherry, lemon, and bubbles for a red little signal flare.', ingredients: ['Club-Mate', 'tart cherry juice', 'lemon juice', 'soda water', 'ice'], method: 'Shake the juices with ice, pour into a tall glass, and top with soda and Club-Mate.', visual: 'pixel', accent: 'pink', alcoholFree: true },
  { number: 6, name: 'Mate Coffee Float', style: 'ZERO-PROOF / DESSERT', summary: 'Cold brew, vanilla, and Club-Mate with a very good reason to stay up late.', ingredients: ['Club-Mate', 'cold brew coffee', 'vanilla syrup', 'orange peel', 'ice'], method: 'Add cold brew and syrup over ice, then pour in Club-Mate and express an orange peel.', visual: 'amoled', accent: 'orange', alcoholFree: true },
];
