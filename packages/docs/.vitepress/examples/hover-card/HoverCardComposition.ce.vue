<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkHoverCard',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkHoverCard>
    <MkLink href="/workspaces/acme">Acme workspace</MkLink>

    <template #content>
      <MkGrid gap="m">
        <MkGrid gap="xs">
          <MkHeadline as="h3" size="xs">Acme workspace</MkHeadline>
          <MkText size="sm">Product, design, and engineering collaboration.</MkText>
        </MkGrid>
        <MkFlex gap="s" wrap="wrap">
          <MkBadge variant="soft">18 members</MkBadge>
          <MkBadge color="green" variant="soft">Active</MkBadge>
        </MkFlex>
        <MkLink href="/workspaces/acme" primary>View workspace</MkLink>
      </MkGrid>
    </template>
  </MkHoverCard>
</template>`,
})
</script>

<script setup lang="ts">
import { MkBadge, MkFlex, MkGrid, MkHeadline, MkHoverCard, MkLink, MkText } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkHoverCard :portal="portalTarget">
    <MkLink href="/workspaces/acme">Acme workspace</MkLink>

    <template #content>
      <MkGrid gap="m">
        <MkGrid gap="xs">
          <MkHeadline as="h3" size="xs">Acme workspace</MkHeadline>
          <MkText size="sm">Product, design, and engineering collaboration.</MkText>
        </MkGrid>
        <MkFlex gap="s" wrap="wrap">
          <MkBadge variant="soft">18 members</MkBadge>
          <MkBadge color="green" variant="soft">Active</MkBadge>
        </MkFlex>
        <MkLink href="/workspaces/acme" primary>View workspace</MkLink>
      </MkGrid>
    </template>
  </MkHoverCard>
</template>
