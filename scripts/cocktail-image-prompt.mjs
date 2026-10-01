const accentColors = {
  lime: 'acid lime #C4FF4A',
  blue: 'electric periwinkle #7391FF',
  orange: 'warm signal orange #FF956F',
  pink: 'vivid rose #FF7EC3',
};

export const COCKTAIL_IMAGE_SIZE = '1536x1024';

export function createCocktailImagePrompt({ name, summary, ingredients, accent = 'lime' }) {
  const accentColor = accentColors[accent] ?? accentColors.lime;
  const recipeNote = name === 'Mate Coffee Float'
    ? 'RECIPE ACCURACY: Despite the drink name, this recipe contains no ice cream. Show dark iced cold brew with a small orange peel twist; no scoop, cream cap, or foam topping.'
    : '';

  return [
    'Create one original, polished editorial drink illustration for a small cocktail list on the Mini CCC website.',
    `COCKTAIL: ${name}`,
    `DESCRIPTION: ${summary}`,
    `INGREDIENTS: ${ingredients.join(', ')}`,
    'Show one finished drink in distinctive glassware with a small number of accurate, recognizable ingredients or garnishes. Interpret this specific recipe faithfully; do not add ingredients that are not listed.',
    recipeNote,
    '',
    'MINI CCC ART DIRECTION:',
    'A modern, precise, slightly playful maker aesthetic: an art-directed product illustration with tactile 3D forms, clean geometric silhouettes, fine technical linework, subtle grain, and restrained soft glow. Keep the beverage elegant and appetizing with clear glass reflections, visible ice where appropriate, and realistic liquid color. Graphic and polished rather than a generic bar photograph.',
    `Use a near-black forest background (#0D100F) with quiet raised charcoal-green shapes (#161B17). The primary signal color is ${accentColor}. Keep other site accents rare and muted: periwinkle #7391FF, warm orange #FF956F, and rose #FF7EC3. Use luminous color as a controlled highlight, not as a full-frame wash. Maintain strong contrast and a dark-mode-ready overall value.`,
    '',
    'COMPOSITION AND CROP:',
    'Landscape 3:2 artwork, exactly 1536 by 1024 pixels. One clear hero glass, centered and fully visible, with generous dark negative space around it. Keep all essential parts inside the middle 60% of the width and middle 70% of the height, leaving a crop-safe margin on every edge. The composition must stay recognizable when cropped to a wide card and when displayed small.',
    '',
    'Show only the finished drink and a few loose ingredients or garnishes from its recipe. Do not include bottles, cans, packaging, labels, text, letters, numbers, logos, watermarks, borders, UI panels, collages, split scenes, hands, people, or a bright background. Do not crop the glass or garnish at the image edges. Avoid busy scenery, extra glasses, and excessive neon.',
  ].join('\n');
}
