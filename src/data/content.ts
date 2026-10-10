export type CuratedVideo = {
  number: number;
  title: string;
  channel: string;
  duration: string;
  summary: string;
  visual: string;
  accent: string;
  url: string;
  thumbnail?: string;
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
  { number: 1, title: 'Build an 8-bit computer from scratch', channel: 'Ben Eater', duration: 'SERIES', summary: 'A gloriously patient tour through logic gates, memory, and the joy of seeing a machine boot because you made every part of it.', visual: 'terminal', accent: 'blue', url: 'https://www.youtube.com/@BenEater/search?query=8-bit%20computer', thumbnail: 'https://i.ytimg.com/vi/HyznrdDSSGM/maxresdefault.jpg' },
  { number: 2, title: 'A lock picking lesson in tiny movements', channel: 'LockPickingLawyer', duration: 'SHORT FORM', summary: 'A focused look at tension, feedback, and the surprising amount of information hidden inside one little click.', visual: 'radar', accent: 'orange', url: 'https://www.youtube.com/@lockpickinglawyer/search?query=beginner%20lock%20picking', thumbnail: 'https://i.ytimg.com/vi/T_sy3dLwHkc/maxresdefault.jpg' },
  { number: 3, title: 'The most over-engineered desk lamp', channel: 'Simone Giertz', duration: 'BUILD', summary: 'A playful build with enough mechanism, personality, and questionable decisions to make the whole room want to try something.', visual: 'wand', accent: 'pink', url: 'https://www.youtube.com/@simonegiertz/search?query=desk%20lamp', thumbnail: 'https://i.ytimg.com/vi/GPSNT5vjSO8/maxresdefault.jpg' },
  { number: 4, title: 'How to make a tiny synthesizer', channel: 'Look Mum No Computer', duration: 'DEEP DIVE', summary: 'Circuits, sound, and a beautiful amount of experimentation. Queue this one when the room starts making its own noises.', visual: 'synth', accent: 'lime', url: 'https://www.youtube.com/@LookMumNoComputer/search?query=synthesizer', thumbnail: 'https://i.ytimg.com/vi/10unLGcGQjs/maxresdefault.jpg' },
  { number: 5, title: 'Make a game with an LED matrix', channel: 'Maker search', duration: 'PROJECT', summary: 'A bright, approachable project that turns a grid of pixels into something immediately playable.', visual: 'pixel', accent: 'blue', url: 'https://www.youtube.com/results?search_query=DIY+LED+matrix+game+maker', thumbnail: 'https://i.ytimg.com/vi/IMUkkf9EZII/maxresdefault.jpg' },
  { number: 6, title: 'The satisfying science of cocktail ice', channel: 'The Educated Barfly', duration: 'BAR LAB', summary: 'A small detour into clarity, dilution, and why the humble ice cube deserves its own close-up.', visual: 'clock', accent: 'orange', url: 'https://www.youtube.com/@TheEducatedBarfly/search?query=ice', thumbnail: 'https://i.ytimg.com/vi/NC6-YoXwrdY/maxresdefault.jpg' },
  { number: 7, title: 'Why the door, not the lock, is the weak spot', channel: 'Deviant Ollam', duration: 'TALK', summary: 'Doors, hinges, and latches get the spotlight in a talk that shows the lock is rarely the weakest part of the door.', visual: 'radar', accent: 'orange', url: 'https://www.youtube.com/@DeviantOllam/search?query=door%20bypass' },
  { number: 8, title: 'Making your own lock picks from street sweeper bristles', channel: 'Bosnianbill', duration: 'BUILD', summary: 'A grinder, a file, and some patience turn scrap spring steel into a pick set that works surprisingly well.', visual: 'wand', accent: 'orange', url: 'https://www.youtube.com/results?search_query=make+your+own+lock+picks+street+sweeper+bristles' },
  { number: 9, title: 'Why 3D printed parts break where they do', channel: 'CNC Kitchen', duration: 'LAB TEST', summary: 'Layer adhesion, infill, and wall count get torture-tested until the numbers settle every forum argument.', visual: 'spectrum', accent: 'lime', url: 'https://www.youtube.com/@CNCKitchen/search?query=strength%20test' },
  { number: 10, title: 'Designing 3D printed snap fits and living hinges', channel: 'Maker\'s Muse', duration: 'DESIGN', summary: 'Small design tricks that let printed parts clip, flex, and click together without a single screw.', visual: 'deck', accent: 'blue', url: 'https://www.youtube.com/@MakersMuse/search?query=snap%20fit' },
  { number: 11, title: 'Tuning a printer until the calibration cube is perfect', channel: 'Thomas Sanladerer', duration: 'DEEP DIVE', summary: 'Pressure advance, input shaping, and flow rate explained by someone who has clearly printed a few thousand cubes.', visual: 'console', accent: 'lime', url: 'https://www.youtube.com/@MadeWithLayers/search?query=calibration' },
  { number: 12, title: 'Building an FPV drone from a box of parts', channel: 'Joshua Bardwell', duration: 'BUILD', summary: 'Soldering the stack, flashing Betaflight, and the nervous first hover of a quad you put together yourself.', visual: 'compass', accent: 'pink', url: 'https://www.youtube.com/@JoshuaBardwell/search?query=build' },
  { number: 13, title: 'Designing a 3D printed plane that actually flies', channel: 'Tom Stanton', duration: 'PROJECT', summary: 'Prototype, crash, reprint, repeat, until a printed airframe finally holds the air.', visual: 'spaceship', accent: 'blue', url: 'https://www.youtube.com/@TomStantonEngineering/search?query=3D%20printed%20plane' },
  { number: 14, title: 'LoRa, Meshtastic, and talking without the internet', channel: 'Andreas Spiess', duration: 'DEEP DIVE', summary: 'How tiny radios can pass messages for kilometres, and what happens when you set up your own off-grid mesh.', visual: 'ticker', accent: 'blue', url: 'https://www.youtube.com/@AndreasSpiess/search?query=meshtastic' },
  { number: 15, title: 'Wi-Fi hacking with a Raspberry Pi in your pocket', channel: 'NetworkChuck', duration: 'TUTORIAL', summary: 'An energetic walk through monitor mode, handshakes, and why your own network deserves a stronger password.', visual: 'terminal', accent: 'lime', url: 'https://www.youtube.com/@NetworkChuck/search?query=wifi%20hacking' },
  { number: 16, title: 'Rubber Ducky payloads: a USB stick that types for you', channel: 'Hak5', duration: 'SHORT FORM', summary: 'A keystroke-injection demo that will make the whole room lock their laptop before leaving for a drink.', visual: 'printer', accent: 'pink', url: 'https://www.youtube.com/@hak5/search?query=rubber%20ducky' },
  { number: 17, title: 'Capture the flag: reversing a crackme live', channel: 'John Hammond', duration: 'WALKTHROUGH', summary: 'A friendly CTF solve that shows how a disassembler turns a mystery binary into a readable puzzle.', visual: 'terminal', accent: 'orange', url: 'https://www.youtube.com/@_JohnHammond/search?query=crackme' },
  { number: 18, title: 'How a buffer overflow really works', channel: 'LiveOverflow', duration: 'EXPLAINER', summary: 'Stacks, return addresses, and the moment a program runs code it was never meant to see.', visual: 'life', accent: 'pink', url: 'https://www.youtube.com/@LiveOverflow/search?query=buffer%20overflow' },
  { number: 19, title: 'Cloning RFID badges and why it is so easy', channel: 'Computerphile', duration: 'EXPLAINER', summary: 'Low-frequency tags, readers, and a Proxmark later, the office access card looks a lot less secure.', visual: 'badge', accent: 'orange', url: 'https://www.youtube.com/@Computerphile/search?query=RFID' },
  { number: 20, title: 'Hacking a car key fob with a cheap radio', channel: 'Samy Kamkar', duration: 'TALK', summary: 'Rolling codes, replay attacks, and a pocket-sized gadget that shows how wireless keys can go wrong.', visual: 'radar', accent: 'pink', url: 'https://www.youtube.com/results?search_query=Samy+Kamkar+RollJam+key+fob' },
  { number: 21, title: 'A Flipper Zero tour: what it can and cannot do', channel: 'Maker search', duration: 'SHORT FORM', summary: 'Sub-GHz, NFC, infrared, and a reality check on the most hyped hacker toy of the decade.', visual: 'amoled', accent: 'lime', url: 'https://www.youtube.com/results?search_query=Flipper+Zero+what+it+can+actually+do' },
  { number: 22, title: 'Making LED filament sculptures that glow like neon', channel: 'Great Scott!', duration: 'BUILD', summary: 'Flexible LED filaments, a bit of brass wire, and a soldering session that ends in a glowing desk sculpture.', visual: 'wand', accent: 'pink', url: 'https://www.youtube.com/@greatscottlab/search?query=LED%20filament' },
  { number: 23, title: 'Building a giant LED wall from WS2812 strips', channel: 'bitluni', duration: 'PROJECT', summary: 'Hundreds of addressable pixels, one tiny microcontroller, and a lot of power-supply maths to make it all light up.', visual: 'pixel', accent: 'blue', url: 'https://www.youtube.com/@bitluni/search?query=LED%20wall' },
  { number: 24, title: 'The brightest DIY daylight lamp', channel: 'DIY Perks', duration: 'BUILD', summary: 'A clever optical build that fakes a sunny window using LEDs, a lens, and plenty of thermal planning.', visual: 'clock', accent: 'orange', url: 'https://www.youtube.com/@DIYPerks/search?query=sunlight' },
  { number: 25, title: 'Building a robot that solves a problem nobody had', channel: 'Stuff Made Here', duration: 'DEEP DIVE', summary: 'Enormous engineering effort, honest failures, and a finished machine that is equal parts ridiculous and brilliant.', visual: 'decision', accent: 'lime', url: 'https://www.youtube.com/@StuffMadeHere/search?query=robot' },
  { number: 26, title: 'Soldering for beginners without the frustration', channel: 'Maker search', duration: 'TUTORIAL', summary: 'Iron temperature, flux, and tinning explained so the first workshop kit comes out shiny instead of lumpy.', visual: 'status', accent: 'blue', url: 'https://www.youtube.com/results?search_query=soldering+for+beginners+guide' },
];

export const cocktails: Cocktail[] = [
  { number: 1, name: 'Mate Mule', style: 'BRIGHT', summary: 'A limey, gingery highball with the herbal snap of Club-Mate.', ingredients: ['Club-Mate', 'ginger beer', 'lime juice', 'vodka', 'ice'], method: 'Build over ice, add vodka and lime, then top with ginger beer and Club-Mate.', visual: 'ring', accent: 'orange', alcoholFree: false },
  { number: 2, name: 'Grapefruit Mate Spritz', style: 'CITRUS', summary: 'Bitter grapefruit, a little sparkle, and a long afternoon in one glass.', ingredients: ['Club-Mate', 'grapefruit juice', 'aperitif', 'soda water', 'ice'], method: 'Stir the aperitif and grapefruit over ice, then top with soda and Club-Mate.', visual: 'spectrum', accent: 'pink', alcoholFree: false },
  { number: 3, name: 'Mate Paloma Highball', style: 'SALTY', summary: 'Tequila and grapefruit get a caffeinated, gently bitter lift.', ingredients: ['Club-Mate', 'tequila', 'grapefruit soda', 'lime', 'salt'], method: 'Salt the rim, add tequila and lime over ice, then finish with grapefruit soda and Club-Mate.', visual: 'compass', accent: 'blue', alcoholFree: false },
  { number: 4, name: 'Cucumber Lime Mate', style: 'FRESH', summary: 'Cool cucumber and sharp lime make Club-Mate feel garden-fresh.', ingredients: ['Club-Mate', 'cucumber', 'lime juice', 'mint', 'ice'], method: 'Muddle cucumber and mint lightly, add lime and ice, then top with Club-Mate.', visual: 'radar', accent: 'lime', alcoholFree: true },
  { number: 5, name: 'Cherry Mate Fizz', style: 'FRUITY', summary: 'Tart cherry, lemon, and bubbles for a red little signal flare.', ingredients: ['Club-Mate', 'tart cherry juice', 'lemon juice', 'soda water', 'ice'], method: 'Shake the juices with ice, pour into a tall glass, and top with soda and Club-Mate.', visual: 'pixel', accent: 'pink', alcoholFree: true },
  { number: 6, name: 'Mate Coffee Float', style: 'DESSERT', summary: 'Cold brew, vanilla, and Club-Mate with a very good reason to stay up late.', ingredients: ['Club-Mate', 'cold brew coffee', 'vanilla syrup', 'orange peel', 'ice'], method: 'Add cold brew and syrup over ice, then pour in Club-Mate and express an orange peel.', visual: 'amoled', accent: 'orange', alcoholFree: true },
];
