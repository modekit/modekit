<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'

import ModeKitLogo from '../components/ModeKitLogo.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-title-before>
      <ModeKitLogo class="modekit-logo--nav" :decorative="true" />
    </template>
    <template #home-hero-image>
      <div class="modekit-logo-hero">
        <div class="modekit-logo-stage">
          <ModeKitLogo class="modekit-logo--hero" />
          <div class="modekit-logo-palette" aria-hidden="true">
            <span class="modekit-logo-swatch modekit-logo-swatch--primary" />
            <span class="modekit-logo-swatch modekit-logo-swatch--neutral" />
            <span class="modekit-logo-swatch modekit-logo-swatch--surface" />
          </div>
        </div>
      </div>
    </template>
    <template #home-features-after>
      <section class="modekit-developer-section" aria-labelledby="modekit-developer-heading">
        <div class="modekit-developer-section__main">
          <h2 id="modekit-developer-heading">Made for developers. Shaped by them.</h2>
          <p class="modekit-developer-section__intro">
            Star the project, report a rough edge, or contribute the fix you needed.
          </p>
        </div>

        <a
          class="modekit-developer-section__action"
          href="https://github.com/modekit/modekit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Support on GitHub <span aria-hidden="true">↗</span>
        </a>
      </section>
    </template>
  </DefaultTheme.Layout>
</template>
