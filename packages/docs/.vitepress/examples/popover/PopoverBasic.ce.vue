<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkPopover',
  content: '',
  controls: [],
  code: () => `<template>
  <MkPopover>
    <MkButton variant="outline">Open popover</MkButton>

    <template #content="{ close }">
      <MkGrid gap="m" style="width: 16rem">
        <MkHeadline as="h3" size="xs">Workspace settings</MkHeadline>
        <MkText size="sm">Manage the preferences for this workspace.</MkText>
        <MkButton size="sm" @click="close">Done</MkButton>
      </MkGrid>
    </template>
  </MkPopover>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkGrid, MkHeadline, MkPopover, MkText } from '@modekit/vue'
</script>

<template>
  <MkPopover>
    <MkButton variant="outline">Open popover</MkButton>

    <template #content="{ close }">
      <MkGrid gap="m" style="width: 16rem">
        <MkHeadline as="h3" size="xs">Workspace settings</MkHeadline>
        <MkText size="sm">Manage the preferences for this workspace.</MkText>
        <MkButton size="sm" @click="close">Done</MkButton>
      </MkGrid>
    </template>
  </MkPopover>
</template>
