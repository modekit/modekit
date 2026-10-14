<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkPopover',
  content: '',
  controls: [],
  code: () => `<template>
  <MkPopover align="start" arrow>
    <MkButton variant="outline">Filter projects</MkButton>

    <template #content="{ close }">
      <MkGrid gap="m" style="width: 18rem">
        <MkHeadline as="h3" size="xs">Project status</MkHeadline>
        <MkCheckbox label="Active" :default-value="true" />
        <MkCheckbox label="Paused" />
        <MkCheckbox label="Archived" />
        <MkSeparator />
        <MkFlex gap="s" justify="end">
          <MkButton size="sm" variant="ghost" @click="close">Cancel</MkButton>
          <MkButton size="sm" @click="close">Apply filters</MkButton>
        </MkFlex>
      </MkGrid>
    </template>
  </MkPopover>
</template>`,
})
</script>

<script setup lang="ts">
import {
  MkButton,
  MkCheckbox,
  MkFlex,
  MkGrid,
  MkHeadline,
  MkPopover,
  MkSeparator,
} from '@modekit/vue'
</script>

<template>
  <MkPopover align="start" arrow>
    <MkButton variant="outline">Filter projects</MkButton>

    <template #content="{ close }">
      <MkGrid gap="m" style="width: 18rem">
        <MkHeadline as="h3" size="xs">Project status</MkHeadline>
        <MkCheckbox label="Active" :default-value="true" />
        <MkCheckbox label="Paused" />
        <MkCheckbox label="Archived" />
        <MkSeparator />
        <MkFlex gap="s" justify="end">
          <MkButton size="sm" variant="ghost" @click="close">Cancel</MkButton>
          <MkButton size="sm" @click="close">Apply filters</MkButton>
        </MkFlex>
      </MkGrid>
    </template>
  </MkPopover>
</template>
