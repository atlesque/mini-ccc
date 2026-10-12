<script setup lang="ts">
const props = withDefaults(defineProps<{ visual: string; accent?: string }>(), { accent: 'lime' });

const pixelCount = computed(() => (props.visual === 'life' || props.visual === 'pixel' ? 36 : 16));
</script>

<template>
  <div class="project-viz" :class="[`project-viz--${visual}`, `project-viz--${accent}`]" aria-hidden="true">
    <div class="viz-grid" />
    <div v-if="visual === 'simon'" class="viz-buttons"><i /><i /><i /><i /></div>
    <div v-else-if="visual === 'ticker'" class="viz-ticker"><span>MINI CCC // SIGNAL</span><span>BUILD SOMETHING TINY</span></div>
    <div v-else-if="visual === 'terminal'" class="viz-terminal"><span>&gt; boot mini_ccc</span><span>matrix online_</span><span>█ █ ██ █ █</span></div>
    <div v-else-if="visual === 'timer'" class="viz-timer"><b>0.238</b><span>PRESS / REACT</span></div>
    <div v-else-if="visual === 'decision'" class="viz-ring"><i /><i /><i /><b>?</b></div>
    <div v-else-if="visual === 'life' || visual === 'pixel'" class="viz-pixels">
      <i v-for="index in pixelCount" :key="index" :class="{ 'is-on': ((index - 1) * 7 + 3) % 11 < 4 }" />
    </div>
    <div v-else-if="visual === 'console'" class="viz-console"><div class="viz-screen">▲<br>◼︎ ◼︎</div><div class="viz-controls"><i /><i /><i /></div></div>
    <div v-else-if="visual === 'synth'" class="viz-synth"><i /><i /><i /><i /><b>TOUCH</b></div>
    <div v-else-if="visual === 'status'" class="viz-status"><i /><i /><i /><span>BUILD / PASS</span></div>
    <div v-else-if="visual === 'badge'" class="viz-badge"><span>HELLO</span><b>:)</b><small>MINI CCC / 26</small></div>
    <div v-else-if="visual === 'spectrum'" class="viz-spectrum">
      <i v-for="index in 9" :key="index" :style="{ '--height': `${24 + (((index - 1) * 19) % 58)}%` }" />
    </div>
    <div v-else-if="visual === 'spaceship'" class="viz-spaceship"><div class="viz-orbit" /><b>08:42</b><small>ORBIT OK</small></div>
    <div v-else-if="visual === 'deck'" class="viz-deck"><span /><span /><span /><span /><b>CONTROL</b></div>
    <div v-else-if="visual === 'amoled'" class="viz-amoled"><b>CCC</b><span>01:01</span><i /></div>
    <div v-else-if="visual === 'radar'" class="viz-radar"><i /><i /><b /></div>
    <div v-else-if="visual === 'clock'" class="viz-clock"><i /><i /><i /><b>12</b></div>
    <div v-else-if="visual === 'compass'" class="viz-compass"><i /><b>N</b><span>E</span><small>S</small><em>W</em></div>
    <div v-else-if="visual === 'wand'" class="viz-wand"><i /><i /><i /><i /><span /></div>
    <div v-else-if="visual === 'printer'" class="viz-printer"><div class="viz-paper">MINI CCC<br>BUILD #20<br>PASS ✓</div><b /></div>
  </div>
</template>
