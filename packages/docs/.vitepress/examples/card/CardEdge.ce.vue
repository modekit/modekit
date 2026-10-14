<script lang="ts">
import { definePreview } from '../../components/preview.js'

const scriptEnd = ['<', '/script>'].join('')

export const preview = definePreview({
  componentName: 'MkCardEdge',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { Ellipsis } from '@lucide/vue'
import { MkButton, MkCard, MkCardEdge, MkFlex, MkHeadline, MkText } from '@modekit/vue'
${scriptEnd}

<template>
  <MkCard body="inset" size="md" style="width: min(100%, 24rem)" variant="outline">
    <MkCardEdge>
      <img
        alt="Layered coastal cliffs at sunset"
        class="mk:block mk:aspect-video mk:w-full mk:object-cover"
        src="/card-edge-landscape.svg"
      />
    </MkCardEdge>

    <template #footer>
      <MkFlex align="center" gap="l" justify="space-between" style="width: 100%">
        <MkFlex direction="column" gap="xs">
          <MkHeadline as="h3" size="xs">Coastal planning retreat</MkHeadline>
          <MkText size="sm">October 24–26</MkText>
        </MkFlex>
        <MkButton aria-label="More retreat options" size="sm" square variant="ghost">
          <Ellipsis aria-hidden="true" />
        </MkButton>
      </MkFlex>
    </template>
  </MkCard>
</template>`,
})
</script>

<script setup lang="ts">
import { Ellipsis } from '@lucide/vue'
import { MkButton, MkCard, MkCardEdge, MkFlex, MkHeadline, MkText } from '@modekit/vue'
</script>

<template>
  <MkCard body="inset" size="md" style="width: min(100%, 24rem)" variant="outline">
    <MkCardEdge>
      <img
        alt="Layered coastal cliffs at sunset"
        class="mk:block mk:aspect-video mk:w-full mk:object-cover"
        src="/card-edge-landscape.svg"
      />
    </MkCardEdge>

    <template #footer>
      <MkFlex align="center" gap="l" justify="space-between" style="width: 100%">
        <MkFlex direction="column" gap="xs">
          <MkHeadline as="h3" size="xs">Coastal planning retreat</MkHeadline>
          <MkText size="sm">October 24–26</MkText>
        </MkFlex>
        <MkButton aria-label="More retreat options" size="sm" square variant="ghost">
          <Ellipsis aria-hidden="true" />
        </MkButton>
      </MkFlex>
    </template>
  </MkCard>
</template>
