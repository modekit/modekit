<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkHoverCard',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkHoverCard arrow>
    <MkLink href="/profiles/maya">@maya</MkLink>

    <template #content>
      <MkFlex gap="m" align="start">
        <MkAvatar fallback="MC" color="primary" size="lg" />
        <MkGrid gap="xs">
          <MkHeadline as="h3" size="xs">Maya Chen</MkHeadline>
          <MkCaption>@maya</MkCaption>
          <MkText size="sm">Design systems engineer building accessible tools.</MkText>
        </MkGrid>
      </MkFlex>
    </template>
  </MkHoverCard>
</template>`,
})
</script>

<script setup lang="ts">
import {
  MkAvatar,
  MkCaption,
  MkFlex,
  MkGrid,
  MkHeadline,
  MkHoverCard,
  MkLink,
  MkText,
} from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkHoverCard arrow :portal="portalTarget">
    <MkLink href="/profiles/maya">@maya</MkLink>

    <template #content>
      <MkFlex gap="m" align="start">
        <MkAvatar fallback="MC" color="primary" size="lg" />
        <MkGrid gap="xs">
          <MkHeadline as="h3" size="xs">Maya Chen</MkHeadline>
          <MkCaption>@maya</MkCaption>
          <MkText size="sm">Design systems engineer building accessible tools.</MkText>
        </MkGrid>
      </MkFlex>
    </template>
  </MkHoverCard>
</template>
