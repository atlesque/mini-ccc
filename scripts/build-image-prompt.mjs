const accentColors = {
  lime: 'acid lime #C4FF4A',
  blue: 'electric periwinkle #7391FF',
  orange: 'warm signal orange #FF956F',
  pink: 'vivid rose #FF7EC3',
};

export const BUILD_IMAGE_SIZE = '1536x1024';

export function createBuildImagePrompt({ name, description, accent = 'lime' }) {
  const accentColor = accentColors[accent] ?? accentColors.lime;

  return [
    'Create one original, polished editorial illustration for a small electronics build on the Mini CCC website.',
    `BUILD TITLE: ${name}`,
    `BUILD DESCRIPTION: ${description}`,
    'Show the central physical object and its defining components so the illustration immediately reflects this specific build. Interpret the description faithfully; do not add unrelated gadgets or scenery.',
    '',
    'MINI CCC ART DIRECTION:',
    'A modern, precise, slightly playful maker aesthetic: a carefully composed product illustration with tactile 3D forms, clean geometric silhouettes, fine technical linework, subtle grain, and restrained soft glow. Blend the clarity of a premium product illustration with the energy of a small experimental electronics lab. Keep it graphic and art-directed rather than photographic.',
    'Use a near-black forest background (#0D100F) with quiet raised charcoal-green shapes (#161B17). The primary signal color for this build is ' + accentColor + '. Keep other site accents rare and muted: periwinkle #7391FF, warm orange #FF956F, and rose #FF7EC3. Use luminous color as a controlled highlight around the subject, not as a full-frame wash. Maintain strong contrast and a dark-mode-ready overall value.',
    '',
    'COMPOSITION AND CROP:',
    'Landscape 3:2 artwork, exactly 1536 by 1024 pixels. One clear hero object, centered and fully visible, with generous dark negative space around it. Keep all essential parts inside the middle 60% of the width and middle 70% of the height, leaving a crop-safe margin on every edge. The composition must remain clear when cropped to a wide preview card or a nearly square detail hero, and when displayed small.',
    '',
    'Do not include text, letters, numbers, logos, watermarks, borders, UI panels, collages, split scenes, hands, people, or a bright background. Do not crop the build itself at the image edges. Avoid busy circuit-board filler and excessive neon.',
  ].join('\n');
}
