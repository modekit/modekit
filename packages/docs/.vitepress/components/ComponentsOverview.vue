<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import { withBase } from 'vitepress'

import ComponentsOverviewPreview from './ComponentsOverviewPreview.vue'

const components = [
  {
    id: 'grid',
    name: 'Grid',
    category: 'Layout',
    description: 'Arrange content in fixed or responsive native CSS Grid tracks.',
    href: '/components/grid',
  },
  {
    id: 'spacing',
    name: 'Spacing',
    category: 'Layout',
    description: 'Create explicit vertical rhythm with presets, pixels, or design tokens.',
    href: '/components/spacing',
  },
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'Element',
    description: 'Represent people and entities with images, initials, and status.',
    href: '/components/avatar',
  },
  {
    id: 'avatar-group',
    name: 'Avatar Group',
    category: 'Element',
    description: 'Compose overlapping avatars with controlled spacing and overflow.',
    href: '/components/avatar-group',
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'Element',
    description: 'Add compact status, metadata, and classification labels.',
    href: '/components/badge',
  },
  {
    id: 'button',
    name: 'Button',
    category: 'Element',
    description: 'Trigger actions with expressive variants, states, and icon slots.',
    href: '/components/button',
  },
  {
    id: 'button-group',
    name: 'Button Group',
    category: 'Element',
    description: 'Connect related actions while each Button keeps its own behavior.',
    href: '/components/button-group',
  },
  {
    id: 'callout',
    name: 'Callout',
    category: 'Feedback',
    description: 'Surface contextual guidance and important status messages.',
    href: '/components/callout',
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Element',
    description: 'Structure related content with composable header, body, and footer.',
    href: '/components/card',
  },
  {
    id: 'headline',
    name: 'Headline',
    category: 'Typography',
    description: 'Create semantic headings with an independent visual hierarchy.',
    href: '/components/headline',
  },
  {
    id: 'text',
    name: 'Text',
    category: 'Typography',
    description: 'Style labels, metadata, and short interface copy consistently.',
    href: '/components/text',
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    category: 'Typography',
    description: 'Render readable body copy with size-aware rhythm.',
    href: '/components/paragraph',
  },
  {
    id: 'caption',
    name: 'Caption',
    category: 'Typography',
    description: 'Present subordinate metadata on a compact text scale.',
    href: '/components/caption',
  },
  {
    id: 'ellipsis-text',
    name: 'Ellipsis Text',
    category: 'Typography',
    description: 'Constrain long content to a predictable number of lines.',
    href: '/components/ellipsis-text',
  },
  {
    id: 'mark',
    name: 'Mark',
    category: 'Typography',
    description: 'Highlight relevant inline content with semantic treatments.',
    href: '/components/mark',
  },
  {
    id: 'link',
    name: 'Link',
    category: 'Typography',
    description: 'Apply consistent treatments to native anchor navigation.',
    href: '/components/link',
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'Form',
    description: 'Capture independent choices with clear labels and descriptions.',
    href: '/components/checkbox',
  },
  {
    id: 'input',
    name: 'Input',
    category: 'Form',
    description: 'Collect text with flexible states, labels, and affix content.',
    href: '/components/input',
  },
  {
    id: 'label',
    name: 'Label',
    category: 'Form',
    description: 'Give form controls consistent, accessible names and requirements.',
    href: '/components/label',
  },
  {
    id: 'spinner',
    name: 'Spinner',
    category: 'Feedback',
    description: 'Communicate indeterminate progress at any interface scale.',
    href: '/components/spinner',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'Navigation',
    description: 'Organize related views with keyboard-accessible navigation.',
    href: '/components/tabs',
  },
] as const

const componentGroups = ['Layout', 'Element', 'Typography', 'Form', 'Feedback', 'Navigation'].map(
  (category) => ({
    category,
    components: components.filter((component) => component.category === category),
  }),
)
</script>

<template>
  <div class="components-overview">
    <section
      v-for="group in componentGroups"
      :key="group.category"
      class="components-overview__group"
      :aria-labelledby="`components-${group.category.toLowerCase()}`"
    >
      <header class="components-overview__group-header">
        <h2 :id="`components-${group.category.toLowerCase()}`">{{ group.category }}</h2>
        <span>{{ group.components.length }}</span>
      </header>

      <div class="components-overview__grid">
        <article
          v-for="component in group.components"
          :key="component.id"
          class="component-tile"
          :class="`component-tile--${component.id}`"
        >
          <div class="component-tile__preview" inert aria-hidden="true">
            <ComponentsOverviewPreview :kind="component.id" />
          </div>

          <div class="component-tile__body">
            <div class="component-tile__meta">
              <span>{{ component.category }}</span>
              <a
                class="component-tile__link"
                :href="withBase(component.href)"
                :aria-label="`Explore ${component.name}`"
              >
                Explore
                <ArrowUpRight :size="15" aria-hidden="true" />
              </a>
            </div>
            <h3>{{ component.name }}</h3>
            <p>{{ component.description }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.components-overview {
  min-width: 0;
  max-width: 100%;
  margin-top: 2rem;
}

.components-overview__group + .components-overview__group {
  margin-top: 3rem;
}

.components-overview__group-header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}

.components-overview__group-header h2 {
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--vp-c-text-1);
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  line-height: 1.35;
}

.components-overview__group-header span {
  display: inline-flex;
  min-width: 1.65rem;
  height: 1.65rem;
  align-items: center;
  justify-content: center;
  padding: 0 0.45rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 700;
}

.components-overview__grid {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.component-tile {
  --tile-accent: var(--vp-c-brand-1);
  position: relative;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.9rem;
  background: var(--vp-c-bg);
  box-shadow: 0 1px 2px rgb(0 0 0 / 3%);
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.component-tile:hover {
  border-color: color-mix(in srgb, var(--tile-accent) 42%, var(--vp-c-divider));
  box-shadow: 0 14px 34px rgb(0 0 0 / 9%);
  transform: translateY(-2px);
}

.component-tile:has(.component-tile__link:focus-visible) {
  border-color: var(--vp-c-brand-1);
  outline: 3px solid color-mix(in srgb, var(--vp-c-brand-1) 25%, transparent);
  outline-offset: 2px;
}

.component-tile--avatar-group,
.component-tile--headline,
.component-tile--text,
.component-tile--paragraph,
.component-tile--caption,
.component-tile--ellipsis-text,
.component-tile--mark,
.component-tile--link,
.component-tile--input,
.component-tile--tabs {
  --tile-accent: var(--vp-c-indigo-1, #6366f1);
}

.component-tile--badge,
.component-tile--callout,
.component-tile--spinner {
  --tile-accent: var(--vp-c-green-1, #10b981);
}

.component-tile--button,
.component-tile--checkbox,
.component-tile--label {
  --tile-accent: var(--vp-c-yellow-1, #f59e0b);
}

.component-tile__preview {
  position: relative;
  display: flex;
  min-height: 9.25rem;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  overflow: hidden;
  border-bottom: 1px solid var(--vp-c-divider);
  background:
    linear-gradient(color-mix(in srgb, var(--vp-c-divider) 45%, transparent) 1px, transparent 1px),
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--vp-c-divider) 45%, transparent) 1px,
      transparent 1px
    ),
    radial-gradient(
      circle at 50% 30%,
      color-mix(in srgb, var(--tile-accent) 12%, transparent),
      transparent 60%
    ),
    var(--vp-c-bg-soft);
  background-size:
    1.25rem 1.25rem,
    1.25rem 1.25rem,
    auto,
    auto;
}

.component-tile__preview::after {
  position: absolute;
  right: -2.5rem;
  bottom: -3.5rem;
  width: 8rem;
  height: 8rem;
  border: 1px solid color-mix(in srgb, var(--tile-accent) 18%, transparent);
  border-radius: 999px;
  content: '';
  pointer-events: none;
}

.component-tile__body {
  padding: 1rem 1rem 1.1rem;
}

.component-tile__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.45rem;
}

.component-tile__meta > span {
  color: var(--vp-c-text-3);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.component-tile__link {
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;
  color: var(--vp-c-brand-1);
  font-size: 0.75rem;
  font-weight: 650;
  text-decoration: none;
}

.component-tile__link::after {
  position: absolute;
  inset: 0;
  content: '';
}

.component-tile__link:focus-visible {
  outline: none;
}

.component-tile__link svg {
  transition: transform 180ms ease;
}

.component-tile:hover .component-tile__link svg {
  transform: translate(1px, -1px);
}

.component-tile h3 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 1rem;
  letter-spacing: -0.01em;
}

.component-tile p {
  margin: 0.35rem 0 0;
  overflow-wrap: anywhere;
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  line-height: 1.55;
}

@media (max-width: 959px) {
  .components-overview__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 639px) {
  .components-overview__grid {
    grid-template-columns: 1fr;
  }

  .component-tile__preview {
    min-height: 8.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .component-tile,
  .component-tile__link svg {
    transition: none;
  }
}
</style>
