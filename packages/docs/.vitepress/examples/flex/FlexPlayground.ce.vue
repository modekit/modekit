<script lang="ts">
import {
  flexAlignments,
  flexDirections,
  flexJustifications,
  flexSpacePresets,
  flexWraps,
} from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkFlex',
  content: '',
  controls: [
    {
      prop: 'direction',
      label: 'direction',
      defaultValue: 'row',
      options: selectOptions(flexDirections),
    },
    {
      prop: 'wrap',
      label: 'wrap',
      defaultValue: 'wrap',
      options: selectOptions(flexWraps),
    },
    {
      prop: 'align',
      label: 'align',
      defaultValue: 'stretch',
      options: selectOptions(flexAlignments),
    },
    {
      prop: 'justify',
      label: 'justify',
      defaultValue: 'start',
      options: selectOptions(flexJustifications),
    },
    {
      prop: 'gap',
      label: 'gap',
      defaultValue: 'm',
      options: selectOptions(flexSpacePresets),
    },
  ],
  code: (values) => `<MkFlex
  direction="${String(values.direction)}"
  wrap="${String(values.wrap)}"
  align="${String(values.align)}"
  justify="${String(values.justify)}"
  gap="${String(values.gap)}"
>
  <MkCard v-for="item in 4" :key="item" variant="outline" size="sm">
    Item {{ item }}
  </MkCard>
</MkFlex>`,
})
</script>

<script setup lang="ts">
import {
  MkCard,
  MkFlex,
  type FlexAlign,
  type FlexDirection,
  type FlexGap,
  type FlexJustify,
  type FlexWrap,
} from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    align?: FlexAlign
    direction?: FlexDirection
    gap?: FlexGap
    justify?: FlexJustify
    wrap?: FlexWrap
  }>(),
  {
    align: 'stretch',
    direction: 'row',
    gap: 'm',
    justify: 'start',
    wrap: 'wrap',
  },
)
</script>

<template>
  <MkFlex
    class="flex-playground"
    :align="props.align"
    :direction="props.direction"
    :gap="props.gap"
    :justify="props.justify"
    :wrap="props.wrap"
  >
    <MkCard v-for="item in 4" :key="item" class="flex-playground__item" variant="outline" size="sm">
      Item {{ item }}
    </MkCard>
  </MkFlex>
</template>

<style>
.flex-playground {
  width: min(100%, 32rem);
  min-height: 12rem;
  padding: 0.75rem;
  border: 1px dashed var(--mk-neutral-300);
  border-radius: 0.75rem;
}

.flex-playground__item {
  flex: 0 1 7rem;
}

.dark .flex-playground {
  border-color: var(--mk-neutral-700);
}
</style>
