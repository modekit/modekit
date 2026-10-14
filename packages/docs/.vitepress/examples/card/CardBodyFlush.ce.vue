<script lang="ts">
import { definePreview } from '../../components/preview.js'

const scriptEnd = ['<', '/script>'].join('')

export const preview = definePreview({
  componentName: 'MkCard',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { MkBadge, MkButton, MkCard, MkFlex, MkGrid, MkText } from '@modekit/vue'
${scriptEnd}

<template>
  <MkCard
    body="flush"
    description="Checks required before publishing."
    size="md"
    title="Release readiness"
    variant="muted"
    style="width: min(100%, 24rem)"
  >
    <template #header-actions>
      <MkButton size="sm" variant="ghost">View report</MkButton>
    </template>

    <MkGrid gap="l">
      <MkFlex align="center" gap="l" justify="space-between">
        <MkText>Automated tests</MkText>
        <MkBadge color="green" size="sm" variant="soft">Passed</MkBadge>
      </MkFlex>
      <MkFlex align="center" gap="l" justify="space-between">
        <MkText>Accessibility scan</MkText>
        <MkBadge color="green" size="sm" variant="soft">Passed</MkBadge>
      </MkFlex>
      <MkFlex align="center" gap="l" justify="space-between">
        <MkText>Package validation</MkText>
        <MkBadge color="amber" size="sm" variant="soft">Review</MkBadge>
      </MkFlex>
    </MkGrid>
  </MkCard>
</template>`,
})
</script>

<script setup lang="ts">
import { MkBadge, MkButton, MkCard, MkFlex, MkGrid, MkText } from '@modekit/vue'
</script>

<template>
  <MkCard
    body="flush"
    description="Checks required before publishing."
    size="md"
    style="width: min(100%, 24rem)"
    title="Release readiness"
    variant="muted"
  >
    <template #header-actions>
      <MkButton size="sm" variant="ghost">View report</MkButton>
    </template>

    <MkGrid gap="l">
      <MkFlex align="center" gap="l" justify="space-between">
        <MkText size="sm">Automated tests</MkText>
        <MkBadge color="green" size="sm" variant="soft">Passed</MkBadge>
      </MkFlex>
      <MkFlex align="center" gap="l" justify="space-between">
        <MkText size="sm">Accessibility scan</MkText>
        <MkBadge color="green" size="sm" variant="soft">Passed</MkBadge>
      </MkFlex>
      <MkFlex align="center" gap="l" justify="space-between">
        <MkText size="sm">Package validation</MkText>
        <MkBadge color="rose" size="sm" variant="soft">Failed</MkBadge>
      </MkFlex>
    </MkGrid>
  </MkCard>
</template>
