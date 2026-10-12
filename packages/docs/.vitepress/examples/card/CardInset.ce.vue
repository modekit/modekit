<script lang="ts">
import { cardSizes, cardVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkCard',
  content: 'Profile form',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'muted',
      options: selectOptions(cardVariants),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(cardSizes),
    },
  ],
  code: (
    values,
  ) => `<MkCard variant="${String(values.variant)}" body="inset" size="${String(values.size)}">
  <template #header>
    <div class="profile-header">
      <div>
        <strong>Profile</strong>
        <small>This is how others will see you</small>
      </div>
      <button aria-label="More options">•••</button>
    </div>
  </template>

  <div class="profile-form">
    <label>Name <input value="Olivia Martin" /></label>
    <label>Bio <textarea placeholder="A few words about yourself" /></label>
  </div>

  <template #footer>
    <div class="profile-footer">
      <small>Last saved 2 minutes ago</small>
      <div class="profile-actions">
        <button>Cancel</button>
        <MkButton size="sm">Save</MkButton>
      </div>
    </div>
  </template>
</MkCard>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkCard } from '@modekit/vue'
import type { CardSize, CardVariant } from '@modekit/vue'

withDefaults(
  defineProps<{
    size?: CardSize
    variant?: CardVariant
  }>(),
  {
    size: 'md',
    variant: 'muted',
  },
)
</script>

<template>
  <MkCard class="profile-card" body="inset" :size="size" :variant="variant">
    <template #header>
      <div class="profile-header">
        <div>
          <strong>Profile</strong>
          <small>This is how others will see you</small>
        </div>
        <button type="button" aria-label="More options">•••</button>
      </div>
    </template>

    <div class="profile-form">
      <label>
        <span>Name</span>
        <input value="Olivia Martin" />
      </label>
      <label>
        <span>Bio</span>
        <textarea rows="2" placeholder="A few words about yourself" />
      </label>
    </div>

    <template #footer>
      <div class="profile-footer">
        <small>Last saved 2 minutes ago</small>
        <div class="profile-actions">
          <button type="button">Cancel</button>
          <MkButton size="sm">Save</MkButton>
        </div>
      </div>
    </template>
  </MkCard>
</template>

<style>
.profile-card {
  width: min(100%, 24rem);
  color: var(--color-neutral-950);
  font-family: var(--font-sans);
}

.profile-header,
.profile-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.profile-header > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.profile-header strong {
  font-size: 1rem;
  line-height: 1.5rem;
}

.profile-header small,
.profile-footer small {
  color: var(--color-neutral-500);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.profile-header button,
.profile-actions > button {
  appearance: none;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
}

.profile-header button {
  align-self: flex-start;
  padding: 0.25rem;
  line-height: 1rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-form label {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.profile-form input,
.profile-form textarea {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid var(--color-neutral-200);
  border-radius: 0.5rem;
  background: transparent;
  color: inherit;
  font: inherit;
  outline: none;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
}

.profile-form input {
  height: 2.5rem;
  padding: 0 0.75rem;
}

.profile-form textarea {
  min-height: 4rem;
  padding: 0.625rem 0.75rem;
  resize: vertical;
}

.profile-form textarea::placeholder {
  color: var(--color-neutral-400);
}

.profile-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.profile-actions > button {
  padding: 0.5rem 0.75rem;
}

@media (max-width: 28rem) {
  .profile-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
