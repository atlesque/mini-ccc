<template>
  <svg viewBox="0 0 400 400" class="pointer-events-none select-none" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="ring-fade" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="var(--acid)" stop-opacity="0.18" />
        <stop offset="100%" stop-color="var(--acid)" stop-opacity="0" />
      </radialGradient>
    </defs>
    <circle cx="200" cy="200" r="198" fill="url(#ring-fade)" />
    <g fill="none" stroke-linecap="round">
      <circle cx="200" cy="200" r="190" stroke="var(--hairline-strong)" stroke-dasharray="2 6" />
      <g class="origin-center animate-[spin_60s_linear_infinite]">
        <path d="M335 110a165 165 0 1 0 0 180" stroke="var(--acid)" stroke-width="3" />
      </g>
      <g class="origin-center animate-[spin_40s_linear_infinite_reverse]">
        <path d="M300 140a118 118 0 1 0 0 120" stroke="var(--signal-blue)" stroke-width="2.5" />
      </g>
      <g class="origin-center animate-[spin_28s_linear_infinite]">
        <path d="M262 172a70 70 0 1 0 0 56" stroke="var(--signal-orange)" stroke-width="2" />
      </g>
      <circle cx="200" cy="200" r="34" stroke="var(--hairline-strong)" />
      <path d="M200 200h120" stroke="var(--ink-soft)" stroke-width="1" />
    </g>
    <circle cx="200" cy="200" r="7" fill="var(--ink)" />
    <circle cx="320" cy="200" r="3" fill="var(--acid)" />
  </svg>
</template>
